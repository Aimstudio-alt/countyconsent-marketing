import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/dashboard/events/[id]/players — list players on an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.replace('Bearer ', '')
  const supabase = createServiceClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: county } = await supabase
    .from('counties')
    .select('id')
    .eq('supabase_user_id', user.id)
    .single()
  if (!county) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify the event belongs to this county
  const { data: event } = await supabase
    .from('county_events')
    .select('id')
    .eq('id', eventId)
    .eq('county_id', county.id)
    .single()
  if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })

  const { data: rows, error } = await supabase
    .from('event_players')
    .select(`
      id,
      is_cross_county,
      created_at,
      players ( id, full_name, date_of_birth, consent_status ),
      player_county:counties!event_players_player_county_id_fkey ( id, county_union_name )
    `)
    .eq('event_id', eventId)
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ players: rows || [] })
}

// POST /api/dashboard/events/[id]/players — add player(s) to event
// County unions can add players from linked clubs (cross-county).
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const token = authHeader.replace('Bearer ', '')
  const supabase = createServiceClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: county } = await supabase
    .from('counties')
    .select('id, account_type')
    .eq('supabase_user_id', user.id)
    .single()
  if (!county) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify event belongs to this county
  const { data: event } = await supabase
    .from('county_events')
    .select('id, county_id')
    .eq('id', eventId)
    .eq('county_id', county.id)
    .single()
  if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 })

  const body = await request.json()
  const { playerIds } = body as { playerIds: string[] }

  if (!Array.isArray(playerIds) || playerIds.length === 0) {
    return NextResponse.json({ error: 'playerIds array is required.' }, { status: 400 })
  }

  // Fetch the players to validate they exist and have consent
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, county_id, consent_status')
    .in('id', playerIds)

  if (playersError || !players) {
    return NextResponse.json({ error: 'Failed to look up players.' }, { status: 500 })
  }

  // Get all clubs linked to this county union (for cross-county permission check)
  let linkedClubIds: string[] = []
  if (county.account_type === 'county_union') {
    const { data: linkedClubs } = await supabase
      .from('counties')
      .select('id')
      .eq('parent_county_id', county.id)
      .eq('account_type', 'golf_club')
    linkedClubIds = (linkedClubs || []).map(c => c.id)
  }

  const rows = []
  const errors: string[] = []

  for (const player of players) {
    if (player.consent_status !== 'consent_received') {
      errors.push(`Player ${player.id} does not have consent_received status.`)
      continue
    }

    const isOwnPlayer = player.county_id === county.id
    const isLinkedClub = linkedClubIds.includes(player.county_id)
    const isCrossCounty = !isOwnPlayer && isLinkedClub

    if (!isOwnPlayer && !isCrossCounty) {
      errors.push(`Player ${player.id} is not from a club linked to your county union.`)
      continue
    }

    rows.push({
      event_id: eventId,
      player_id: player.id,
      player_county_id: player.county_id,
      added_by_county_id: county.id,
      is_cross_county: isCrossCounty,
    })
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: errors[0] || 'No valid players to add.' }, { status: 400 })
  }

  const { error: insertError } = await supabase
    .from('event_players')
    .upsert(rows, { onConflict: 'event_id,player_id', ignoreDuplicates: true })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ added: rows.length, skipped: errors })
}
