export default function DemoSection() {
  return (
    <section className="py-24" style={{ background: "#f7f5ee" }}>
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 border"
            style={{ background: "#edf7f2", borderColor: "#a7d9bc", color: "#155230" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Interactive demo
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5" style={{ color: "#0a2818" }}>
            See it in action —{" "}
            <span style={{ background: "linear-gradient(135deg,#155230,#228450,#c9921c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              try it yourself
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Walk through the full consent workflow in our interactive demo. No sign-up needed — fictional data, real experience.
          </p>
        </div>

        {/* Demo preview card */}
        <div className="relative max-w-4xl mx-auto">

          {/* Browser chrome */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200" style={{ background: "#f1f5f9" }}>

            {/* Browser toolbar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-3">
                <div className="bg-slate-100 rounded-lg px-3 py-1.5 text-xs text-slate-500 font-mono">
                  countyconsent.co.uk/demo
                </div>
              </div>
            </div>

            {/* Demo banner inside */}
            <div className="text-center py-1.5 text-xs font-semibold" style={{ background: "#155230", color: "#bbf7d0" }}>
              This is a demo — no real data is stored
            </div>

            {/* App nav preview */}
            <div className="h-14 flex items-center justify-between px-6" style={{ background: "#052e16" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#155230" }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-bold text-white text-sm">CountyConsent</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300 text-xs hidden sm:block">Northumberland County Golf Union</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#155230" }}>SM</div>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="p-6" style={{ background: "#f8fafc" }}>
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Upcoming Trips", value: "1", color: "text-green-700" },
                  { label: "Total Golfers", value: "6", color: "text-blue-700" },
                  { label: "Consents Received", value: "4", color: "text-emerald-700" },
                  { label: "Medical Alerts", value: "1", color: "text-red-700" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                    <div className={`text-xl font-black ${color}`}>{value}</div>
                    <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide mt-0.5 leading-tight">{label}</div>
                  </div>
                ))}
              </div>
              {/* Trip card preview */}
              <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-amber-400 shadow-sm p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-amber-400 flex items-center justify-center text-[10px] font-black text-slate-700 flex-shrink-0">67%</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Northumberland Junior Open</span>
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">1 MED</span>
                  </div>
                  <span className="text-slate-500 text-xs">Slaley Hall Golf Club · 15 Jul 2026</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs">
                  <span className="bg-green-50 text-green-700 border border-green-200 font-bold px-2 py-1 rounded-lg">4 received</span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-1 rounded-lg">2 pending</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs text-slate-400 italic">Click through 8 screens of the real workflow →</span>
              </div>
            </div>
          </div>

          {/* Overlay CTA */}
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(5,46,22,0.85) 100%)" }}>
            <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4">
              <p className="text-white font-semibold text-sm opacity-90">
                Interactive · 8 screens · No sign-up required
              </p>
              <a href="/demo"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base shadow-xl hover:opacity-95 transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #b07c12, #e0aa30)", color: "white" }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Try it yourself — free, instant
              </a>
            </div>
          </div>
        </div>

        {/* Feature bullets below */}
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          {[
            "Clickable dashboard walkthrough",
            "Medical alert view",
            "Consent email flow",
            "Add golfer form",
            "Medical summary print view",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm font-medium" style={{ color: "#374151" }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "#155230" }}>✓</span>
              {f}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
