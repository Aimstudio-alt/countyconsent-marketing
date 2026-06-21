import Link from 'next/link'

const clubFeatures = [
  'Secure digital consent forms',
  'Medical alerts & emergency contacts',
  'Consent expiry tracking',
  'Full audit trail & exports',
  'Golf Genius sync',
  'GDPR & ICO-ready reporting',
  'Role-based access control',
  'Unlimited staff users',
  'UK data storage',
  'Email & phone support',
]

const countyExtra = [
  'Search players across all your affiliated clubs',
  "Add any member club's players to county trips",
  'County-wide oversight across all feeder clubs',
]

function Check({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 ${className}`} style={style} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-5 border"
            style={{ background: '#edf7f2', borderColor: '#a7d9bc', color: '#155230' }}>
            Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{ color: '#0a2818' }}>
            Simple pricing for clubs and counties
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#6b7280' }}>
            No setup fees. No per-user charges. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8 items-start">
          {/* Golf Club */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 md:p-10 shadow-sm hover:border-gray-300 hover:shadow-md transition-all">
            <div className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-4">Golf Club</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-6xl font-black text-gray-900 tracking-tight">£99</span>
              <span className="text-gray-400 text-lg mb-3">/month</span>
            </div>
            <p className="text-gray-500 text-sm mb-8">For a single club managing its own junior members.</p>

            <Link href="/signup"
              className="block w-full py-4 rounded-xl font-black text-base text-center border-2 transition-all hover:bg-gray-50 mb-8"
              style={{ borderColor: '#155230', color: '#155230' }}>
              Get started →
            </Link>

            <ul className="space-y-3">
              {clubFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check style={{ color: '#155230' }} />
                  <span className="text-gray-600">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* County Union — featured */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(145deg,#0a2818 0%,#155230 60%,#1a6b3e 100%)' }}>
            <div className="absolute top-5 right-5">
              <span className="text-xs font-black px-3 py-1.5 rounded-full" style={{ background: '#c9921c', color: 'white' }}>
                MOST POPULAR
              </span>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,white,transparent)', transform: 'translate(30%,30%)' }} />

            <div className="relative p-8 md:p-10">
              <div className="text-green-300 text-sm font-bold tracking-widest uppercase mb-4">County Union</div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-6xl font-black text-white tracking-tight">£199</span>
                <span className="text-green-300 text-lg mb-3">/month</span>
              </div>
              <p className="text-green-200 text-sm mb-8">For county unions managing multiple member clubs and county events.</p>

              <Link href="/signup"
                className="block w-full py-4 rounded-xl font-black text-base text-center transition-all hover:opacity-90 mb-8"
                style={{ background: '#c9921c', color: 'white' }}>
                Get started →
              </Link>

              <p className="text-green-300 text-xs font-bold tracking-widest uppercase mb-3">Everything in Golf Club, plus</p>
              <ul className="space-y-3">
                {countyExtra.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check className="text-green-400" />
                    <span className="text-green-100">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="text-center text-sm" style={{ color: '#9ca3af' }}>
          Questions? <a href="/#demo" className="underline hover:text-gray-600 transition-colors">Request a demo</a> and we&apos;ll walk you through the platform before you commit.
        </p>
      </div>
    </section>
  )
}
