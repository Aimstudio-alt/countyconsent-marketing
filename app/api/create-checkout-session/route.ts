import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    if (plan !== 'monthly' && plan !== 'annual') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const isTest = process.env.STRIPE_MODE === 'test'
    const stripeKey = isTest ? process.env.TEST_STRIPE_SECRET_KEY! : process.env.STRIPE_SECRET_KEY!
    const stripe = new Stripe(stripeKey)

    const priceId = plan === 'monthly'
      ? (isTest ? process.env.TEST_STRIPE_MONTHLY_PRICE_ID! : process.env.STRIPE_MONTHLY_PRICE_ID!)
      : (isTest ? process.env.TEST_STRIPE_ANNUAL_PRICE_ID! : process.env.STRIPE_ANNUAL_PRICE_ID!)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://countyconsent.co.uk'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[create-checkout-session]', msg)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
