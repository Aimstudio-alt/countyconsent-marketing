export default function TripSetupMockup() {
  const juniors = [
    { name: 'Archie Thompson', consent: 'confirmed' },
    { name: 'Ella Marsden', consent: 'confirmed' },
    { name: 'James Okafor', consent: 'not-sent' },
    { name: 'Sophie Briggs', consent: 'confirmed' },
    { name: 'Luca Harrington', consent: 'not-sent' },
  ]
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl blur-2xl opacity-60" />
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-bold text-gray-900">Durham Junior Open 2025</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />14–15 June</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />Rockcliffe Hall</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />Overnight trip</span>
          </div>
        </div>
        {/* Assign section */}
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-700 mb-2">Assigned juniors — consent status</p>
          <div className="space-y-2">
            {juniors.map((j) => (
              <div key={j.name} className="flex items-center justify-between">
                <span className="text-xs text-gray-700">{j.name}</span>
                {j.consent === 'confirmed' ? (
                  <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-semibold">✓ Consented</span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full font-medium">Not sent</span>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* CTA */}
        <div className="px-5 py-3 flex items-center gap-2">
          <button className="flex-1 text-xs bg-green-700 text-white py-2 rounded-lg font-semibold">
            Send consent requests →
          </button>
          <span className="text-xs text-gray-400">2 pending</span>
        </div>
      </div>
    </div>
  )
}
