import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await context.params
  const body = await request.json()
  const { subscription_status } = body

  if (!subscription_status) {
    return NextResponse.json({ error: 'subscription_status is required.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('counties')
    .update({ subscription_status })
    .eq('id', id)

  if (error) {
    console.error('[admin/counties PATCH]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await context.params
  const supabase = createServiceClient()

  const { data: county } = await supabase
    .from('counties')
    .select('supabase_user_id')
    .eq('id', id)
    .single()

  const { error: deleteError } = await supabase
    .from('counties')
    .delete()
    .eq('id', id)

  if (deleteError) {
    console.error('[admin/counties DELETE]', deleteError.message)
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  if (county?.supabase_user_id) {
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(county.supabase_user_id)
    if (authDeleteError) console.error('[admin/counties DELETE] auth user delete:', authDeleteError.message)
  }

  return NextResponse.json({ success: true })
}
