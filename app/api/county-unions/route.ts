import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// Returns all active county union accounts — used to populate the
// "which county union do you belong to?" dropdown on the sign-up form.
export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('counties')
    .select('id, county_union_name, governing_body')
    .eq('account_type', 'county_union')
    .in('subscription_status', ['active', 'trialing', 'pilot'])
    .order('county_union_name')

  if (error) {
    console.error('[county-unions GET]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ countyUnions: data || [] })
}
