const points = [
  {
    text: 'Built around England Golf and SafeGolf safeguarding requirements',
  },
  {
    text: 'UK GDPR compliant for special category data',
  },
  {
    text: 'Full audit exports for ICO requests',
  },
  {
    text: 'Subject Access Request support built in',
  },
  {
    text: 'Respond to any data request within the 30-day legal requirement',
  },
]

export default function Compliance() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 px-3 py-1.5 rounded-full mb-6">
              Built for compliance
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
              Compliance doesn&apos;t have to be complicated
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              We&apos;ve done the hard work so you don&apos;t have to. CountyConsent is built from the ground up around the requirements that matter to county golf — so you can focus on the golf, not the paperwork.
            </p>

            <a
              href="#demo"
              className="inline-flex items-center px-5 py-3 rounded-xl bg-green-700 text-white font-semibold text-sm hover:bg-green-800 transition-colors"
            >
              Talk to us about your union
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <ul className="space-y-4">
              {points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 font-medium">{point.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 italic">
                &ldquo;Built in partnership with Durham County Golf Union.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
