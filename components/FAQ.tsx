'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'Is there a setup fee?',
    a: 'No. There are no setup fees, no onboarding fees, and no hidden costs of any kind. Your subscription covers everything.',
  },
  {
    q: 'How many staff users can we have?',
    a: 'Unlimited. Add as many coaches, administrators, and county staff as you need — your subscription covers your entire organisation.',
  },
  {
    q: 'Where is our data stored?',
    a: 'All data is stored securely in the UK, on UK-based servers. We never transfer data outside the UK or EEA. Your data handling is fully GDPR compliant.',
  },
  {
    q: 'Can we cancel anytime?',
    a: 'Yes. Monthly subscribers can cancel at any time and your subscription will run until the end of the current billing period. Annual subscribers receive a pro-rata refund for any unused months.',
  },
  {
    q: 'Is it really built for golf organisations?',
    a: 'Yes. CountyConsent was built in direct partnership with Durham County Golf Union and is designed for both county unions and individual golf clubs. It reflects the real workflows, safeguarding requirements, and England Golf accreditation standards that organisations face.',
  },
  {
    q: 'What happens after the 30-day free trial?',
    a: 'At the end of your trial you can choose to subscribe. We\'ll remind you before the trial ends. No card is required to start, and we won\'t charge anything without your explicit action.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 flex items-center justify-between gap-4 hover:text-green-700 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-base">{q}</span>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 -mt-1">
          <p className="text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 px-3 py-1.5 rounded-full mb-4">
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Questions answered
          </h2>
        </div>

        <div className="bg-gray-50 rounded-2xl px-6 md:px-8">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  )
}
