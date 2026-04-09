import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { countyUnionName, governingBody, secretaryName, email, phone, password, plan } = body

    // Validate required fields
    if (!countyUnionName || !governingBody || !secretaryName || !email || !phone || !password || !plan) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (plan !== 'monthly' && plan !== 'annual') {
      return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        county_union_name: countyUnionName,
        secretary_name: secretaryName,
      },
    })

    if (authError) {
      const msg = authError.message || ''
      console.error('Supabase auth error:', msg)
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('unique')) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      }
      return NextResponse.json({ error: `Auth error: ${msg}` }, { status: 500 })
    }

    const userId = authData.user.id

    // Insert into counties table with pending_payment status
    const { error: insertError } = await supabase.from('counties').insert({
      supabase_user_id: userId,
      county_union_name: countyUnionName,
      governing_body: governingBody,
      secretary_name: secretaryName,
      email,
      phone,
      plan,
      subscription_status: 'pending_payment',
    })

    if (insertError) {
      console.error('Counties insert error:', insertError)
      // Clean up auth user if counties insert fails
      await supabase.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: `Database error: ${insertError.message}` }, { status: 500 })
    }

    // Create Stripe Checkout session
    const priceId =
      plan === 'monthly'
        ? process.env.STRIPE_MONTHLY_PRICE_ID!
        : process.env.STRIPE_ANNUAL_PRICE_ID!

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://countyconsent.co.uk'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 30,
        metadata: {
          supabase_user_id: userId,
          county_union_name: countyUnionName,
          governing_body: governingBody,
          secretary_name: secretaryName,
          phone,
          plan,
        },
      },
      metadata: {
        supabase_user_id: userId,
        plan,
      },
      success_url: `${appUrl}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/signup?plan=${plan}`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Signup error:', msg)
    return NextResponse.json({ error: `Unexpected error: ${msg}` }, { status: 500 })
  }
}
