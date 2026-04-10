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

// GET /api/dashboard/trips — list trips with player count
export async function GET(request: NextRequest) {
  const ctx = await verifyCounty(request)
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { county, supabase } = ctx
  const { data: trips, error } = await supabase
    .from('trips')
    .select('id, name, event_date, description, created_at')
    .eq('county_id', county.id)
    .order('event_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const tripsWithCounts = await Promise.all(
    (trips || []).map(async t => {
      const { count } = await supabase
        .from('trip_players')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', t.id)
      return { ...t, player_count: count ?? 0 }
    })
  )

  return NextResponse.json({ trips: tripsWithCounts })
}

// POST /api/dashboard/trips — create a trip (both account types)
export async function POST(request: NextRequest) {
  const ctx = await verifyCounty(request)
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { county, supabase } = ctx
  const body = await request.json()
  const { name, eventDate, description } = body

  if (!name) return NextResponse.json({ error: 'Trip name is required.' }, { status: 400 })

  const { data: trip, error } = await supabase
    .from('trips')
    .insert({
      county_id: county.id,
      name,
      event_date: eventDate || null,
      description: description || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ trip }, { status: 201 })
}
