const risks = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect width="48" height="48" rx="14" fill="#fef2f2" />
        <path d="M24 16v10M24 30h.01" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22.2 10.6l-12 20.8A2 2 0 0012 34h24a2 2 0 001.8-2.6l-12-20.8a2 2 0 00-3.6 0z"
          stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" fill="#fef2f2" />
      </svg>
    ),
    headline: 'Medical emergency on a trip',
    text: 'What if a young golfer has a medical emergency and the consent form — with their allergy information and GP number — is back at the office?',
    tag: 'Real risk',
    tagColor: 'bg-red-50 text-red-600 border-red-100',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect width="48" height="48" rx="14" fill="#fffaeb" />
        <path d="M32 20H28M32 24H26M32 28H28" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
        <rect x="12" y="14" width="22" height="20" rx="3" stroke="#d97706" strokeWidth="2" />
        <path d="M16 22h6M16 26h4" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    headline: 'No audit trail to prove consent',
    text: 'What if a parent disputes they ever gave consent — and you have no digital record, no timestamp, and no signature to prove they did?',
    tag: 'Legal risk',
    tagColor: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect width="48" height="48" rx="14" fill="#eff6ff" />
        <path d="M24 14L14 18v8c0 6.4 4.3 12.4 10 14 5.7-1.6 10-7.6 10-14v-8L24 14z"
          stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" fill="#eff6ff" />
        <path d="M20 24l3 3 6-6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    headline: 'ICO investigation readiness',
    text: 'What if the ICO asks to see your data handling records and you\'re running on paper forms, shared email threads and spreadsheets?',
    tag: 'Compliance risk',
    tagColor: 'bg-blue-50 text-blue-600 border-blue-100',
  },
]

export default function Problem() {
  return (
    <section className="py-24" style={{background:'#f7f5ee'}}>
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-5 border"
            style={{background:'#edf7f2',borderColor:'#a7d9bc',color:'#155230'}}>
            The problem
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{color:'#0a2818'}}>
            The risks golf organisations face{' '}
            <br className="hidden md:block" />
            on every junior golf trip
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{color:'#6b7280'}}>
            Taking juniors away is one of the best parts of golf. But the paperwork behind it carries risks most clubs and unions haven&apos;t fully considered.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {risks.map((r) => (
            <div key={r.headline} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-5">
              {r.icon}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{r.headline}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${r.tagColor}`}>{r.tag}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pull quote / callout */}
        <div className="rounded-2xl p-8 md:p-10 relative overflow-hidden" style={{background:'linear-gradient(135deg,#0a2818,#155230)'}}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{background:'radial-gradient(circle,#c9921c,transparent)',transform:'translate(30%,-30%)'}} />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'rgba(255,255,255,0.1)'}}>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-lg md:text-xl leading-snug mb-1">
                SafeGolf accreditation is now mandatory for all England Golf affiliated counties.
              </p>
              <p className="text-green-200 text-base">
                Digital, auditable consent management is no longer optional — it&apos;s a requirement.
              </p>
            </div>
            <a href="#demo" className="flex-shrink-0 inline-flex items-center px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
              style={{background:'#c9921c',color:'white'}}>
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
