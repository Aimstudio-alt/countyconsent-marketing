import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

async function verifyCountyAndTrip(request: NextRequest, tripId: string) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.replace('Bearer ', '')
  const supabase = createServiceClient()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  const { data: county } = await supabase
    .from('counties')
    .select('id, account_type')
    .eq('supabase_user_id', user.id)
    .single()
  if (!county) return null
  const { data: trip } = await supabase
    .from('trips')
    .select('id, county_id')
    .eq('id', tripId)
    .eq('county_id', county.id)
    .single()
  if (!trip) return null
  return { county, trip, supabase }
}

// GET /api/dashboard/trips/[id]/players
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tripId } = await params
  const ctx = await verifyCountyAndTrip(request, tripId)
  if (!ctx) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { supabase } = ctx
  const { data: rows, error } = await supabase
    .from('trip_players')
    .select(`
      id,
      is_cross_county,
      created_at,
      players ( id, full_name, date_of_birth, consent_status ),
      player_county:counties!trip_players_player_county_id_fkey ( id, county_union_name )
    `)
    .eq('event_id', tripId)
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ players: rows || [] })
}

// POST /api/dashboard/trips/[id]/players — add players to a trip
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tripId } = await params
  const ctx = await verifyCountyAndTrip(request, tripId)
  if (!ctx) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { county, supabase } = ctx
  const body = await request.json()
  const { playerIds } = body as { playerIds: string[] }

  if (!Array.isArray(playerIds) || playerIds.length === 0) {
    return NextResponse.json({ error: 'playerIds array is required.' }, { status: 400 })
  }

  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, county_id, consent_status')
    .in('id', playerIds)

  if (playersError || !players) {
    return NextResponse.json({ error: 'Failed to look up players.' }, { status: 500 })
  }

  // Get linked clubs for cross-county check (county_union accounts only)
  let linkedClubIds: string[] = []
  if (county.account_type === 'county_union') {
    const { data: clubs } = await supabase
      .from('counties')
      .select('id')
      .eq('parent_county_id', county.id)
      .eq('account_type', 'golf_club')
    linkedClubIds = (clubs || []).map(c => c.id)
  }

  const rows = []
  const skipped: string[] = []

  for (const player of players) {
    const isOwn = player.county_id === county.id
    const isCrossCounty = !isOwn && linkedClubIds.includes(player.county_id)

    if (!isOwn && !isCrossCounty) {
      skipped.push(`Player ${player.id} is not accessible to this account.`)
      continue
    }
    // Cross-county additions require consent
    if (isCrossCounty && player.consent_status !== 'consent_received') {
      skipped.push(`Player ${player.id} does not have consent (required for cross-county additions).`)
      continue
    }

    rows.push({
      event_id: tripId,
      player_id: player.id,
      player_county_id: player.county_id,
      added_by_county_id: county.id,
      is_cross_county: isCrossCounty,
    })
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: skipped[0] || 'No valid players to add.' }, { status: 400 })
  }

  const { error: insertError } = await supabase
    .from('trip_players')
    .upsert(rows, { onConflict: 'event_id,player_id', ignoreDuplicates: true })

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })
  return NextResponse.json({ added: rows.length, skipped })
}

// DELETE /api/dashboard/trips/[id]/players — remove a player from a trip
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tripId } = await params
  const ctx = await verifyCountyAndTrip(request, tripId)
  if (!ctx) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { supabase } = ctx
  const body = await request.json()
  const { playerId } = body as { playerId: string }

  if (!playerId) return NextResponse.json({ error: 'playerId is required.' }, { status: 400 })

  const { error } = await supabase
    .from('trip_players')
    .delete()
    .eq('event_id', tripId)
    .eq('player_id', playerId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
