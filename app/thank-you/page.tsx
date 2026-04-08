import Link from 'next/link'

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thanks — we&apos;ll be in touch soon
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          We&apos;ve received your demo request and sent a confirmation to your email. A member of the team will be in touch within one working day to arrange a time that suits you.
        </p>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">What happens next</h2>
          <ul className="space-y-2.5">
            {[
              'We\'ll email you to confirm your demo',
              'We\'ll arrange a 30-minute call at a time that suits you',
              'You\'ll see the platform live, tailored to county golf workflows',
              'No obligation — just a genuinely helpful conversation',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition-colors"
        >
          Back to CountyConsent
        </Link>
      </div>
    </div>
  )
}
