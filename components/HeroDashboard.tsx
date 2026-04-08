export default function HeroDashboard() {
  const juniors = [
    { name: 'Archie Thompson', consent: 'confirmed', medical: true },
    { name: 'Ella Marsden', consent: 'confirmed', medical: false },
    { name: 'James Okafor', consent: 'pending', medical: false },
    { name: 'Sophie Briggs', consent: 'confirmed', medical: true },
    { name: 'Luca Harrington', consent: 'pending', medical: false },
  ]

  return (
    <div className="relative">
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 rounded-3xl blur-2xl opacity-70" />

      {/* Browser chrome wrapper */}
      <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white">

        {/* Browser top bar */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1.5 flex items-center gap-2 border border-gray-200">
            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-gray-400 font-mono">app.countyconsent.co.uk/trips/durham-junior-open</span>
          </div>
        </div>

        {/* App chrome — sidebar + content */}
        <div className="flex bg-white" style={{ height: '360px' }}>

          {/* Sidebar */}
          <div className="w-14 bg-green-800 flex flex-col items-center py-4 gap-4 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            {[
              <path key="users" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
              <path key="doc" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
              <path key="shield" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
            ].map((d, i) => (
              <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center ${i === 1 ? 'bg-white/20' : ''}`}>
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">{d}</svg>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden flex flex-col">

            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Durham Junior Open 2025</h2>
                <p className="text-xs text-gray-400">14–15 June · Rockcliffe Hall · 12 juniors</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-full font-medium">
                  8 consented
                </span>
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-full font-medium">
                  4 pending
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 px-5 py-3 border-b border-gray-50">
              {[
                { label: 'Consent rate', value: '67%', color: 'text-green-700', bg: 'bg-green-50' },
                { label: 'Medical alerts', value: '3', color: 'text-amber-700', bg: 'bg-amber-50' },
                { label: 'Days to trip', value: '12', color: 'text-blue-700', bg: 'bg-blue-50' },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-xl px-3 py-2`}>
                  <div className={`text-lg font-extrabold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Junior list */}
            <div className="flex-1 overflow-hidden px-5 py-2">
              <div className="space-y-1.5">
                {juniors.map((j) => (
                  <div key={j.name} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                        {j.name.charAt(0)}
                      </div>
                      <span className="text-xs font-medium text-gray-800">{j.name}</span>
                      {j.medical && (
                        <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded font-medium leading-none">
                          ⚕ Medical
                        </span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      j.consent === 'confirmed'
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {j.consent === 'confirmed' ? '✓ Consented' : '· Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Last updated: 2 minutes ago</span>
              <button className="text-xs bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium">
                Chase pending →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
