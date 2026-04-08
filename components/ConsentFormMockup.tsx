export default function ConsentFormMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-3 bg-gradient-to-br from-green-100 to-emerald-50 rounded-3xl blur-xl opacity-60" />

      {/* Phone frame */}
      <div className="relative mx-auto w-64 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Phone notch bar */}
        <div className="bg-gray-900 h-6 flex items-center justify-center">
          <div className="w-16 h-1.5 rounded-full bg-gray-700" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="w-6 h-6 rounded-md bg-green-700 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 leading-none">Consent Form</p>
              <p className="text-xs text-gray-400">Durham Junior Open 2025</p>
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Please complete consent for <strong className="text-gray-900">Archie Thompson</strong>.
          </p>

          {/* Form fields */}
          {['Emergency contact', 'GP name & phone'].map((label) => (
            <div key={label}>
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <div className="h-6 bg-gray-100 rounded-md" />
            </div>
          ))}

          {/* Medical toggle */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-2.5">
            <p className="text-xs font-semibold text-amber-800 mb-1">Medical information</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-700">Asthma — inhaler required</span>
              <div className="w-8 h-4 bg-amber-400 rounded-full flex items-center justify-end pr-0.5">
                <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>

          {/* Signature line */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Parent signature</p>
            <div className="h-8 bg-gray-50 border border-dashed border-gray-200 rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-300 italic">Sign here</span>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full py-2 bg-green-700 text-white text-xs font-bold rounded-xl">
            Submit consent ✓
          </button>

          <p className="text-center text-xs text-gray-400">Secured by CountyConsent</p>
        </div>
      </div>
    </div>
  )
}
