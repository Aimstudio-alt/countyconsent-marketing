import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'
import { MONTHLY_PRICE, ACCOUNT_TYPE_LABEL } from '@/lib/pricing'

function getStripeClient() {
  // Default to TEST mode — live billing requires an explicit STRIPE_MODE=live
  // opt-in so a fresh deploy can never take a real payment before env vars are
  // set and tested.
  const isTest = process.env.STRIPE_MODE !== 'live'
  const key = isTest ? process.env.TEST_STRIPE_SECRET_KEY! : process.env.STRIPE_SECRET_KEY!
  return { stripe: new Stripe(key), isTest }
}

// Monthly price is forked by account type:
//   golf_club    → £65/month   (STRIPE_CLUB_PRICE_ID)
//   county_union → £199/month  (STRIPE_COUNTY_PRICE_ID)
// Live vs test price IDs are selected by STRIPE_MODE. Annual billing has been
// retired — there is a single monthly price per account type.
function getPriceId(accountType: 'county_union' | 'golf_club', isTest: boolean) {
  if (accountType === 'golf_club') {
    return isTest ? process.env.TEST_STRIPE_CLUB_PRICE_ID! : process.env.STRIPE_CLUB_PRICE_ID!
  }
  return isTest ? process.env.TEST_STRIPE_COUNTY_PRICE_ID! : process.env.STRIPE_COUNTY_PRICE_ID!
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
      paymentMethod,
    } = body

    // 'card' (default) → Stripe checkout, as before.
    // 'invoice' → create the same pending account but bill manually; no Stripe.
    const isInvoice = paymentMethod === 'invoice'

    if (!countyUnionName || !governingBody || !secretaryName || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    // Annual billing has been retired — every signup is monthly. The price is
    // determined by account type (see getPriceId), not by plan.
    const plan = 'monthly' as const

    const resolvedAccountType: 'county_union' | 'golf_club' =
      accountType === 'golf_club' ? 'golf_club' : 'county_union'

    const supabase = createServiceClient()

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
      // parent_county_id grants a county union visibility of the club's golfers
      // via affiliated-club search, so it must be set deliberately by an
      // administrator with both parties' agreement, never from a signup form.
      parent_county_id: null,
    })

    if (insertError) {
      console.error('[signup] insert error:', insertError.message)
      await supabase.auth.admin.deleteUser(userId)
      const isDuplicate = insertError.code === '23505' || insertError.message.includes('duplicate key')
      return NextResponse.json(
        { error: isDuplicate ? 'An account with this email already exists. Please sign in instead.' : `Something went wrong creating your account. Please try again or contact support.` },
        { status: isDuplicate ? 409 : 500 }
      )
    }

    // ── Invoice path ────────────────────────────────────────────────────────
    // The account now exists in exactly the same pre-payment state a card signup
    // has (counties row, subscription_status 'pending_payment', no staff_profiles
    // and no Stripe objects). We do NOT create a Stripe session or grant access —
    // the account is activated manually once the invoice is paid. Notify admin so
    // an invoice can be raised in FreeAgent.
    if (isInvoice) {
      const price = MONTHLY_PRICE[resolvedAccountType]
      const typeLabel = ACCOUNT_TYPE_LABEL[resolvedAccountType]
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `New INVOICE signup: ${countyUnionName} (${typeLabel}) — ${price}/month`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
              <h2 style="margin: 0 0 12px;">New invoice signup</h2>
              <p style="color: #4b5563; margin: 0 0 16px;">
                A new account has signed up and requested to be invoiced. Raise an invoice in
                FreeAgent, then activate the account once payment is received.
              </p>
              <ul style="color: #111827; line-height: 1.7;">
                <li><strong>Organisation:</strong> ${countyUnionName}</li>
                <li><strong>Account type:</strong> ${typeLabel}</li>
                <li><strong>Price:</strong> ${price}/month</li>
                <li><strong>Contact email:</strong> ${email}</li>
                <li><strong>Phone:</strong> ${phone}</li>
                <li><strong>Governing body:</strong> ${governingBody}</li>
                ${resolvedAccountType === 'golf_club' && parentCountyName ? `<li><strong>County union:</strong> ${parentCountyName}</li>` : ''}
              </ul>
              <p style="color: #6b7280; font-size: 13px; margin-top: 16px;">
                The account is created with subscription_status = 'pending_payment' and has no
                dashboard access until you activate it.
              </p>
            </div>
          `,
        })
      } catch (emailErr) {
        // The account is already created; surface the failure so it can be retried
        // and the admin still finds out (the row exists either way).
        console.error('[signup] invoice notification email failed:', emailErr instanceof Error ? emailErr.message : String(emailErr))
      }

      return NextResponse.json({ invoiced: true })
    }

    // ── Card path (Stripe checkout) ───────────────────────────────────────────
    const { stripe, isTest } = getStripeClient()
    const priceId = getPriceId(resolvedAccountType, isTest)
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
