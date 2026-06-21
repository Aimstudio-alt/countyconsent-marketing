import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// Must be a Resend-verified sending domain. countyconsent.uk is verified;
// countyconsent.co.uk (the marketing site domain) is NOT verified for email.
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@countyconsent.uk'
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@pinhighmedia.uk'
