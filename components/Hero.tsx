import HeroDashboard from './HeroDashboard'
import HeroGraphic from './graphics/HeroGraphic'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden" style={{background:'linear-gradient(160deg,#fdfcf8 0%,#f0f7f2 40%,#fdfcf8 100%)'}}>

      {/* Background graphic */}
      <div className="absolute right-0 top-0 w-[55%] h-full opacity-60 pointer-events-none hidden lg:block">
        <HeroGraphic />
      </div>

      {/* Dot grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(circle,#15523010 1px,transparent 1px)',backgroundSize:'32px 32px'}} />

      <div className="relative max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-8 border"
              style={{background:'#edf7f2',borderColor:'#a7d9bc',color:'#155230'}}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              Built for county golf unions
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-5" style={{color:'#0a2818'}}>
              One missing<br />
              consent form<br />
              <span className="text-gradient">could change<br />everything.</span>
            </h1>

            <p className="text-xl font-bold mb-4" style={{color:'#c9921c'}}>
              Junior Golf Safeguarding, Done Right.
            </p>

            <p className="text-lg leading-relaxed mb-10" style={{color:'#374151'}}>
              CountyConsent is the only GDPR-compliant digital consent system built specifically for county golf unions — so your staff have the right information, at the right time, every time.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <a href="/pricing" className="inline-flex items-center justify-center px-7 py-4 rounded-xl text-white font-bold text-base shadow-lg hover:opacity-90 transition-all hover:-translate-y-0.5"
                style={{background:'linear-gradient(135deg,#155230,#1a6b3e)'}}>
                Get started free
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="/demo" className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-bold text-base shadow-lg hover:opacity-90 transition-all hover:-translate-y-0.5"
                style={{background:'linear-gradient(135deg,#b07c12,#e0aa30)',color:'white'}}>
                Try it yourself
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-semibold text-base border-2 transition-all hover:bg-white"
                style={{borderColor:'#d1d5db',color:'#374151'}}>
                See how it works
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-6 border-t border-gray-200">
              {[
                { icon: '✓', label: '30-day free trial' },
                { icon: '✓', label: 'No credit card required' },
                { icon: '✓', label: 'UK data storage' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm font-medium" style={{color:'#4b5563'}}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{background:'#155230'}}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — dashboard */}
          <div className="hidden lg:block">
            <HeroDashboard />
          </div>
        </div>

        {/* Mobile dashboard */}
        <div className="lg:hidden mt-16">
          <HeroDashboard />
        </div>
      </div>
    </section>
  )
}
