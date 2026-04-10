import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase'

function getStripeClient() {
  const isTest = process.env.STRIPE_MODE === 'test'
  const key = isTest ? process.env.TEST_STRIPE_SECRET_KEY! : process.env.STRIPE_SECRET_KEY!
  return { stripe: new Stripe(key), isTest }
}

function getPriceId(plan: string, isTest: boolean) {
  if (plan === 'monthly') {
    return isTest ? process.env.TEST_STRIPE_MONTHLY_PRICE_ID! : process.env.STRIPE_MONTHLY_PRICE_ID!
  }
  return isTest ? process.env.TEST_STRIPE_ANNUAL_PRICE_ID! : process.env.STRIPE_ANNUAL_PRICE_ID!
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      accountType,
      countyUnionName,
      governingBody,
      secretaryName,
      email,
      phone,
      parentCountyName,
      password,
      plan,
    } = body

    if (!countyUnionName || !governingBody || !secretaryName || !email || !phone || !password || !plan) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (plan !== 'monthly' && plan !== 'annual') {
      return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const resolvedAccountType: 'county_union' | 'golf_club' =
      accountType === 'golf_club' ? 'golf_club' : 'county_union'

    if (resolvedAccountType === 'golf_club' && !parentCountyName) {
      return NextResponse.json({ error: 'Golf clubs must select a county union.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Look up parent county union by name (best-effort — null if not yet registered)
    let resolvedParentCountyId: string | null = null
    if (resolvedAccountType === 'golf_club' && parentCountyName) {
      const { data: parentCounty } = await supabase
        .from('counties')
        .select('id')
        .eq('account_type', 'county_union')
        .ilike('county_union_name', parentCountyName)
        .maybeSingle()
      resolvedParentCountyId = parentCounty?.id ?? null
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        county_union_name: countyUnionName,
        secretary_name: secretaryName,
        account_type: resolvedAccountType,
      },
    })

    if (authError) {
      const msg = authError.message || ''
      console.error('[signup] auth error:', msg)
      if (
        msg.toLowerCase().includes('already registered') ||
        msg.toLowerCase().includes('already exists') ||
        msg.toLowerCase().includes('unique')
      ) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      }
      return NextResponse.json({ error: `Auth error: ${msg}` }, { status: 500 })
    }

    const userId = authData.user.id

    const { error: insertError } = await supabase.from('counties').insert({
      supabase_user_id: userId,
      county_union_name: countyUnionName,
      governing_body: governingBody,
      secretary_name: secretaryName,
      email,
      phone,
      plan,
      subscription_status: 'pending_payment',
      account_type: resolvedAccountType,
      parent_county_id: resolvedAccountType === 'golf_club' ? resolvedParentCountyId : null,
    })

    if (insertError) {
      console.error('[signup] insert error:', insertError.message)
      await supabase.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: `Database error: ${insertError.message}` }, { status: 500 })
    }

    const { stripe, isTest } = getStripeClient()
    const priceId = getPriceId(plan, isTest)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://countyconsent.co.uk'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        supabase_user_id: userId,
        plan,
        account_type: resolvedAccountType,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
          county_union_name: countyUnionName,
          governing_body: governingBody,
          secretary_name: secretaryName,
          phone,
          plan,
          account_type: resolvedAccountType,
          ...(resolvedAccountType === 'golf_club' && parentCountyName
            ? { parent_county_name: parentCountyName }
            : {}),
        },
      },
      success_url: `${appUrl}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/signup?plan=${plan}`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[signup] unexpected error:', msg)
    return NextResponse.json({ error: `Unexpected error: ${msg}` }, { status: 500 })
  }
}
