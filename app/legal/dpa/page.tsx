import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import LegalLayout from '@/components/LegalLayout'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Data Processing Agreement — CountyConsent',
  description: 'The data processing agreement between SentinelHQ Ltd and CountyConsent customers.',
}

const content = fs.readFileSync(
  path.join(process.cwd(), 'app/legal/_content/data-processing-agreement.md'),
  'utf8'
)

export default function DpaPage() {
  return (
    <>
      <LegalLayout title="Data Processing Agreement" content={content} />
      <Footer />
    </>
  )
}
