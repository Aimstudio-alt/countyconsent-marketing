import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const supabaseUserId = session.metadata?.supabase_user_id
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
      const plan = session.metadata?.plan || 'monthly'

      if (supabaseUserId && customerId) {
        await supabase
          .from('counties')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId || null,
            subscription_status: session.payment_status === 'paid' ? 'active' : 'trialing',
          })
          .eq('supabase_user_id', supabaseUserId)
      }

      // Also update Stripe customer name from metadata
      if (customerId && session.metadata?.secretary_name) {
        await stripe.customers.update(customerId, {
          name: session.metadata.secretary_name,
          metadata: {
            county_union_name: session.metadata.county_union_name || '',
            governing_body: session.metadata.governing_body || '',
          },
        })
      }
      break
    }

    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer

      const email = customer.email
      const name = customer.name || subscription.metadata?.secretary_name || ''
      const plan = subscription.items.data[0]?.price?.recurring?.interval === 'year' ? 'annual' : 'monthly'
      const supabaseUserId = subscription.metadata?.supabase_user_id

      // Update counties table subscription status
      if (supabaseUserId) {
        await supabase
          .from('counties')
          .update({
            stripe_customer_id: customer.id,
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
          })
          .eq('supabase_user_id', supabaseUserId)
      }

      // Also maintain legacy subscribers table for backwards compat
      await supabase.from('subscribers').upsert({
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        email,
        name,
        plan,
        status: subscription.status,
      }, { onConflict: 'stripe_subscription_id' })

      if (email) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: 'Welcome to CountyConsent',
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
              <div style="background: #166534; padding: 24px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 700;">CountyConsent</h1>
              </div>
              <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
                <h2 style="color: #111827; font-size: 22px; margin: 0 0 12px;">Welcome to CountyConsent${name ? `, ${name}` : ''}.</h2>
                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 16px;">
                  Your <strong>${plan === 'annual' ? 'annual' : 'monthly'}</strong> subscription is now active.
                  ${subscription.trial_end ? `Your 30-day free trial runs until <strong>${new Date(subscription.trial_end * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.` : ''}
                </p>
                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">
                  You can log in to your dashboard at any time. Reply to this email if you have any questions.
                </p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                  CountyConsent — GDPR-compliant digital consent for county golf unions
                </p>
              </div>
            </div>
          `,
        })

        await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `New subscriber: ${name || email} (${plan})`,
          html: `<p>New CountyConsent subscriber.</p>
          <ul>
            <li><strong>Name:</strong> ${name || '—'}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Plan:</strong> ${plan}</li>
            <li><strong>Status:</strong> ${subscription.status}</li>
            <li><strong>Stripe Customer:</strong> ${customer.id}</li>
          </ul>`,
        })
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from('counties')
        .update({ subscription_status: subscription.status })
        .eq('stripe_subscription_id', subscription.id)
      await supabase
        .from('subscribers')
        .update({ status: subscription.status })
        .eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from('counties')
        .update({ subscription_status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id)
      await supabase
        .from('subscribers')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id)

      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
      if (customer.email) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: customer.email,
          subject: 'Your CountyConsent subscription has been cancelled',
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
              <h2 style="color: #111827;">Your subscription has been cancelled</h2>
              <p style="color: #4b5563; line-height: 1.6;">
                Your CountyConsent subscription has been cancelled. You'll retain access until the end of your current billing period.
              </p>
              <p style="color: #4b5563; line-height: 1.6;">
                If you cancelled by mistake or would like to resubscribe, reply to this email and we'll sort it for you.
              </p>
            </div>
          `,
        })
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
      if (customerId) {
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
        if (customer.email) {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: customer.email,
            subject: 'Action required: CountyConsent payment failed',
            html: `
              <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
                <h2 style="color: #111827;">Payment failed</h2>
                <p style="color: #4b5563; line-height: 1.6;">
                  We weren't able to process your latest CountyConsent payment. Please update your payment details to keep your account active.
                </p>
                <p style="color: #4b5563; line-height: 1.6;">
                  Reply to this email if you need any help.
                </p>
              </div>
            `,
          })
        }
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
