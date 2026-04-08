import AddJuniorsMockup from './mockups/AddJuniorsMockup'
import TripSetupMockup from './mockups/TripSetupMockup'
import EmailMockup from './mockups/EmailMockup'
import ConsentFormMockup from './mockups/ConsentFormMockup'
import StaffViewMockup from './mockups/StaffViewMockup'

const steps = [
  {
    number: '01',
    label: 'Setup',
    title: 'Add your junior members',
    description: 'Import your county juniors into CountyConsent in minutes. Add each player once — their medical information, emergency contacts, and GP details are stored securely and available for every future trip.',
    mockup: <AddJuniorsMockup />,
    bg: 'white',
  },
  {
    number: '02',
    label: 'Plan',
    title: 'Create a trip and assign juniors',
    description: 'Set up a trip with dates, venue and overnight details. Assign any juniors from your roster — the system immediately shows you who already holds valid consent and who still needs it.',
    mockup: <TripSetupMockup />,
    bg: '#f7f5ee',
  },
  {
    number: '03',
    label: 'Notify',
    title: 'Parents receive a secure link by email',
    description: "Each parent gets a unique, tamper-proof link directly to their child's consent form. No account needed, no app to download — works on any phone in seconds.",
    mockup: <EmailMockup />,
    bg: 'white',
  },
  {
    number: '04',
    label: 'Consent',
    title: 'Parents complete the form digitally',
    description: 'The form covers everything — emergency contacts, medical conditions, medication, allergies, photography consent and a digital signature. Submitted instantly. Stored securely. Auditable forever.',
    mockup: <ConsentFormMockup />,
    bg: '#f7f5ee',
  },
  {
    number: '05',
    label: 'Go',
    title: 'Staff have everything on the day',
    description: "On the morning of departure, every staff member has instant access to consent status, medical alerts and emergency contacts — even without a signal. No paperwork. No panic.",
    mockup: <StaffViewMockup />,
    bg: 'white',
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
            From roster to roadtrip<br className="hidden md:block" /> in five steps
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{color:'#6b7280'}}>
            A complete walkthrough of how CountyConsent works — from setting up your union to the moment you board the coach.
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
                We&apos;ll walk you through the whole flow live, tailored to your county union&apos;s setup.
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
