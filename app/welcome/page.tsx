import Link from 'next/link'

export default function WelcomePage() {
  const appLoginUrl = process.env.NEXT_PUBLIC_APP_LOGIN_URL || 'https://app.countyconsent.co.uk'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{background:'#f7f5ee'}}>
      <div className="w-full max-w-lg text-center">

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg"
          style={{background:'linear-gradient(135deg,#155230,#1a6b3e)'}}>
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{color:'#0a2818'}}>
          You&apos;re all set.
        </h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Welcome to CountyConsent. Your 30-day free trial has started — no charge until your trial ends.
        </p>

        {/* What happens next */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-left mb-8">
          <h2 className="font-bold text-gray-900 text-base mb-5">What happens next</h2>
          <ul className="space-y-4">
            {[
              {
                step: '1',
                title: 'Check your inbox',
                desc: 'We\'ve sent a welcome email with your account details and a link to your dashboard.',
              },
              {
                step: '2',
                title: 'Add your junior members',
                desc: 'Import your junior roster — their medical information and emergency contacts are stored securely.',
              },
              {
                step: '3',
                title: 'Set up your first trip',
                desc: 'Create a trip, assign juniors, and send digital consent requests to parents in minutes.',
              },
            ].map(({ step, title, desc }) => (
              <li key={step} className="flex gap-4">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white mt-0.5"
                  style={{background:'#155230'}}>
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <a href={appLoginUrl}
          className="inline-flex items-center px-8 py-4 rounded-xl font-black text-base text-white transition-all hover:opacity-90 shadow-lg mb-4"
          style={{background:'linear-gradient(135deg,#155230,#1a6b3e)'}}>
          Go to your dashboard
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>

        <p className="text-sm text-gray-400">
          Questions? Email us at{' '}
          <a href="mailto:hello@countyconsent.co.uk" className="underline" style={{color:'#155230'}}>
            hello@countyconsent.co.uk
          </a>
        </p>
      </div>
    </div>
  )
}
