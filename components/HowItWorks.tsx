import InviteStaffMockup from './mockups/InviteStaffMockup'
import AddJuniorsMockup from './mockups/AddJuniorsMockup'
import TripSetupMockup from './mockups/TripSetupMockup'
import EmailMockup from './mockups/EmailMockup'
import ConsentFormMockup from './mockups/ConsentFormMockup'
import StaffViewMockup from './mockups/StaffViewMockup'

const steps = [
  {
    number: '01',
    label: 'Team',
    title: 'Invite your team managers',
    description: 'Add the staff who will run your trips. Each manager receives an invite link by email and sets up their own password — no shared logins.',
    mockup: <InviteStaffMockup />,
    bg: 'white',
  },
  {
    number: '02',
    label: 'Register',
    title: 'Build your junior golfer register',
    description: 'Add junior golfers to your county register once. Import in bulk via CSV or add individually — they\'re then available for any trip.',
    mockup: <AddJuniorsMockup />,
    bg: '#f7f5ee',
  },
  {
    number: '03',
    label: 'Plan',
    title: 'Create a trip and assign managers',
    description: 'Set up your away trip or tournament in seconds — add the venue, dates and assign the team managers who will be travelling.',
    mockup: <TripSetupMockup />,
    bg: 'white',
  },
  {
    number: '04',
    label: 'Notify',
    title: 'Add golfers and send consent requests',
    description: 'Select golfers from your register and add them to the trip. Each parent automatically receives a unique secure link to complete their child\'s consent form.',
    mockup: <EmailMockup />,
    bg: '#f7f5ee',
  },
  {
    number: '05',
    label: 'Consent',
    title: 'Parents complete the form digitally',
    description: 'Parents fill in medical information, emergency contacts and give consent from any device — no printing, no chasing, no missing paperwork.',
    mockup: <ConsentFormMockup />,
    bg: 'white',
  },
  {
    number: '06',
    label: 'Go',
    title: 'Staff have everything on the day',
    description: 'On the day, staff have instant access to medical summaries, emergency contacts and full consent records — online or offline.',
    mockup: <StaffViewMockup />,
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
            From register to roadtrip<br className="hidden md:block" /> in six steps
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{color:'#6b7280'}}>
            A complete walkthrough of how CountyConsent works — from setting up your organisation to the moment you board the coach.
          </p>
        </div>
      </div>

      {/* Steps — each on alternating bg */}
      {steps.map((step, i) => {
        const isEven = i % 2 === 1
        return (
          <div key={step.number} style={{background: step.bg}}>
            <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
              <div className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${isEven ? '' : ''}`}>

                {/* Text */}
                <div className={isEven ? 'md:order-2' : ''}>
                  {/* Giant step number */}
                  <div className="font-black leading-none mb-4 select-none"
                    style={{fontSize:'clamp(80px,14vw,120px)',color:'transparent',WebkitTextStroke:'2px #15523020',lineHeight:1}}>
                    {step.number}
                  </div>

                  <div className="flex items-center gap-3 mb-4 -mt-4">
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
                    <div className="mt-8 flex items-center gap-3">
                      <div className="h-px w-8 bg-gray-300" />
                      <span className="text-sm font-medium" style={{color:'#9ca3af'}}>then</span>
                      <svg className="w-4 h-4" style={{color:'#155230'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Mockup */}
                <div className={isEven ? 'md:order-1' : ''}>
                  {step.mockup}
                </div>
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
