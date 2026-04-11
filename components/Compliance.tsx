import AnimatedShield from './graphics/AnimatedShield'
import AuditMockup from './AuditMockup'

const points = [
  { text: 'Built around England Golf and SafeGolf safeguarding requirements' },
  { text: 'UK GDPR compliant for special category data' },
  { text: 'Full audit exports for ICO requests' },
  { text: 'Subject Access Request support built in' },
  { text: 'Respond to any data request within the 30-day legal requirement' },
]

export default function Compliance() {
  return (
    <section className="py-24 relative overflow-hidden" style={{background:'#f7f5ee'}}>
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-30"
        style={{background:'radial-gradient(circle,#a7d9bc,transparent)',transform:'translate(40%,-40%)'}} />

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Pull quote at top */}
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-5 border"
            style={{background:'#edf7f2',borderColor:'#a7d9bc',color:'#155230'}}>
            Built for compliance
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6" style={{color:'#0a2818'}}>
            Compliance doesn&apos;t have to<br className="hidden md:block" /> be complicated
          </h2>

          {/* Callout block */}
          <div className="max-w-2xl mx-auto rounded-2xl p-6 border-l-4 text-left" style={{background:'white',borderLeftColor:'#c9921c'}}>
            <p className="text-xl font-bold italic leading-snug mb-1" style={{color:'#0a2818'}}>
              &ldquo;We built CountyConsent because golf organisations were doing their best with paper — and their best wasn&apos;t enough to protect them.&rdquo;
            </p>
            <p className="text-sm font-medium" style={{color:'#6b7280'}}>
              Built in partnership with Durham County Golf Union
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left */}
          <div className="flex flex-col gap-8">
            <AnimatedShield />
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <ul className="space-y-3.5">
                {points.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{background:'#edf7f2'}}>
                      <svg className="w-3 h-3" fill="none" stroke="#155230" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6">
            <AuditMockup />
            <div className="rounded-2xl p-7 text-center" style={{background:'linear-gradient(135deg,#0a2818,#155230)'}}>
              <div className="text-5xl font-black text-white mb-2" style={{textShadow:'0 0 30px rgba(34,132,80,0.5)'}}>30</div>
              <div className="text-green-200 font-bold text-lg mb-1">days legal deadline</div>
              <div className="text-green-300 text-sm">to respond to any Subject Access Request</div>
              <div className="mt-5 pt-5 border-t border-white/10">
                <p className="text-white/70 text-sm">CountyConsent generates a ready-to-send response in seconds.</p>
              </div>
            </div>
            <a href="#demo" className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
              style={{background:'linear-gradient(135deg,#155230,#1a6b3e)'}}>
              Talk to us about your organisation
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
