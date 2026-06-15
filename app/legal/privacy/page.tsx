import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — CountyConsent',
  description: 'How SentinelHQ Ltd collects, uses and protects personal data on CountyConsent.',
}

const content = fs.readFileSync(
  path.join(process.cwd(), 'app/legal/_content/privacy-policy.md'),
  'utf8'
)

export default function PrivacyPage() {
  return (
    <>
      <LegalLayout title="Privacy Policy" content={content} />
      <Footer />
    </>
  )
}
