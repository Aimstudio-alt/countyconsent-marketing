export default function StaffViewMockup() {
  const alerts = [
    { name: 'Archie Thompson', alert: 'Asthma — blue inhaler in bag', severity: 'amber' },
    { name: 'Sophie Briggs', alert: 'Nut allergy — EpiPen required', severity: 'red' },
  ]
  const consented = [
    { name: 'Archie Thompson', contact: 'Sarah · 07700 900123' },
    { name: 'Ella Marsden', contact: 'Mark · 07700 900456' },
    { name: 'Sophie Briggs', contact: 'Claire · 07700 900789' },
  ]
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl blur-2xl opacity-60" />
      {/* Tablet frame */}
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl p-2">
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Top bar */}
          <div className="bg-green-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-white text-xs font-bold">Staff View — Durham Junior Open</span>
            </div>
            <span className="text-green-200 text-xs">● Live</span>
          </div>

          <div className="p-4 space-y-4">
            {/* Medical alerts */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-bold text-gray-800">Medical alerts</p>
              </div>
              <div className="space-y-2">
                {alerts.map((a) => (
                  <div key={a.name} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${a.severity === 'red' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${a.severity === 'red' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{a.name}</p>
                      <p className={`text-xs ${a.severity === 'red' ? 'text-red-700' : 'text-amber-700'}`}>{a.alert}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consented juniors */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-bold text-gray-800">Consented juniors & emergency contacts</p>
              </div>
              <div className="space-y-1.5">
                {consented.map((c) => (
                  <div key={c.name} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-xs font-medium text-gray-800">{c.name}</span>
                    <span className="text-xs text-gray-500">{c.contact}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 pt-1">Available offline · last synced 30 seconds ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}
