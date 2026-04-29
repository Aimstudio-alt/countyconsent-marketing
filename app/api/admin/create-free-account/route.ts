import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServiceClient } from '@/lib/supabase'
import { randomBytes } from 'crypto'

const GOVERNING_BODIES = ['England Golf', 'Scotland Golf', 'Wales Golf', 'Golf Ireland']
const ACCOUNT_TYPES = ['county_union', 'golf_club']

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

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { orgName, adminName, email, accountType, governingBody } = body

  if (!orgName || !adminName || !email || !accountType || !governingBody) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (!ACCOUNT_TYPES.includes(accountType)) {
    return NextResponse.json({ error: 'Invalid account type.' }, { status: 400 })
  }
  if (!GOVERNING_BODIES.includes(governingBody)) {
    return NextResponse.json({ error: 'Invalid governing body.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Generate a random temporary password — never shared with the user
  const tempPassword = randomBytes(24).toString('hex')

  // Create auth user with email pre-confirmed
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { county_union_name: orgName, secretary_name: adminName },
  })

  if (authError) {
    const msg = authError.message?.toLowerCase() ?? ''
    if (msg.includes('already') || msg.includes('exists')) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  // Insert the county record
  const { error: insertError } = await supabase.from('counties').insert({
    supabase_user_id: authData.user.id,
    county_union_name: orgName,
    governing_body: governingBody,
    secretary_name: adminName,
    email,
    phone: '',
    plan: 'complimentary',
    subscription_status: 'active',
    account_type: accountType,
    is_complimentary: true,
  })

  if (insertError) {
    console.error('[admin/create-free-account] insert error:', insertError.message)
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Send password reset email so the user sets their own password on first login.
  // Uses the anon client so Supabase sends its standard recovery email.
  const origin = new URL(request.url).origin
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { error: resetError } = await anonClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/dashboard`,
  })

  if (resetError) {
    // Account is created — don't roll back. Just warn in logs.
    console.warn('[admin/create-free-account] password reset email failed:', resetError.message)
  }

  return NextResponse.json({
    success: true,
    account: {
      orgName,
      adminName,
      email,
      accountType,
      governingBody,
      resetEmailSent: !resetError,
    },
  })
}
