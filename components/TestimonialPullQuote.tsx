export default function TestimonialPullQuote() {
  return (
    <section className="py-10 relative" style={{ background: '#f7f5ee' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="relative">
          <span className="absolute -top-4 left-0 text-7xl font-black leading-none select-none pointer-events-none"
            style={{ color: '#a7d9bc', fontFamily: 'Georgia, serif' }}>
            &ldquo;
          </span>
          <p className="text-xl md:text-2xl font-bold italic px-8 leading-snug" style={{ color: '#0a2818' }}>
            Kevin transformed a simple idea into an outstanding safeguarding system, combining vision, expertise and dedication to deliver a solution that exceeded all our expectations.
          </p>
          <span className="absolute -bottom-6 right-0 text-7xl font-black leading-none select-none pointer-events-none"
            style={{ color: '#a7d9bc', fontFamily: 'Georgia, serif', lineHeight: 0 }}>
            &rdquo;
          </span>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="h-px w-8" style={{ background: '#a7d9bc' }} />
          <span className="text-sm font-semibold" style={{ color: '#155230' }}>Paul Tinkler</span>
          <span className="text-sm" style={{ color: '#9ca3af' }}>—</span>
          <span className="text-sm" style={{ color: '#6b7280' }}>Junior Safeguarding Chair, Durham County Golf Union</span>
          <div className="h-px w-8" style={{ background: '#a7d9bc' }} />
        </div>
      </div>
    </section>
  )
}
