import HeroDashboard from './HeroDashboard'

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-20 bg-white overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-green-50 opacity-60 translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-green-50 opacity-40 -translate-x-1/3 translate-y-1/4" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-semibold tracking-wide uppercase mb-6">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Built for county golf unions
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
              CountyConsent —{' '}
              <span className="text-green-700">Junior Safeguarding for Golf</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              CountyConsent is the only GDPR-compliant digital consent system built specifically for county golf unions — so your staff have the right information, at the right time, every time.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href="#demo"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-green-700 text-white font-semibold text-base hover:bg-green-800 transition-colors shadow-sm"
              >
                Request a demo
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-gray-700 font-semibold text-base border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                See how it works
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              {['30-day free trial', 'No credit card required', 'Built with Durham CGU'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — dashboard mockup */}
          <div className="hidden lg:block">
            <HeroDashboard />
          </div>
        </div>

        {/* Mobile dashboard — shown below copy on small screens */}
        <div className="lg:hidden mt-12">
          <HeroDashboard />
        </div>
      </div>
    </section>
  )
}
