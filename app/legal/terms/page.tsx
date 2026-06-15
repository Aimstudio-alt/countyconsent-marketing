import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service — CountyConsent',
  description: 'The terms governing use of the CountyConsent service.',
}

const content = fs.readFileSync(
  path.join(process.cwd(), 'app/legal/_content/terms-of-service.md'),
  'utf8'
)

export default function TermsPage() {
  return (
    <>
      <LegalLayout title="Terms of Service" content={content} />
      <Footer />
    </>
  )
}
