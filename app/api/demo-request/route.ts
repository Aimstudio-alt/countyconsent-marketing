import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, countyUnion, email, phone } = body

    if (!firstName || !lastName || !countyUnion || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[demo-request] Missing Supabase env vars — NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createServiceClient()
    const { error: dbError } = await supabase.from('demo_requests').insert({
      first_name: firstName,
      last_name: lastName,
      county_union: countyUnion,
      email,
      phone: phone || null,
    })

    if (dbError) {
      console.error('[demo-request] Supabase insert error — code:', dbError.code, '| message:', dbError.message, '| details:', dbError.details)
      return NextResponse.json({ error: 'Failed to save request' }, { status: 500 })
    }

    // Send confirmation to the requester — failure here must not affect the success response
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Your CountyConsent demo request',
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
            <div style="background: #166534; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 700;">CountyConsent</h1>
            </div>
            <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
              <h2 style="color: #111827; font-size: 22px; margin: 0 0 12px;">Thanks, ${firstName} — we'll be in touch soon.</h2>
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px;">
                We've received your demo request for <strong>${countyUnion}</strong>. A member of the team will contact you within one working day to arrange a 30-minute walkthrough.
              </p>
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">
                In the meantime, if you have any questions you can reply to this email.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                CountyConsent — GDPR-compliant digital consent for county golf unions
              </p>
            </div>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('[demo-request] Failed to send confirmation email to requester:', emailErr)
    }

    // Send admin notification to hello@pinhighmedia.uk
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New demo request: ${firstName} ${lastName} — ${countyUnion}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color: #111827;">New CountyConsent demo request</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 8px 0; color: #6b7280; width: 130px;">Name</td><td style="padding: 8px 0; color: #111827; font-weight: 600;">${firstName} ${lastName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">County Union</td><td style="padding: 8px 0; color: #111827; font-weight: 600;">${countyUnion}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0; color: #111827;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Phone</td><td style="padding: 8px 0; color: #111827;">${phone || '—'}</td></tr>
            </table>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('[demo-request] Failed to send admin notification:', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[demo-request] Unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
