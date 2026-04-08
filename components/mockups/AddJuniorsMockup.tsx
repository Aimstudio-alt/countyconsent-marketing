export default function AddJuniorsMockup() {
  const members = [
    { name: 'Archie Thompson', dob: '12 Mar 2010', status: 'active' },
    { name: 'Ella Marsden', dob: '4 Jul 2011', status: 'active' },
    { name: 'James Okafor', dob: '19 Nov 2010', status: 'active' },
    { name: 'Sophie Briggs', dob: '8 Jan 2012', status: 'active' },
  ]
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl blur-2xl opacity-60" />
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-bold text-gray-900">Junior Members</p>
            <p className="text-xs text-gray-400">Durham County Golf Union · 4 members</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs bg-green-700 text-white px-3 py-1.5 rounded-lg font-semibold">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add junior
          </button>
        </div>
        {/* Search */}
        <div className="px-5 py-3 border-b border-gray-50">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs text-gray-400">Search members…</span>
          </div>
        </div>
        {/* Member rows */}
        <div className="divide-y divide-gray-50">
          {members.map((m) => (
            <div key={m.name} className="flex items-center gap-3 px-5 py-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 flex-shrink-0">
                {m.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{m.name}</p>
                <p className="text-xs text-gray-400">DOB: {m.dob}</p>
              </div>
              <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-medium">Active</span>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">Import from spreadsheet or add one at a time</p>
        </div>
      </div>
    </div>
  )
}
