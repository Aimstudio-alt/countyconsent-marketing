'use client'

const features = [
  'Unlimited staff users',
  'Secure digital consent forms',
  'Medical alerts & emergency contacts',
  'Full audit trail & exports',
  'Consent expiry tracking',
  'GDPR & ICO-ready reporting',
  'Subject Access Request support',
  'Role-based access control',
  'UK data storage',
  'Email & phone support',
]

function PricingCard({ plan }: { plan: 'monthly' | 'annual' }) {
  const isAnnual = plan === 'annual'

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  if (isAnnual) {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{background:'linear-gradient(145deg,#0a2818 0%,#155230 60%,#1a6b3e 100%)'}}>
        {/* Save badge */}
        <div className="absolute top-5 right-5">
          <span className="text-xs font-black px-3 py-1.5 rounded-full" style={{background:'#c9921c',color:'white'}}>
            SAVE £300
          </span>
        </div>
        {/* Decorative circle */}
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10" style={{background:'radial-gradient(circle,white,transparent)',transform:'translate(30%,30%)'}} />

        <div className="relative p-8 md:p-10">
          <div className="text-green-300 text-sm font-bold tracking-widest uppercase mb-4">Annual plan</div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-6xl font-black text-white tracking-tight">£1,500</span>
            <span className="text-green-300 text-lg mb-3">/year</span>
          </div>
          <p className="text-green-200 text-sm mb-8">Billed annually · equivalent to £125/month</p>

          <button onClick={handleCheckout}
            className="w-full py-4 rounded-xl font-black text-base transition-all hover:opacity-90 mb-8"
            style={{background:'#c9921c',color:'white'}}>
            Start free 30-day trial →
          </button>

          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <svg className="w-4 h-4 flex-shrink-0 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-green-100">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 md:p-10 shadow-sm hover:border-gray-300 hover:shadow-md transition-all">
      <div className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-4">Monthly plan</div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-6xl font-black text-gray-900 tracking-tight">£150</span>
        <span className="text-gray-400 text-lg mb-3">/month</span>
      </div>
      <p className="text-gray-500 text-sm mb-8">Billed monthly · cancel anytime</p>

      <button onClick={handleCheckout}
        className="w-full py-4 rounded-xl font-black text-base border-2 transition-all hover:bg-gray-50 mb-8"
        style={{borderColor:'#155230',color:'#155230'}}>
        Start free 30-day trial
      </button>

      <ul className="space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" style={{color:'#155230'}} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-5 border"
            style={{background:'#edf7f2',borderColor:'#a7d9bc',color:'#155230'}}>
            Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{color:'#0a2818'}}>
            One price. Everything included.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{color:'#6b7280'}}>
            No per-user fees, no hidden costs, no surprises — just simple, transparent pricing for your entire union.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          <PricingCard plan="monthly" />
          <PricingCard plan="annual" />
        </div>

        <p className="text-center text-sm" style={{color:'#9ca3af'}}>
          30-day free trial on both plans. No credit card required to start.
        </p>
      </div>
    </section>
  )
}
