import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  verification: {
    google: 'elOGT0nfkQPMg0fqY127indq6a6ZBmKYcnG_cemDgdM',
  },
  title: 'CountyConsent — Junior Safeguarding for Golf',
  description:
    'CountyConsent is the only GDPR-compliant digital consent system built specifically for county golf unions — so your staff have the right information, at the right time, every time.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://countyconsent.co.uk'),
  openGraph: {
    title: 'CountyConsent — Junior Golf Consent & Safeguarding',
    description:
      'GDPR-compliant parental consent and safeguarding for junior golf. Built for clubs, county unions, and tour organisers across the UK and Ireland.',
    type: 'website',
    url: 'https://countyconsent.co.uk',
    siteName: 'CountyConsent',
    locale: 'en_GB',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CountyConsent — Junior Golf Consent & Safeguarding',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CountyConsent — Junior Golf Consent & Safeguarding',
    description:
      'GDPR-compliant parental consent and safeguarding for junior golf. Built for clubs, county unions, and tour organisers across the UK and Ireland.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
