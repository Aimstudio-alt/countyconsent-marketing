import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

async function verifyCountyAndSquad(request: NextRequest, squadId: string) {
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
  const { data: squad } = await supabase
    .from('squads')
    .select('id, county_id')
    .eq('id', squadId)
    .eq('county_id', county.id)
    .single()
  if (!squad) return null
  return { county, squad, supabase }
}

// GET /api/dashboard/squads/[id]/players
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: squadId } = await params
  const ctx = await verifyCountyAndSquad(request, squadId)
  if (!ctx) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { supabase } = ctx
  const { data: rows, error } = await supabase
    .from('squad_players')
    .select(`
      id,
      created_at,
      players ( id, full_name, date_of_birth, consent_status, county_id ),
      player_county:counties!squad_players_player_id_fkey ( id, county_union_name )
    `)
    .eq('squad_id', squadId)
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ players: rows || [] })
}

// POST /api/dashboard/squads/[id]/players — add players to a squad
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: squadId } = await params
  const ctx = await verifyCountyAndSquad(request, squadId)
  if (!ctx) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { county, supabase } = ctx
  const body = await request.json()
  const { playerIds } = body as { playerIds: string[] }

  if (!Array.isArray(playerIds) || playerIds.length === 0) {
    return NextResponse.json({ error: 'playerIds array is required.' }, { status: 400 })
  }

  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, county_id')
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
    rows.push({ squad_id: squadId, player_id: player.id })
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: skipped[0] || 'No valid players to add.' }, { status: 400 })
  }

  const { error: insertError } = await supabase
    .from('squad_players')
    .upsert(rows, { onConflict: 'squad_id,player_id', ignoreDuplicates: true })

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })
  return NextResponse.json({ added: rows.length, skipped })
}

// DELETE /api/dashboard/squads/[id]/players — remove a player from a squad
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: squadId } = await params
  const ctx = await verifyCountyAndSquad(request, squadId)
  if (!ctx) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { supabase } = ctx
  const body = await request.json()
  const { playerId } = body as { playerId: string }

  if (!playerId) return NextResponse.json({ error: 'playerId is required.' }, { status: 400 })

  const { error } = await supabase
    .from('squad_players')
    .delete()
    .eq('squad_id', squadId)
    .eq('player_id', playerId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
