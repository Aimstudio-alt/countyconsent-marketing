import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/dashboard/players/search?q=...
// County Union accounts only. Searches for consent_received players
// across all golf clubs linked to this county union.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.replace('Bearer ', '')
  const supabase = createServiceClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: county } = await supabase
    .from('counties')
    .select('id, account_type')
    .eq('supabase_user_id', user.id)
    .single()

  if (!county) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (county.account_type !== 'county_union') {
    return NextResponse.json({ error: 'Search all clubs is only available to county union accounts.' }, { status: 403 })
  }

  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''

  // Find all golf clubs linked to this county union
  const { data: linkedClubs } = await supabase
    .from('counties')
    .select('id, county_union_name')
    .eq('parent_county_id', county.id)
    .eq('account_type', 'golf_club')

  if (!linkedClubs || linkedClubs.length === 0) {
    return NextResponse.json({ players: [] })
  }

  const clubIds = linkedClubs.map(c => c.id)

  // Build a map for quick club name lookup
  const clubMap = Object.fromEntries(linkedClubs.map(c => [c.id, c.county_union_name]))

  // Search for consent_received players in linked clubs
  let query = supabase
    .from('players')
    .select('id, county_id, full_name, date_of_birth, consent_status, created_at')
    .in('county_id', clubIds)
    .eq('consent_status', 'consent_received')
    .order('full_name')
    .limit(100)

  // Apply search filter if provided
  if (q) {
    query = query.ilike('full_name', `%${q}%`)
  }

  const { data: players, error } = await query

  if (error) {
    console.error('[players/search]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If q looks like a club name search, also match on club name
  let results = players || []
  if (q) {
    const lq = q.toLowerCase()
    const clubMatchIds = linkedClubs
      .filter(c => c.county_union_name.toLowerCase().includes(lq))
      .map(c => c.id)

    if (clubMatchIds.length > 0) {
      // Fetch players from matching clubs that aren't already in results
      const existingIds = new Set(results.map(p => p.id))
      const { data: clubPlayers } = await supabase
        .from('players')
        .select('id, county_id, full_name, date_of_birth, consent_status, created_at')
        .in('county_id', clubMatchIds)
        .eq('consent_status', 'consent_received')
        .order('full_name')
        .limit(100)

      if (clubPlayers) {
        for (const p of clubPlayers) {
          if (!existingIds.has(p.id)) {
            results.push(p)
          }
        }
      }
    }
  }

  // Annotate each player with their club name
  const annotated = results.map(p => ({
    ...p,
    club_name: clubMap[p.county_id] ?? 'Unknown club',
  }))

  return NextResponse.json({ players: annotated })
}
