import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Cookie Policy — CountyConsent',
  description: 'How CountyConsent uses cookies and similar technologies.',
}

const content = fs.readFileSync(
  path.join(process.cwd(), 'app/legal/_content/cookie-policy.md'),
  'utf8'
)

export default function CookiesPage() {
  return (
    <>
      <LegalLayout title="Cookie Policy" content={content} />
      <Footer />
    </>
  )
}
