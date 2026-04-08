export default function AuditMockup() {
  const events = [
    { time: '09:14', action: 'Consent submitted', user: 'Parent · Sarah Thompson', color: 'bg-green-500' },
    { time: '09:15', action: 'Medical alert flagged', user: 'System · auto-detected', color: 'bg-amber-500' },
    { time: '10:02', action: 'Form viewed by staff', user: 'Coach · D. Hargreaves', color: 'bg-blue-400' },
    { time: '11:30', action: 'Reminder sent', user: 'System · 4 pending', color: 'bg-purple-400' },
    { time: '14:22', action: 'Consent submitted', user: 'Parent · James Okafor', color: 'bg-green-500' },
  ]

  return (
    <div className="relative">
      <div className="absolute -inset-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl blur-xl opacity-70" />

      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden w-full max-w-sm">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Audit trail</h3>
            <p className="text-xs text-gray-400">Durham Junior Open · Today</p>
          </div>
          <button className="text-xs text-green-700 font-medium bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
            Export CSV
          </button>
        </div>

        {/* Timeline */}
        <div className="p-4 space-y-3">
          {events.map((e, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5 ${e.color}`} />
                {i < events.length - 1 && <div className="w-px h-4 bg-gray-200" />}
              </div>
              <div className="flex-1 -mt-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold text-gray-900">{e.action}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0 font-mono">{e.time}</span>
                </div>
                <p className="text-xs text-gray-500">{e.user}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-gray-500">47 events logged · ICO-ready export available</span>
        </div>
      </div>
    </div>
  )
}
