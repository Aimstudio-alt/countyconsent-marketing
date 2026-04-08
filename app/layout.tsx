import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'CountyConsent — Digital Parental Consent for County Golf Unions',
  description:
    'CountyConsent is the only GDPR-compliant digital consent system built specifically for county golf unions — so your staff have the right information, at the right time, every time.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://countyconsent.co.uk'),
  openGraph: {
    title: 'CountyConsent — Digital Parental Consent for County Golf Unions',
    description:
      'Replace paper consent forms with a secure, auditable digital system built for SafeGolf compliance.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
