export default function EmailMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl blur-2xl opacity-70" />
      {/* Outer phone frame */}
      <div className="relative mx-auto w-72 bg-gray-900 rounded-3xl shadow-2xl p-2">
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Status bar */}
          <div className="bg-white px-4 pt-3 pb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-900">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
              <svg className="w-3.5 h-3.5 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.5C5.5 4.5 18.5 4.5 22.5 8.5L20.5 10.5C17.5 7.5 6.5 7.5 3.5 10.5L1.5 8.5ZM5.5 12.5C7.5 10.5 16.5 10.5 18.5 12.5L16.5 14.5C15.5 13.5 8.5 13.5 7.5 14.5L5.5 12.5ZM9.5 16.5C10.5 15.5 13.5 15.5 14.5 16.5L12 19L9.5 16.5Z" /></svg>
            </div>
          </div>

          {/* Mail app top bar */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-xs font-semibold text-gray-700">Mail</span>
          </div>

          {/* Email card */}
          <div className="p-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Email header */}
              <div className="px-3 py-2.5 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-5 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">C</div>
                  <span className="text-xs font-semibold text-gray-900 truncate">CountyConsent</span>
                  <span className="text-xs text-gray-400 ml-auto flex-shrink-0">now</span>
                </div>
                <p className="text-xs font-semibold text-gray-800 ml-7">Action needed: Consent for Archie</p>
              </div>
              {/* Email body */}
              <div className="px-3 py-3 space-y-2.5">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Hi Sarah, Durham CGU need your consent for <strong>Archie Thompson</strong> to attend the <strong>Junior Open 2025</strong> (14–15 Jun).
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Takes about 3 minutes — no account needed.
                </p>
                <button className="w-full py-2 bg-green-700 text-white text-xs font-bold rounded-lg">
                  Complete consent form →
                </button>
                <p className="text-center text-xs text-gray-400">
                  Secure link · expires in 7 days
                </p>
              </div>
            </div>
          </div>
          <div className="pb-3" />
        </div>
      </div>
    </div>
  )
}
