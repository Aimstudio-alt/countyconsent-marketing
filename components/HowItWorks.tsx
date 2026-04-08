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
    description:
      'Import your county juniors into CountyConsent in minutes. Add each player once — their medical information, emergency contacts, and GP details are stored securely and available for every future trip.',
    mockup: <AddJuniorsMockup />,
  },
  {
    number: '02',
    label: 'Plan',
    title: 'Create a trip and assign juniors',
    description:
      'Set up a trip with dates, venue and overnight details. Assign any juniors from your roster — the system immediately shows you who already holds valid consent and who still needs it.',
    mockup: <TripSetupMockup />,
  },
  {
    number: '03',
    label: 'Notify',
    title: 'Parents receive a secure link by email',
    description:
      'Each parent gets a unique, tamper-proof link directly to their child\'s consent form. No account needed, no app to download. Works on any phone in seconds.',
    mockup: <EmailMockup />,
  },
  {
    number: '04',
    label: 'Consent',
    title: 'Parents complete the form digitally',
    description:
      'The form covers everything — emergency contacts, medical conditions, medication, allergies, photography consent and a digital signature. Submitted instantly. Stored securely. Auditable forever.',
    mockup: <ConsentFormMockup />,
  },
  {
    number: '05',
    label: 'Go',
    title: 'Staff have everything on the day',
    description:
      'On the morning of departure, every staff member has instant access to consent status, medical alerts and emergency contacts on their phone — even without a signal. No paperwork. No panic.',
    mockup: <StaffViewMockup />,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 px-3 py-1.5 rounded-full mb-4">
            How it works
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            From roster to roadtrip in five steps
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A complete walkthrough of how CountyConsent works — from setting up your union to the moment you board the coach.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-28">
          {steps.map((step, i) => {
            const isEven = i % 2 === 1
            return (
              <div
                key={step.number}
                className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${isEven ? '' : ''}`}
              >
                {/* Text — alternates left/right */}
                <div className={isEven ? 'md:order-2' : ''}>
                  {/* Step pill */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-green-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-black">{step.number}</span>
                    </div>
                    <span className="text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                      {step.label}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {step.description}
                  </p>

                  {/* Connector to next step */}
                  {i < steps.length - 1 && (
                    <div className="mt-8 flex items-center gap-2 text-sm text-gray-400">
                      <div className="h-px flex-1 bg-gray-200 max-w-12" />
                      <span>Then</span>
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            )
          })}
        </div>

        {/* Bottom callout */}
        <div className="mt-24 bg-green-700 rounded-2xl p-8 md:p-10 text-center">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
            Ready to see it in action?
          </h3>
          <p className="text-green-200 mb-6 max-w-xl mx-auto">
            We'll walk you through the whole flow live, tailored to your county union's setup.
          </p>
          <a
            href="#demo"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-green-700 font-bold text-base hover:bg-green-50 transition-colors"
          >
            Request a demo
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
