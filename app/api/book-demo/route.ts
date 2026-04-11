import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { resend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, organisation, email, phone, date, time } = body

    if (!firstName || !lastName || !organisation || !email || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save to DB — non-fatal
    try {
      const supabase = createServiceClient()
      await supabase.from('demo_bookings').insert({
        first_name: firstName,
        last_name: lastName,
        organisation,
        email,
        phone: phone || null,
        booked_date: date,
        booked_time: time,
      })
    } catch (dbErr) {
      console.error('[book-demo] DB insert failed (non-fatal):', dbErr)
    }

    // Confirmation email to requester
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: `Your CountyConsent demo — ${date} at ${time}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
            <div style="background: #166534; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 700;">CountyConsent</h1>
            </div>
            <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
              <h2 style="color: #111827; font-size: 22px; margin: 0 0 12px;">Your demo is booked, ${firstName}.</h2>
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px;">
                We've confirmed your booking for <strong>${organisation}</strong>. Here are the details:
              </p>
              <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin: 0 0 20px;">
                <p style="margin: 0 0 8px; color: #374151;"><strong>Date:</strong> ${date}</p>
                <p style="margin: 0; color: #374151;"><strong>Time:</strong> ${time}</p>
              </div>
              <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">
                We'll send you a video call link before the session. If you need to reschedule, just reply to this email.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                CountyConsent — GDPR-compliant digital consent for junior golf
              </p>
            </div>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('[book-demo] Failed to send confirmation email:', emailErr)
    }

    // Admin notification
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `Demo booked: ${firstName} ${lastName} — ${date} at ${time}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color: #111827;">New demo booking</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 8px 0; color: #6b7280; width: 130px;">Name</td><td style="padding: 8px 0; color: #111827; font-weight: 600;">${firstName} ${lastName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Organisation</td><td style="padding: 8px 0; color: #111827; font-weight: 600;">${organisation}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0; color: #111827;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Phone</td><td style="padding: 8px 0; color: #111827;">${phone || '—'}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Date</td><td style="padding: 8px 0; color: #111827; font-weight: 600;">${date}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Time</td><td style="padding: 8px 0; color: #111827; font-weight: 600;">${time}</td></tr>
            </table>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('[book-demo] Failed to send admin notification:', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[book-demo] Unhandled error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
