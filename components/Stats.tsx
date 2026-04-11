const stats = [
  {
    value: '39',
    label: 'County unions in England',
    sub: 'plus 1,900+ affiliated golf clubs',
    color: '#155230',
  },
  {
    value: '£17.5m',
    label: 'Maximum GDPR fine',
    sub: 'for data protection failures',
    color: '#92620a',
  },
  {
    value: '30',
    label: 'Days to respond',
    sub: 'to any subject access request',
    color: '#155230',
  },
  {
    value: '100%',
    label: 'SafeGolf required',
    sub: 'for all affiliated counties',
    color: '#92620a',
  },
]

export default function Stats() {
  return (
    <section className="py-0 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-2xl shadow-xl overflow-hidden" style={{background:'linear-gradient(135deg,#0a2818 0%,#155230 50%,#0f3d24 100%)'}}>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`px-8 py-8 ${i < stats.length - 1 ? 'border-r border-white/10' : ''} ${i >= 2 ? 'border-t border-white/10 md:border-t-0' : ''}`}>
                <div className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight"
                  style={{textShadow:'0 0 40px rgba(34,132,80,0.4)'}}>
                  {s.value}
                </div>
                <div className="text-sm font-bold text-white/90 mb-0.5">{s.label}</div>
                <div className="text-xs text-white/50">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
