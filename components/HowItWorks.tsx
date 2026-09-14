import AddJuniorsMockup from './mockups/AddJuniorsMockup'
import TripSetupMockup from './mockups/TripSetupMockup'
import EmailMockup from './mockups/EmailMockup'
import ConsentFormMockup from './mockups/ConsentFormMockup'
import StaffViewMockup from './mockups/StaffViewMockup'

const steps = [
  {
    number: '01',
    label: 'Register',
    title: 'Build your register',
    description: 'Import a membership list or add junior golfers individually — the first thing anyone does, whether you\'re a golf club or a county union.',
    mockup: <AddJuniorsMockup />,
    bg: 'white',
  },
  {
    number: '02',
    label: 'Confirm',
    title: 'Check the contact details',
    description: 'Imported emails are held unconfirmed until someone confirms each one genuinely belongs to a parent or guardian. Nothing is ever sent until they are.',
    mockup: null,
    bg: '#f7f5ee',
  },
  {
    number: '03',
    label: 'Send',
    title: 'Send consent requests',
    description: 'Send to everyone confirmed at once, or chase a single parent individually — whichever the moment calls for.',
    mockup: <EmailMockup />,
    bg: 'white',
  },
  {
    number: '04',
    label: 'Consent',
    title: 'Parents complete the form',
    description: 'Consent, emergency contacts, medical information, GP details and permissions — completed from any device, no printing or chasing paperwork.',
    mockup: <ConsentFormMockup />,
    bg: '#f7f5ee',
  },
  {
    number: '05',
    label: 'Record',
    title: 'Everything on the golfer\'s record',
    description: 'Consent, medical alerts and emergency contacts live on the golfer\'s own record — searchable at any time, with no trip required.',
    mockup: <StaffViewMockup />,
    bg: 'white',
  },
  {
    number: '06',
    label: 'Trips',
    title: 'Trips, optional',
    description: 'County unions can group golfers from the register for an event. Entirely optional, and mainly used by county unions rather than individual clubs.',
    mockup: <TripSetupMockup />,
    bg: '#f7f5ee',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works">

      {/* Section header — on its own background */}
      <div className="py-20 text-center bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-5 border"
            style={{background:'#edf7f2',borderColor:'#a7d9bc',color:'#155230'}}>
            How it works
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4" style={{color:'#0a2818'}}>
            From register to record<br className="hidden md:block" /> in six steps
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{color:'#6b7280'}}>
            A complete walkthrough of how CountyConsent works — from building your register to keeping every golfer&apos;s record ready, whenever a trip comes up.
          </p>
        </div>
      </div>

      {/* Steps — each on alternating bg */}
      {steps.map((step, i) => {
        const isEven = i % 2 === 1
        return (
          <div key={step.number} style={{background: step.bg}}>
            <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
              <div className={step.mockup ? 'grid md:grid-cols-2 gap-12 md:gap-20 items-center' : ''}>

                {/* Text */}
                <div className={step.mockup ? (isEven ? 'md:order-2' : '') : 'max-w-2xl mx-auto text-center'}>
                  {/* Giant step number */}
                  <div className="font-black leading-none mb-4 select-none"
                    style={{fontSize:'clamp(80px,14vw,120px)',color:'transparent',WebkitTextStroke:'2px #15523020',lineHeight:1}}>
                    {step.number}
                  </div>

                  <div className={`flex items-center gap-3 mb-4 -mt-4 ${step.mockup ? '' : 'justify-center'}`}>
                    <span className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
                      style={{background:'#edf7f2',borderColor:'#a7d9bc',color:'#155230'}}>
                      {step.label}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black leading-snug mb-5" style={{color:'#0a2818'}}>
                    {step.title}
                  </h3>
                  <p className="text-lg leading-relaxed" style={{color:'#4b5563'}}>
                    {step.description}
                  </p>

                  {i < steps.length - 1 && (
                    <div className={`mt-8 flex items-center gap-3 ${step.mockup ? '' : 'justify-center'}`}>
                      <div className="h-px w-8 bg-gray-300" />
                      <span className="text-sm font-medium" style={{color:'#9ca3af'}}>then</span>
                      <svg className="w-4 h-4" style={{color:'#155230'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Mockup */}
                {step.mockup && (
                  <div className={isEven ? 'md:order-1' : ''}>
                    {step.mockup}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Illustration disclaimer */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 pt-6 pb-2 text-center">
          <p className="text-xs text-gray-400">
            Screen mockups shown are for illustration purposes only and may not reflect the exact appearance of the live platform.
          </p>
        </div>
      </div>

      {/* CTA block */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 pb-24">
          <div className="rounded-2xl p-10 text-center relative overflow-hidden"
            style={{background:'linear-gradient(135deg,#0a2818 0%,#155230 60%,#1a6b3e 100%)'}}>
            <div className="absolute inset-0 pointer-events-none"
              style={{backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.03) 1px,transparent 1px)',backgroundSize:'24px 24px'}} />
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3">Ready to see it in action?</h3>
              <p className="text-green-200 text-lg mb-7 max-w-xl mx-auto">
                We&apos;ll walk you through the whole flow live, tailored to your organisation&apos;s setup.
              </p>
              <a href="#demo" className="inline-flex items-center px-7 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90"
                style={{background:'#c9921c',color:'white'}}>
                Request a demo
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
