import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

const GOVERNING_BODIES = ['England Golf', 'Scotland Golf', 'Wales Golf', 'Golf Ireland']

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.replace('Bearer ', '')
  const supabase = createServiceClient()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await supabase
    .from('staff_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  if (profile?.role !== 'super_admin') return null
  return user
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()

  const { data: counties, error } = await supabase
    .from('counties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin/counties GET]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Fetch last login for each county from auth.users
  const countiesWithLogin = await Promise.all(
    (counties || []).map(async (county) => {
      if (!county.supabase_user_id) return { ...county, last_login: null }
      const { data } = await supabase.auth.admin.getUserById(county.supabase_user_id)
      return { ...county, last_login: data?.user?.last_sign_in_at || null }
    })
  )

  return NextResponse.json({ counties: countiesWithLogin })
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { countyUnionName, governingBody, secretaryName, email, phone, plan, password } = body

  if (!countyUnionName || !governingBody || !secretaryName || !email || !phone || !plan || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (!GOVERNING_BODIES.includes(governingBody)) {
    return NextResponse.json({ error: 'Invalid governing body.' }, { status: 400 })
  }
  if (!['monthly', 'annual', 'pilot'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { county_union_name: countyUnionName, secretary_name: secretaryName },
  })

  if (authError) {
    const msg = authError.message?.toLowerCase() || ''
    if (msg.includes('already') || msg.includes('exists')) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  const { error: insertError } = await supabase.from('counties').insert({
    supabase_user_id: authData.user.id,
    county_union_name: countyUnionName,
    governing_body: governingBody,
    secretary_name: secretaryName,
    email,
    phone,
    plan,
    subscription_status: 'active',
  })

  if (insertError) {
    console.error('[admin/counties POST] insert error:', insertError.message)
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
