export default function InviteStaffMockup() {
  const managers = [
    { name: 'David Clarke', role: 'Admin', confirmed: true },
    { name: 'Paul Robson', role: 'Team Manager', confirmed: true },
    { name: 'Sarah Mitchell', role: 'Team Manager', confirmed: false },
  ]
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl blur-2xl opacity-60" />
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-bold text-gray-900">Team Managers</p>
            <p className="text-xs text-gray-400">Durham County Golf Union · 3 members</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs bg-green-700 text-white px-3 py-1.5 rounded-lg font-semibold">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Invite manager
          </button>
        </div>
        {/* Manager rows */}
        <div className="divide-y divide-gray-50">
          {managers.map((m) => (
            <div key={m.name} className="flex items-center gap-3 px-5 py-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 flex-shrink-0">
                {m.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{m.name}</p>
                <p className="text-xs text-gray-400">{m.role}</p>
              </div>
              {m.confirmed ? (
                <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-medium">Active</span>
              ) : (
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-medium">Invite pending</span>
              )}
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400">Invite links sent automatically by email</p>
        </div>
      </div>
    </div>
  )
}
