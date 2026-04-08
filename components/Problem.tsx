const risks = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    text: 'What if a young golfer has a medical emergency and the consent form is back at the office?',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    text: 'What if a parent disputes they ever gave consent — and you have no audit trail to prove they did?',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    text: 'What if the ICO asks to see your data handling records and you\'re running on paper and spreadsheets?',
  },
]

export default function Problem() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The risks county unions face every time they take juniors away
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Taking juniors on trips is one of the most rewarding parts of county golf. But the paperwork behind it carries real risk.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {risks.map((risk, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                {risk.icon}
              </div>
              <p className="text-gray-800 font-medium leading-relaxed text-base">
                &ldquo;{risk.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div className="bg-green-700 rounded-2xl p-6 md:p-8 text-center">
          <div className="flex items-start md:items-center gap-3 max-w-3xl mx-auto">
            <svg className="w-6 h-6 text-green-200 flex-shrink-0 mt-0.5 md:mt-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-white text-base md:text-lg font-medium text-left">
              SafeGolf accreditation is now mandatory for all England Golf affiliated counties. Digital, auditable consent management is no longer optional.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
