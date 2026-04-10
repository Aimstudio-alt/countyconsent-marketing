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
  return { user, county, supabase }
}

// GET /api/dashboard/events — list events with player count
export async function GET(request: NextRequest) {
  const ctx = await verifyCounty(request)
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { county, supabase } = ctx
  const { data: events, error } = await supabase
    .from('county_events')
    .select('id, name, event_date, description, created_at')
    .eq('county_id', county.id)
    .order('event_date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Attach player counts
  const eventsWithCounts = await Promise.all(
    (events || []).map(async ev => {
      const { count } = await supabase
        .from('event_players')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', ev.id)
      return { ...ev, player_count: count ?? 0 }
    })
  )

  return NextResponse.json({ events: eventsWithCounts })
}

// POST /api/dashboard/events — create an event (county_union accounts only)
export async function POST(request: NextRequest) {
  const ctx = await verifyCounty(request)
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { county, supabase } = ctx
  if (county.account_type !== 'county_union') {
    return NextResponse.json({ error: 'Only county union accounts can create events.' }, { status: 403 })
  }

  const body = await request.json()
  const { name, eventDate, description } = body

  if (!name) {
    return NextResponse.json({ error: 'Event name is required.' }, { status: 400 })
  }

  const { data: event, error } = await supabase
    .from('county_events')
    .insert({
      county_id: county.id,
      name,
      event_date: eventDate || null,
      description: description || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ event }, { status: 201 })
}
