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
    .select('id, account_type, subscription_status')
    .eq('supabase_user_id', user.id)
    .single()
  if (!county) return null
  return { user, county, supabase }
}

// GET /api/dashboard/players — list own players
export async function GET(request: NextRequest) {
  const ctx = await verifyCounty(request)
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { county, supabase } = ctx
  const { data: players, error } = await supabase
    .from('players')
    .select('*')
    .eq('county_id', county.id)
    .order('full_name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ players: players || [] })
}

// POST /api/dashboard/players — add a player
export async function POST(request: NextRequest) {
  const ctx = await verifyCounty(request)
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { county, supabase } = ctx
  const body = await request.json()
  const { fullName, dateOfBirth, parentName, parentEmail, consentStatus } = body

  if (!fullName) {
    return NextResponse.json({ error: 'Player name is required.' }, { status: 400 })
  }

  const { data: player, error } = await supabase
    .from('players')
    .insert({
      county_id: county.id,
      full_name: fullName,
      date_of_birth: dateOfBirth || null,
      parent_name: parentName || null,
      parent_email: parentEmail || null,
      consent_status: consentStatus || 'pending',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ player }, { status: 201 })
}

// PATCH /api/dashboard/players — update a player's consent status
export async function PATCH(request: NextRequest) {
  const ctx = await verifyCounty(request)
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { county, supabase } = ctx
  const body = await request.json()
  const { playerId, consentStatus } = body

  if (!playerId || !consentStatus) {
    return NextResponse.json({ error: 'playerId and consentStatus are required.' }, { status: 400 })
  }

  const validStatuses = ['pending', 'consent_received', 'declined', 'expired']
  if (!validStatuses.includes(consentStatus)) {
    return NextResponse.json({ error: 'Invalid consent status.' }, { status: 400 })
  }

  const { data: player, error } = await supabase
    .from('players')
    .update({ consent_status: consentStatus, updated_at: new Date().toISOString() })
    .eq('id', playerId)
    .eq('county_id', county.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!player) return NextResponse.json({ error: 'Player not found.' }, { status: 404 })
  return NextResponse.json({ player })
}
