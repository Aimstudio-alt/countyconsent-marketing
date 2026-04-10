'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ── Types ────────────────────────────────────────────────────

type County = {
  id: string
  county_union_name: string
  governing_body: string
  secretary_name: string
  email: string
  phone: string
  plan: string
  subscription_status: string
  account_type: 'county_union' | 'golf_club'
  parent_county_id: string | null
  parent_county_name: string | null
  created_at: string
}

type Player = {
  id: string
  county_id: string
  full_name: string
  date_of_birth: string | null
  parent_name: string | null
  parent_email: string | null
  consent_status: 'pending' | 'consent_received' | 'declined' | 'expired'
  created_at: string
  club_name?: string
}

type CountyEvent = {
  id: string
  name: string
  event_date: string | null
  description: string | null
  player_count: number
  created_at: string
}

type Tab = 'players' | 'events' | 'search'
type AuthState = 'loading' | 'unauthenticated' | 'authorized'

// ── Helpers ──────────────────────────────────────────────────

const CONSENT_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  consent_received: 'bg-green-50 text-green-700 border-green-100',
  declined: 'bg-red-50 text-red-700 border-red-100',
  expired: 'bg-gray-100 text-gray-500 border-gray-200',
}

const CONSENT_LABELS: Record<string, string> = {
  pending: 'Pending',
  consent_received: 'Consent received',
  declined: 'Declined',
  expired: 'Expired',
}

