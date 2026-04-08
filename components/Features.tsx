const features = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect width="40" height="40" rx="11" fill="#edf7f2" />
        <path d="M20 10L28 13.5V19C28 23.8 24.4 28.2 20 29.5C15.6 28.2 12 23.8 12 19V13.5L20 10Z"
          fill="#155230" opacity="0.15" stroke="#155230" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M16 19.5L18.5 22L24 17" stroke="#155230" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Secure digital consent forms',
    description: 'Every parent gets a unique, tamper-proof link. No account needed — complete on any device in under 3 minutes.',
    accent: '#edf7f2',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect width="40" height="40" rx="11" fill="#fef2f2" />
        <path d="M20 12C20 12 14 14 14 20C14 23.3 15.8 26.2 18.5 27.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="19" r="4" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
        <path d="M19 19h2M20 18v2" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M25 24l3 3" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        <circle cx="27" cy="27" r="3" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
        <text x="27" y="30" textAnchor="middle" fill="#ef4444" fontSize="6" fontWeight="900">!</text>
      </svg>
    ),
    title: 'Medical alerts',
    description: 'Critical health information is instantly visible to staff — allergies, conditions, medication — exactly when needed.',
    accent: '#fef2f2',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect width="40" height="40" rx="11" fill="#eff6ff" />
        <rect x="12" y="12" width="16" height="18" rx="3" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" strokeWidth="1.5" />
        <path d="M16 18h8M16 21h6M16 24h4" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="27" cy="14" r="5" fill="#3b82f6" />
        <path d="M25 14l1.5 1.5L29 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Full audit trail',
    description: 'Every action logged, timestamped and exportable. Know exactly who consented, when, and from which device.',
    accent: '#eff6ff',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect width="40" height="40" rx="11" fill="#f0fdf4" />
        <path d="M20 11L28.5 14.5V20C28.5 25 24.7 29.5 20 31C15.3 29.5 11.5 25 11.5 20V14.5L20 11Z"
          fill="#16a34a" opacity="0.15" stroke="#16a34a" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M16.5 20.5L19 23L23.5 17.5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'GDPR compliant',
    description: 'UK data storage, ICO-ready reporting, and full special category data handling — built to the standard from day one.',
    accent: '#f0fdf4',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect width="40" height="40" rx="11" fill="#fffaeb" />
        <circle cx="20" cy="20" r="8" stroke="#d97706" strokeWidth="1.5" />
        <path d="M20 14v6l4 2" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="28" cy="13" r="4" fill="#d97706" />
        <path d="M26.5 13h3M28 11.5v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Consent expiry tracking',
    description: 'Automatic alerts when consent is approaching renewal. Never take a junior away on outdated consent again.',
    accent: '#fffaeb',
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <rect width="40" height="40" rx="11" fill="#f5f3ff" />
        <circle cx="17" cy="17" r="4" stroke="#7c3aed" strokeWidth="1.5" />
        <circle cx="24" cy="23" r="4" stroke="#7c3aed" strokeWidth="1.5" fill="#f5f3ff" />
        <path d="M21 17h5M21 20h3" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13 26c0-2.2 1.8-4 4-4" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Role-based access',
    description: 'Staff see only what they need. Medical data is protected — accessible only to those who need it on the day.',
    accent: '#f5f3ff',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-5 border"
            style={{background:'#edf7f2',borderColor:'#a7d9bc',color:'#155230'}}>
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{color:'#0a2818'}}>
            Everything your union needs,<br className="hidden md:block" />nothing it doesn&apos;t
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{color:'#6b7280'}}>
            Purpose-built for county golf. No generic safeguarding software shoehorned to fit — designed for exactly this use case.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-0.5">
              <div className="mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2 text-base">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
