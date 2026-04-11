'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const TIME_SLOTS = ['9:00am', '10:00am', '11:00am', '2:00pm', '3:00pm', '4:00pm']

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export default function BookDemo() {
  const router = useRouter()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const firstDay = new Date(viewYear, viewMonth, 1)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const offset = (firstDay.getDay() + 6) % 7 // Monday-first

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function getDayDate(day: number) {
    return new Date(viewYear, viewMonth, day)
  }

  function isDayDisabled(day: number) {
    const d = getDayDate(day)
    if (d < today) return true
    const dow = d.getDay()
    return dow === 0 || dow === 6 // no weekends
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = {
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
      organisation: (form.elements.namedItem('organisation') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      date: formatDate(selectedDate),
      time: selectedTime,
    }

    try {
      const res = await fetch('/api/book-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Something went wrong')
      }
      router.push('/thank-you')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <section id="demo" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left — copy */}
          <div className="md:pt-4">
            <div className="inline-block text-xs font-semibold tracking-widest uppercase text-green-700 bg-green-50 px-3 py-1.5 rounded-full mb-6">
              Book a demo
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See CountyConsent in action
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Pick a date and time that suits you. We&apos;ll walk you through the full platform and answer any questions about safeguarding, data compliance, or getting started.
            </p>

            <ul className="space-y-3">
              {[
                'A personalised walkthrough of the platform',
                'How it maps to your current safeguarding workflow',
                'What a SafeGolf-compliant setup looks like',
                'Pricing and getting started',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                  <input id="firstName" name="firstName" type="text" required autoComplete="given-name"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                    placeholder="John" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                  <input id="lastName" name="lastName" type="text" required autoComplete="family-name"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                    placeholder="Smith" />
                </div>
              </div>

              {/* Organisation */}
              <div>
                <label htmlFor="organisation" className="block text-sm font-medium text-gray-700 mb-1.5">Organisation name</label>
                <input id="organisation" name="organisation" type="text" required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  placeholder="e.g. Yorkshire County Golf Union or Hexham Golf Club" />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input id="email" name="email" type="email" required autoComplete="email"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  placeholder="john@countyunion.co.uk" />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input id="phone" name="phone" type="tel" autoComplete="tel"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                  placeholder="07700 900000" />
              </div>

              {/* Calendar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select a date</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Month nav */}
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <button type="button" onClick={prevMonth} disabled={isCurrentMonth}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm font-semibold text-gray-900">{MONTHS[viewMonth]} {viewYear}</span>
                    <button type="button" onClick={nextMonth}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 transition">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 border-b border-gray-100">
                    {DAYS.map(d => (
                      <div key={d} className="text-center py-2 text-xs font-semibold text-gray-400">{d}</div>
                    ))}
                  </div>

                  {/* Day cells */}
                  <div className="grid grid-cols-7 p-2 gap-1">
                    {cells.map((day, i) => {
                      if (!day) return <div key={i} />
                      const disabled = isDayDisabled(day)
                      const d = getDayDate(day)
                      const isSelected = !!selectedDate && isSameDay(d, selectedDate)
                      const isToday = isSameDay(d, today)
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={disabled}
                          onClick={() => { setSelectedDate(d); setSelectedTime(null) }}
                          className={[
                            'w-full aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all',
                            disabled
                              ? 'text-gray-300 cursor-not-allowed'
                              : isSelected
                              ? 'bg-green-700 text-white'
                              : isToday
                              ? 'border border-green-600 text-green-700 hover:bg-green-50'
                              : 'text-gray-700 hover:bg-green-50 hover:text-green-700',
                          ].join(' ')}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Time slots — shown after date selected */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select a time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={[
                          'py-2.5 rounded-lg text-sm font-medium border transition-all',
                          selectedTime === slot
                            ? 'bg-green-700 border-green-700 text-white'
                            : 'border-gray-200 text-gray-700 hover:border-green-600 hover:text-green-700',
                        ].join(' ')}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-2.5">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !selectedDate || !selectedTime}
                className="w-full py-3.5 rounded-xl bg-green-700 text-white font-semibold text-base hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Booking...'
                  : selectedDate && selectedTime
                  ? `Book for ${formatDate(selectedDate)} at ${selectedTime}`
                  : 'Select a date and time above'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                We&apos;ll confirm by email and send a video call link before the session.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
