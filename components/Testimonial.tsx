const testimonials = [
  {
    quote: [
      'Durham County Golf Union has benefited enormously from working with Kevin Jager in the development and implementation of CountyConsent.',
      'Kevin took an initial concept and, through his expertise, innovation and commitment, developed a comprehensive digital safeguarding and parental consent system that has transformed our processes. The platform has significantly reduced administration, improved access to critical safeguarding information and strengthened our ability to support young and vulnerable participants effectively.',
      'Throughout the project, Kevin demonstrated a clear understanding of our requirements and worked collaboratively to ensure the system met the needs of the organisation. His professionalism, responsiveness and technical knowledge were outstanding.',
      'CountyConsent has exceeded our expectations and provides a model that could be successfully adopted across many sports and activities. We are grateful for Kevin’s contribution and would confidently recommend his services to other organisations seeking innovative digital solutions.',
    ],
    name: 'Paul Tinkler',
    role: 'Junior Safeguarding Chair',
    org: 'Durham County Golf Union',
    image: '/paultinkler.jpg',
    initials: 'PT',
  },
  {
    quote: [
      'CountyConsent has taken the pain out of junior consent for us. Parents complete everything online, our safeguarding team can see exactly who’s covered at a glance, and it even syncs with our GolfGenius platform — nothing gets lost in email chains or paper forms.',
      'Setup was straightforward and the support has been first class. I’d recommend it to any county union or club.',
    ],
    name: 'Simon Coultas',
    role: 'Secretary',
    org: 'Northumberland Union of Golf Clubs',
    image: '/simoncoultas.png',
    initials: 'SC',
  },
]

export default function Testimonial() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#f7f5ee' }}>
      {/* Decorative blobs */}
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle,#a7d9bc,transparent)', transform: 'translate(-40%,40%)' }} />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle,#c9921c,transparent)', transform: 'translate(30%,-30%)' }} />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-4 border"
            style={{ background: '#edf7f2', borderColor: '#a7d9bc', color: '#155230' }}>
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: '#0a2818' }}>
            Trusted by county golf leadership
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg,#0a2818 0%,#155230 60%,#0f3d24 100%)' }}>
              <div className="p-8 md:p-10">
                {/* Quote mark */}
                <div className="text-8xl font-black leading-none mb-2 select-none" style={{ color: 'rgba(167,217,188,0.35)', fontFamily: 'Georgia, serif', lineHeight: '0.8' }}>
                  &ldquo;
                </div>

                <blockquote className="text-white/90 text-base md:text-lg leading-relaxed space-y-4 mb-10">
                  {t.quote.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-5 pt-8 border-t border-white/15">
                  <div className="p-[3px] rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg,#a7d9bc,#c9921c)' }}>
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      {t.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-black"
                          style={{ background: '#0a2818', color: '#a7d9bc' }}>
                          {t.initials}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{t.name}</div>
                    <div className="text-green-300 text-sm font-medium">{t.role}</div>
                    <div className="text-white/50 text-xs mt-0.5">{t.org}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
