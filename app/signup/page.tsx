'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const GOVERNING_BODIES = [
  'England Golf',
  'Scotland Golf',
  'Wales Golf',
  'Golf Ireland',
]

type AccountType = 'county_union' | 'golf_club'

type CountyUnion = {
  id: string
  county_union_name: string
  governing_body: string
}

function SignupForm() {
  const searchParams = useSearchParams()
  const planParam = searchParams.get('plan')
  const plan: 'monthly' | 'annual' = planParam === 'annual' ? 'annual' : 'monthly'

  const [accountType, setAccountType] = useState<AccountType>('county_union')
  const [countyUnions, setCountyUnions] = useState<CountyUnion[]>([])
  const [countyUnionsLoading, setCountyUnionsLoading] = useState(false)

  const [form, setForm] = useState({
    organisationName: '',
    governingBody: '',
    contactName: '',
    email: '',
    phone: '',
    parentCountyId: '',
    password: '',
    passwordConfirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load county unions when Golf Club is selected
  useEffect(() => {
    if (accountType !== 'golf_club') return
    setCountyUnionsLoading(true)
    fetch('/api/county-unions')
      .then(r => r.json())
      .then(d => setCountyUnions(d.countyUnions || []))
      .catch(() => setCountyUnions([]))
      .finally(() => setCountyUnionsLoading(false))
  }, [accountType])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.passwordConfirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (accountType === 'golf_club' && !form.parentCountyId) {
      setError('Please select which county union your club belongs to.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountType,
          countyUnionName: form.organisationName,
          governingBody: form.governingBody,
          secretaryName: form.contactName,
          email: form.email,
          phone: form.phone,
          parentCountyId: accountType === 'golf_club' ? form.parentCountyId : undefined,
          password: form.password,
          plan,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 transition-all'
  const ringStyle = { '--tw-ring-color': '#155230' } as React.CSSProperties

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f7f5ee' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#155230,#228450)' }}
            >
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-base">CountyConsent</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">

          {/* Plan badge */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border mb-4"
              style={{ background: '#edf7f2', borderColor: '#a7d9bc', color: '#155230' }}
            >
              {plan === 'annual'
                ? '✓ Annual plan — £1,490/year (save £298)'
                : '✓ Monthly plan — £149/month'}
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: '#0a2818' }}>
              Create your account
            </h1>
            <p className="text-gray-500 text-sm">
              30-day free trial · no credit card required today
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5"
          >
            {error && (
              <div className="rounded-xl p-4 text-sm font-medium" style={{ background: '#fef2f2', color: '#dc2626' }}>
                {error}
              </div>
            )}

            {/* Account type selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'county_union', label: 'County Union', desc: 'Manage member clubs & county events' },
                  { value: 'golf_club', label: 'Golf Club', desc: 'Manage junior consent for your club' },
                ] as { value: AccountType; label: string; desc: string }[]).map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setAccountType(opt.value)
                      setForm(prev => ({ ...prev, parentCountyId: '' }))
                    }}
                    className="text-left px-4 py-3.5 rounded-xl border-2 transition-all"
                    style={
                      accountType === opt.value
                        ? { borderColor: '#155230', background: '#edf7f2' }
                        : { borderColor: '#e5e7eb', background: '#fff' }
                    }
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={
                          accountType === opt.value
                            ? { borderColor: '#155230', background: '#155230' }
                            : { borderColor: '#d1d5db', background: '#fff' }
                        }
                      >
                        {accountType === opt.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{opt.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-6 leading-snug">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* County union selector (golf clubs only) */}
            {accountType === 'golf_club' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="parentCountyId">
                  County union
                </label>
                {countyUnionsLoading ? (
                  <div className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-400">
                    Loading county unions…
                  </div>
                ) : countyUnions.length === 0 ? (
                  <div className="w-full px-4 py-3 rounded-xl border border-amber-200 text-sm text-amber-700 bg-amber-50">
                    No registered county unions found. Please contact us for help.
                  </div>
                ) : (
                  <select
                    id="parentCountyId"
                    name="parentCountyId"
                    required
                    value={form.parentCountyId}
                    onChange={handleChange}
                    className={`${inputClass} bg-white`}
                    style={ringStyle}
                  >
                    <option value="">Select your county union</option>
                    {countyUnions.map(cu => (
                      <option key={cu.id} value={cu.id}>
                        {cu.county_union_name} ({cu.governing_body})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Organisation name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="organisationName">
                {accountType === 'golf_club' ? 'Golf club name' : 'County union name'}
              </label>
              <input
                id="organisationName"
                name="organisationName"
                type="text"
                required
                placeholder={
                  accountType === 'golf_club'
                    ? 'e.g. Brancepeth Castle Golf Club'
                    : 'e.g. Durham County Golf Union'
                }
                value={form.organisationName}
                onChange={handleChange}
                className={inputClass}
                style={ringStyle}
              />
            </div>

            {/* Governing body */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="governingBody">
                Governing body
              </label>
              <select
                id="governingBody"
                name="governingBody"
                required
                value={form.governingBody}
                onChange={handleChange}
                className={`${inputClass} bg-white`}
                style={ringStyle}
              >
                <option value="">Select governing body</option>
                {GOVERNING_BODIES.map(gb => (
                  <option key={gb} value={gb}>{gb}</option>
                ))}
              </select>
            </div>

            {/* Contact name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="contactName">
                {accountType === 'golf_club' ? 'Club secretary full name' : 'County secretary full name'}
              </label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                required
                placeholder="e.g. Jane Smith"
                value={form.contactName}
                onChange={handleChange}
                className={inputClass}
                style={ringStyle}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder={
                  accountType === 'golf_club' ? 'secretary@myclubgolf.org' : 'jane@durhamgolf.org'
                }
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                style={ringStyle}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="phone">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="e.g. 07700 900000"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                style={ringStyle}
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass}
                  style={ringStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="passwordConfirm">
                  Confirm password
                </label>
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  required
                  minLength={8}
                  placeholder="Repeat password"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  className={inputClass}
                  style={ringStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-base text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}
            >
              {loading ? 'Creating account…' : 'Continue to payment →'}
            </button>

            <p className="text-center text-xs text-gray-400 leading-relaxed">
              By creating an account you agree to our terms of service and privacy policy.
              Your trial starts today — payment details collected after sign-up.
            </p>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <a
              href={process.env.NEXT_PUBLIC_APP_URL || 'https://app.countyconsent.co.uk'}
              className="font-semibold"
              style={{ color: '#155230' }}
            >
              Sign in
            </a>
          </p>

          <div className="mt-6 flex items-center justify-center gap-6">
            {['UK GDPR compliant', 'UK data storage', '30-day free trial'].map(item => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-gray-400">
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: '#34a866' }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
