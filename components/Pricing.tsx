'use client'

import { useState } from 'react'

const features = [
  'Unlimited staff users',
  'Secure digital consent forms',
  'Medical alerts & emergency contacts',
  'Full audit trail & exports',
  'Consent expiry tracking',
  'GDPR & ICO-ready reporting',
  'Subject Access Request support',
  'Role-based access control',
  'UK data storage',
  'Email & phone support',
]

interface PricingCardProps {
  plan: 'monthly' | 'annual'
}

function PricingCard({ plan }: PricingCardProps) {
  const isAnnual = plan === 'annual'

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div
      className={`relative rounded-2xl p-8 flex flex-col ${
        isAnnual
          ? 'bg-green-700 text-white shadow-xl ring-2 ring-green-700'
          : 'bg-white border border-gray-200 shadow-sm'
      }`}
    >
      {isAnnual && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full tracking-wide uppercase">
            Best value — save £300
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className={`font-bold text-lg mb-1 ${isAnnual ? 'text-white' : 'text-gray-900'}`}>
          {isAnnual ? 'Annual' : 'Monthly'}
        </h3>
        <div className="flex items-end gap-1 mb-2">
          <span className={`text-5xl font-extrabold tracking-tight ${isAnnual ? 'text-white' : 'text-gray-900'}`}>
            £{isAnnual ? '1,500' : '150'}
          </span>
          <span className={`text-base mb-2 ${isAnnual ? 'text-green-200' : 'text-gray-500'}`}>
            /{isAnnual ? 'year' : 'month'}
          </span>
        </div>
        <p className={`text-sm ${isAnnual ? 'text-green-200' : 'text-gray-500'}`}>
          {isAnnual ? 'Billed annually — equivalent to £125/month' : 'Billed monthly, cancel anytime'}
        </p>
      </div>

      <button
        onClick={handleCheckout}
        className={`w-full py-3.5 rounded-xl font-semibold text-base transition-colors mb-6 ${
          isAnnual
            ? 'bg-white text-green-700 hover:bg-green-50'
            : 'bg-green-700 text-white hover:bg-green-800'
        }`}
      >
        Start free trial
      </button>

      <ul className="space-y-3 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm">
            <svg
              className={`w-4 h-4 flex-shrink-0 ${isAnnual ? 'text-green-300' : 'text-green-600'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className={isAnnual ? 'text-green-100' : 'text-gray-700'}>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 px-3 py-1.5 rounded-full mb-4">
            Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            One price. Everything included. No per-user fees, no hidden costs, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          <PricingCard plan="monthly" />
          <PricingCard plan="annual" />
        </div>

        <p className="text-center text-sm text-gray-500">
          30-day free trial on both plans — no credit card required.
          After your trial, billing begins automatically.
        </p>
      </div>
    </section>
  )
}
