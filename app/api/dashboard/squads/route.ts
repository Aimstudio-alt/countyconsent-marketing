import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

async function verifyCounty(request: NextRequest) {
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
  return { county, supabase }
}

// GET /api/dashboard/squads — list squads with player count
export async function GET(request: NextRequest) {
  const ctx = await verifyCounty(request)
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { county, supabase } = ctx
  const { data: squads, error } = await supabase
    .from('squads')
    .select('id, name, description, created_at')
    .eq('county_id', county.id)
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const squadsWithCounts = await Promise.all(
    (squads || []).map(async s => {
      const { count } = await supabase
        .from('squad_players')
        .select('*', { count: 'exact', head: true })
        .eq('squad_id', s.id)
      return { ...s, player_count: count ?? 0 }
    })
  )

  return NextResponse.json({ squads: squadsWithCounts })
}

// POST /api/dashboard/squads — create a squad
export async function POST(request: NextRequest) {
  const ctx = await verifyCounty(request)
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { county, supabase } = ctx
  const body = await request.json()
  const { name, description } = body

  if (!name) return NextResponse.json({ error: 'Squad name is required.' }, { status: 400 })

  const { data: squad, error } = await supabase
    .from('squads')
    .insert({ county_id: county.id, name, description: description || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ squad }, { status: 201 })
}