function fmt(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white'

// ── Main component ───────────────────────────────────────────

export default function DashboardPage() {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [county, setCounty] = useState<County | null>(null)

  // Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // Active tab
  const [tab, setTab] = useState<Tab>('players')

  // ── Players ──
  const [players, setPlayers] = useState<Player[]>([])
  const [playersLoading, setPlayersLoading] = useState(false)
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [addPlayerForm, setAddPlayerForm] = useState({
    fullName: '', dateOfBirth: '', parentName: '', parentEmail: '', consentStatus: 'pending',
  })
  const [addingPlayer, setAddingPlayer] = useState(false)
  const [addPlayerError, setAddPlayerError] = useState('')

  // ── Events ──
  const [events, setEvents] = useState<CountyEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [eventForm, setEventForm] = useState({ name: '', eventDate: '', description: '' })
  const [creatingEvent, setCreatingEvent] = useState(false)
  const [createEventError, setCreateEventError] = useState('')

  // ── Search (county union only) ──
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Player[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(new Set())
  const [addToEventId, setAddToEventId] = useState('')
  const [addingToEvent, setAddingToEvent] = useState(false)
  const [addToEventMsg, setAddToEventMsg] = useState('')

  // ── Data fetchers ─────────────────────────────────────────

  const fetchPlayers = useCallback(async (accessToken: string) => {
    setPlayersLoading(true)
    try {
      const res = await fetch('/api/dashboard/players', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()
      setPlayers(data.players || [])
    } finally {
      setPlayersLoading(false)
    }
  }, [])

  const fetchEvents = useCallback(async (accessToken: string) => {
    setEventsLoading(true)
    try {
      const res = await fetch('/api/dashboard/events', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await res.json()
      setEvents(data.events || [])
    } finally {
      setEventsLoading(false)
    }
  }, [])

  const fetchCounty = useCallback(async (accessToken: string) => {
    const res = await fetch('/api/dashboard/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) return false
    const data = await res.json()
    setCounty(data.county)
    return true
  }, [])

  // ── Auth bootstrap ────────────────────────────────────────

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.access_token) {
        setToken(session.access_token)
        const ok = await fetchCounty(session.access_token)
        if (ok) {
          setAuthState('authorized')
          fetchPlayers(session.access_token)
          fetchEvents(session.access_token)
        } else {
          setAuthState('unauthenticated')
        }
      } else {
        setAuthState('unauthenticated')
      }
    })
  }, [fetchCounty, fetchPlayers, fetchEvents])

  // ── Handlers ──────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })
    setLoggingIn(false)
    if (error) { setLoginError(error.message); return }
    const accessToken = data.session?.access_token
    if (!accessToken) { setLoginError('Login failed.'); return }
    setToken(accessToken)
    const ok = await fetchCounty(accessToken)
    if (!ok) { setLoginError('No county account found for this email.'); return }
    setAuthState('authorized')
    fetchPlayers(accessToken)
    fetchEvents(accessToken)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAuthState('unauthenticated')
    setToken(null)
    setCounty(null)
    setPlayers([])
    setEvents([])
    setSearchResults([])
  }

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddPlayerError('')
    setAddingPlayer(true)
    try {
      const res = await fetch('/api/dashboard/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(addPlayerForm),
      })
      const data = await res.json()
      if (!res.ok) { setAddPlayerError(data.error || 'Failed to add player.'); return }
      setShowAddPlayer(false)
      setAddPlayerForm({ fullName: '', dateOfBirth: '', parentName: '', parentEmail: '', consentStatus: 'pending' })
      if (token) fetchPlayers(token)
    } finally {
      setAddingPlayer(false)
    }
  }

  const handleConsentChange = async (playerId: string, newStatus: string) => {
    await fetch('/api/dashboard/players', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ playerId, consentStatus: newStatus }),
    })
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, consent_status: newStatus as Player['consent_status'] } : p))
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateEventError('')
    setCreatingEvent(true)
    try {
      const res = await fetch('/api/dashboard/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(eventForm),
      })
      const data = await res.json()
      if (!res.ok) { setCreateEventError(data.error || 'Failed to create event.'); return }
      setShowCreateEvent(false)
      setEventForm({ name: '', eventDate: '', description: '' })
      if (token) fetchEvents(token)
    } finally {
      setCreatingEvent(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearchError('')
    setSearchResults([])
    setSelectedPlayerIds(new Set())
    setAddToEventMsg('')
    setSearching(true)
    try {
      const res = await fetch(
        `/api/dashboard/players/search?q=${encodeURIComponent(searchQuery)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      if (!res.ok) { setSearchError(data.error || 'Search failed.'); return }
      setSearchResults(data.players || [])
    } finally {
      setSearching(false)
    }
  }

  const togglePlayer = (id: string) => {
    setSelectedPlayerIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleAddToEvent = async () => {
    if (!addToEventId || selectedPlayerIds.size === 0) return
    setAddingToEvent(true)
    setAddToEventMsg('')
    try {
      const res = await fetch(`/api/dashboard/events/${addToEventId}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ playerIds: [...selectedPlayerIds] }),
      })
      const data = await res.json()
      if (!res.ok) { setAddToEventMsg(`Error: ${data.error}`); return }
      setAddToEventMsg(`${data.added} player${data.added !== 1 ? 's' : ''} added to event.`)
      setSelectedPlayerIds(new Set())
      if (token) fetchEvents(token)
    } finally {
      setAddingToEvent(false)
    }
  }

  // ── LOADING ──────────────────────────────────────────────

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f7f5ee' }}>
        <div className="w-8 h-8 border-2 border-gray-300 border-t-green-700 rounded-full animate-spin" />
      </div>
    )
  }

  // ── LOGIN ─────────────────────────────────────────────────

  if (authState === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#f7f5ee' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}
              >
                <svg style={{ width: '22px', height: '22px' }} fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </Link>
            <h1 className="text-2xl font-black text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-500 mt-1">CountyConsent dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
            {loginError && (
              <div className="rounded-xl p-3 text-sm text-red-700 bg-red-50">{loginError}</div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email" required value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password" required value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="submit" disabled={loggingIn}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}
            >
              {loggingIn ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: '#155230' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ─────────────────────────────────────────────

  const isCountyUnion = county?.account_type === 'county_union'

  const tabs: { id: Tab; label: string; hidden?: boolean }[] = [
    { id: 'players', label: 'Players' },
    { id: 'events', label: 'County events', hidden: !isCountyUnion },
    { id: 'search', label: 'Search all clubs', hidden: !isCountyUnion },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f7f5ee' }}>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm hidden sm:block">CountyConsent</span>
            </Link>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{ background: '#edf7f2', borderColor: '#a7d9bc', color: '#155230' }}
            >
              {isCountyUnion ? 'County Union' : 'Golf Club'}
            </span>
            {county && (
              <span className="text-sm font-semibold text-gray-900 hidden md:block">
                {county.county_union_name}
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Account info banner for golf clubs */}
        {!isCountyUnion && county?.parent_county_name && (
          <div
            className="mb-6 px-5 py-3.5 rounded-xl border text-sm flex items-center gap-2"
            style={{ background: '#edf7f2', borderColor: '#a7d9bc', color: '#155230' }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Affiliated to <strong className="mx-1">{county.parent_county_name}</strong>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 w-fit">
          {tabs.filter(t => !t.hidden).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={
                tab === t.id
                  ? { background: 'linear-gradient(135deg,#155230,#1a6b3e)', color: '#fff' }
                  : { color: '#6b7280' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PLAYERS TAB ── */}
        {tab === 'players' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  {isCountyUnion ? 'Your players' : 'Club players'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {players.length} player{players.length !== 1 ? 's' : ''} · {players.filter(p => p.consent_status === 'consent_received').length} with consent
                </p>
              </div>
              <button
                onClick={() => setShowAddPlayer(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add player
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {playersLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-green-700 rounded-full animate-spin" />
                </div>
              ) : players.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-sm">
                  No players yet. Add your first player above.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Name', 'Date of birth', 'Parent / guardian', 'Parent email', 'Consent status'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {players.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{p.full_name}</td>
                          <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(p.date_of_birth)}</td>
                          <td className="px-5 py-4 text-gray-600">{p.parent_name || '—'}</td>
                          <td className="px-5 py-4 text-gray-600">{p.parent_email || '—'}</td>
                          <td className="px-5 py-4">
                            <select
                              value={p.consent_status}
                              onChange={e => handleConsentChange(p.id, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full border appearance-none cursor-pointer ${CONSENT_STYLES[p.consent_status] || ''}`}
                            >
                              {Object.entries(CONSENT_LABELS).map(([val, label]) => (
                                <option key={val} value={val}>{label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── EVENTS TAB (county_union only) ── */}
        {tab === 'events' && isCountyUnion && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-black text-gray-900">County events</h2>
                <p className="text-sm text-gray-500 mt-0.5">{events.length} event{events.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => setShowCreateEvent(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create event
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {eventsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-green-700 rounded-full animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-sm">
                  No events yet. Create your first county event above.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Event name', 'Date', 'Description', 'Players'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {events.map(ev => (
                        <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{ev.name}</td>
                          <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(ev.event_date)}</td>
                          <td className="px-5 py-4 text-gray-600 max-w-xs truncate">{ev.description || '—'}</td>
                          <td className="px-5 py-4">
                            <span
                              className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                              style={{ background: '#edf7f2', borderColor: '#a7d9bc', color: '#155230' }}
                            >
                              {ev.player_count} player{ev.player_count !== 1 ? 's' : ''}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SEARCH TAB (county_union only) ── */}
        {tab === 'search' && isCountyUnion && (
          <div>
            <div className="mb-5">
              <h2 className="text-xl font-black text-gray-900">Search all clubs</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Search for players with consent across all golf clubs linked to your county union.
              </p>
            </div>

            {/* Search form */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by player name or club name…"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all"
                style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}
              >
                {searching ? 'Searching…' : 'Search'}
              </button>
            </form>

            {searchError && (
              <div className="rounded-xl p-4 text-sm font-medium mb-4" style={{ background: '#fef2f2', color: '#dc2626' }}>
                {searchError}
              </div>
            )}

            {/* Results */}
            {searchResults.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    {searchResults.length} consented player{searchResults.length !== 1 ? 's' : ''} found
                  </span>
                  {selectedPlayerIds.size > 0 && (
                    <span className="text-xs text-gray-500">
                      {selectedPlayerIds.size} selected
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 w-10">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedPlayerIds.size === searchResults.length}
                            onChange={() => {
                              if (selectedPlayerIds.size === searchResults.length) {
                                setSelectedPlayerIds(new Set())
                              } else {
                                setSelectedPlayerIds(new Set(searchResults.map(p => p.id)))
                              }
                            }}
                          />
                        </th>
                        {['Player name', 'Club', 'Date of birth', 'Status'].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {searchResults.map(p => (
                        <tr
                          key={p.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => togglePlayer(p.id)}
                        >
                          <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="rounded"
                              checked={selectedPlayerIds.has(p.id)}
                              onChange={() => togglePlayer(p.id)}
                            />
                          </td>
                          <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{p.full_name}</td>
                          <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{p.club_name || '—'}</td>
                          <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(p.date_of_birth)}</td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CONSENT_STYLES[p.consent_status] || ''}`}>
                              {CONSENT_LABELS[p.consent_status] || p.consent_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {searchResults.length === 0 && !searching && searchQuery !== '' && !searchError && (
              <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100 shadow-sm">
                No consented players found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            )}

            {/* Add to event */}
            {selectedPlayerIds.size > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    Add {selectedPlayerIds.size} selected player{selectedPlayerIds.size !== 1 ? 's' : ''} to an event
                  </p>
                  {addToEventMsg && (
                    <p
                      className="text-sm mt-1 font-medium"
                      style={{ color: addToEventMsg.startsWith('Error') ? '#dc2626' : '#155230' }}
                    >
                      {addToEventMsg}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <select
                    value={addToEventId}
                    onChange={e => setAddToEventId(e.target.value)}
                    className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <option value="">Select event…</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name}{ev.event_date ? ` — ${fmt(ev.event_date)}` : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddToEvent}
                    disabled={!addToEventId || addingToEvent}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}
                  >
                    {addingToEvent ? 'Adding…' : 'Add to event'}
                  </button>
                </div>
              </div>
            )}

            {events.length === 0 && searchResults.length > 0 && (
              <p className="text-sm text-amber-700 mt-4">
                No events yet —{' '}
                <button onClick={() => setTab('events')} className="underline font-semibold">
                  create one first
                </button>{' '}
                before adding players.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Add player modal ── */}
      {showAddPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900 text-lg">Add player</h2>
              <button onClick={() => setShowAddPlayer(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddPlayer} className="p-6 space-y-4">
              {addPlayerError && (
                <div className="rounded-xl p-3 text-sm text-red-700 bg-red-50">{addPlayerError}</div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name *</label>
                <input
                  required type="text" placeholder="e.g. Jamie Thompson"
                  value={addPlayerForm.fullName}
                  onChange={e => setAddPlayerForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of birth</label>
                <input
                  type="date"
                  value={addPlayerForm.dateOfBirth}
                  onChange={e => setAddPlayerForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parent / guardian name</label>
                <input
                  type="text" placeholder="e.g. Sarah Thompson"
                  value={addPlayerForm.parentName}
                  onChange={e => setAddPlayerForm(prev => ({ ...prev, parentName: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parent / guardian email</label>
                <input
                  type="email" placeholder="sarah@example.com"
                  value={addPlayerForm.parentEmail}
                  onChange={e => setAddPlayerForm(prev => ({ ...prev, parentEmail: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consent status</label>
                <select
                  value={addPlayerForm.consentStatus}
                  onChange={e => setAddPlayerForm(prev => ({ ...prev, consentStatus: e.target.value }))}
                  className={inputClass}
                >
                  {Object.entries(CONSENT_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setShowAddPlayer(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={addingPlayer}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all"
                  style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}
                >
                  {addingPlayer ? 'Adding…' : 'Add player'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create event modal ── */}
      {showCreateEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900 text-lg">Create county event</h2>
              <button onClick={() => setShowCreateEvent(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              {createEventError && (
                <div className="rounded-xl p-3 text-sm text-red-700 bg-red-50">{createEventError}</div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event name *</label>
                <input
                  required type="text" placeholder="e.g. County Junior Championship 2025"
                  value={eventForm.name}
                  onChange={e => setEventForm(prev => ({ ...prev, name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event date</label>
                <input
                  type="date"
                  value={eventForm.eventDate}
                  onChange={e => setEventForm(prev => ({ ...prev, eventDate: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <input
                  type="text" placeholder="Optional notes about the event"
                  value={eventForm.description}
                  onChange={e => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setShowCreateEvent(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={creatingEvent}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all"
                  style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}
                >
                  {creatingEvent ? 'Creating…' : 'Create event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
