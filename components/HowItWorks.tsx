const steps = [
  {
    number: '01',
    title: 'Add your junior golfers to the system',
    description:
      'Import your junior members in minutes. Add medical information, emergency contacts, and notes once — available instantly on any trip.',
  },
  {
    number: '02',
    title: 'Create a trip and assign golfers',
    description:
      'Set up a trip with dates and details. Assign any juniors — the system shows you who already has valid consent and who still needs it.',
  },
  {
    number: '03',
    title: 'Parents receive a secure link by email',
    description:
      'Each parent gets a unique, secure link. No account needed. They complete the digital consent form in minutes on any device.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 px-3 py-1.5 rounded-full mb-4">
            How it works
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple for your team, seamless for parents
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From setup to signed consent in three straightforward steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="text-6xl font-black text-green-50 leading-none mb-3 select-none">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="w-12 h-12 rounded-xl bg-green-700 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-base">
              Staff see everything they need, on any device, even offline.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Medical alerts, emergency contacts, and consent status are available instantly — whether you have signal or not.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
