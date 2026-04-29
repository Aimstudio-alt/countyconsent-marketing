import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

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

  // Super admins don't have a county row — redirect them to the admin dashboard
  const { data: staffProfile } = await supabase
    .from('staff_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()
  if (staffProfile?.role === 'super_admin') {
    return NextResponse.json({ isSuperAdmin: true })
  }

  const { data: county, error } = await supabase
    .from('counties')
    .select('id, county_union_name, governing_body, secretary_name, email, phone, plan, subscription_status, account_type, parent_county_id, created_at')
    .eq('supabase_user_id', user.id)
    .single()

  if (error || !county) {
    return NextResponse.json({ error: 'County account not found.' }, { status: 404 })
  }

  // If this is a golf club, also return parent county union name
  let parentCountyName: string | null = null
  if (county.account_type === 'golf_club' && county.parent_county_id) {
    const { data: parent } = await supabase
      .from('counties')
      .select('county_union_name')
      .eq('id', county.parent_county_id)
      .single()
    parentCountyName = parent?.county_union_name ?? null
  }

  return NextResponse.json({ county: { ...county, parent_county_name: parentCountyName } })
}
