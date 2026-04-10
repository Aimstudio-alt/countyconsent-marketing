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
  account_type: 'county_union' | 'golf_club'
  parent_county_name: string | null
  subscription_status: string
}

type Player = {
  id: string
  county_id: string
  full_name: string
  date_of_birth: string | null
  parent_name: string | null
  parent_email: string | null
  consent_status: 'pending' | 'consent_received' | 'declined' | 'expired'
  club_name?: string
}

type Trip = {
  id: string
  name: string
  event_date: string | null
  description: string | null
  player_count: number
}

type Squad = {
  id: string
  name: string
  description: string | null
  player_count: number
}

type Tab = 'players' | 'trips' | 'squads' | 'search'
type AuthState = 'loading' | 'unauthenticated' | 'authorized'

// Shared selector target — what we're adding players into
type SelectorTarget = { type: 'trip'; id: string; name: string } | { type: 'squad'; id: string; name: string }

// ── Helpers ──────────────────────────────────────────────────

const CONSENT_STYLES: Record<string, string> = {
  pending:          'bg-amber-50 text-amber-700 border-amber-100',
  consent_received: 'bg-green-50 text-green-700 border-green-100',
  declined:         'bg-red-50 text-red-700 border-red-100',
  expired:          'bg-gray-100 text-gray-500 border-gray-200',
}
const CONSENT_LABELS: Record<string, string> = {
  pending:          'Pending',
  consent_received: 'Consent received',
  declined:         'Declined',
  expired:          'Expired',
}

function fmt(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white'

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-gray-400 hover:text-gray-600">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}

// ── PlayerSelector modal ──────────────────────────────────────
// Identical for trips and squads. Shows own players + cross-county section
// for county union accounts.

type PlayerSelectorProps = {
  target: SelectorTarget
  token: string
  county: County
  ownPlayers: Player[]
  onClose: () => void
  onAdded: () => void
}

function PlayerSelector({ target, token, county, ownPlayers, onClose, onAdded }: PlayerSelectorProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [adding, setAdding] = useState(false)
  const [msg, setMsg] = useState('')

  // Cross-county (county union only)
  const [crossSearch, setCrossSearch] = useState('')
  const [crossResults, setCrossResults] = useState<Player[]>([])
  const [crossSearching, setCrossSearching] = useState(false)
  const [crossError, setCrossError] = useState('')
  const [showCross, setShowCross] = useState(false)

  const isCountyUnion = county.account_type === 'county_union'

  const filteredOwn = ownPlayers.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: string) =>
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const handleCrossSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setCrossError('')
    setCrossResults([])
    setCrossSearching(true)
    try {
      const res = await fetch(
        `/api/dashboard/players/search?q=${encodeURIComponent(crossSearch)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      if (!res.ok) { setCrossError(data.error || 'Search failed.'); return }
      // Exclude players already in own list
      const ownIds = new Set(ownPlayers.map(p => p.id))
      setCrossResults((data.players || []).filter((p: Player) => !ownIds.has(p.id)))
    } finally {
      setCrossSearching(false)
    }
  }

  const handleAdd = async () => {
    if (selected.size === 0) return
    setAdding(true)
    setMsg('')
    const url = target.type === 'trip'
      ? `/api/dashboard/trips/${target.id}/players`
      : `/api/dashboard/squads/${target.id}/players`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ playerIds: [...selected] }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(`Error: ${data.error}`); return }
      setMsg(`${data.added} player${data.added !== 1 ? 's' : ''} added.`)
      setSelected(new Set())
      onAdded()
    } finally {
      setAdding(false)
    }
  }

  const allVisible = [...filteredOwn, ...crossResults]
  const allSelected = allVisible.length > 0 && allVisible.every(p => selected.has(p.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col" style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-black text-gray-900 text-lg leading-snug">Add players</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Adding to <span className="font-semibold text-gray-700">{target.name}</span>
              <span className="ml-1.5 text-xs px-2 py-0.5 rounded-full border font-medium"
                style={{ background: '#f3f4f6', borderColor: '#e5e7eb', color: '#6b7280' }}>
                {target.type}
              </span>
            </p>
          </div>
          <CloseBtn onClick={onClose} />
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

          {/* Own players */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Your players</p>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter by name…"
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-700 w-44"
              />
            </div>

            {filteredOwn.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">
                {search ? 'No players match that name.' : 'No players in your roster yet.'}
              </p>
            ) : (
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-4 py-2.5 w-8">
                        <input type="checkbox" className="rounded"
                          checked={filteredOwn.length > 0 && filteredOwn.every(p => selected.has(p.id))}
                          onChange={() => {
                            const allIn = filteredOwn.every(p => selected.has(p.id))
                            setSelected(prev => {
                              const n = new Set(prev)
                              filteredOwn.forEach(p => allIn ? n.delete(p.id) : n.add(p.id))
                              return n
                            })
                          }}
                        />
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">Name</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5 hidden sm:table-cell">DOB</th>
                      <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">Consent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOwn.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => toggle(p.id)}>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <input type="checkbox" className="rounded"
                            checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{p.full_name}</td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{fmt(p.date_of_birth)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${CONSENT_STYLES[p.consent_status]}`}>
                            {CONSENT_LABELS[p.consent_status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Cross-county section — county union only */}
          {isCountyUnion && (
            <div>
              <button
                type="button"
                onClick={() => setShowCross(v => !v)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide w-full text-left"
                style={{ color: '#155230' }}
              >
                <svg
                  className="w-4 h-4 transition-transform"
                  style={{ transform: showCross ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Search linked clubs
              </button>

              {showCross && (
                <div className="mt-3 space-y-3">
                  <form onSubmit={handleCrossSearch} className="flex gap-2">
                    <input
                      type="search"
                      value={crossSearch}
                      onChange={e => setCrossSearch(e.target.value)}
                      placeholder="Player or club name…"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                    />
                    <button type="submit" disabled={crossSearching}
                      className="px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all"
                      style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
                      {crossSearching ? '…' : 'Search'}
                    </button>
                  </form>

                  {crossError && (
                    <p className="text-sm text-red-600">{crossError}</p>
                  )}

                  {crossResults.length > 0 && (
                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="px-4 py-2.5 w-8">
                              <input type="checkbox" className="rounded"
                                checked={crossResults.every(p => selected.has(p.id))}
                                onChange={() => {
                                  const allIn = crossResults.every(p => selected.has(p.id))
                                  setSelected(prev => {
                                    const n = new Set(prev)
                                    crossResults.forEach(p => allIn ? n.delete(p.id) : n.add(p.id))
                                    return n
                                  })
                                }}
                              />
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">Name</th>
                            <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">Club</th>
                            <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5 hidden sm:table-cell">DOB</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {crossResults.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => toggle(p.id)}>
                              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                <input type="checkbox" className="rounded"
                                  checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-900">{p.full_name}</td>
                              <td className="px-4 py-3 text-gray-500">{p.club_name || '—'}</td>
                              <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{fmt(p.date_of_birth)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {crossResults.length === 0 && !crossSearching && crossSearch && !crossError && (
                    <p className="text-sm text-gray-400 text-center py-3">
                      No consented players found for &ldquo;{crossSearch}&rdquo;.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            {selected.size > 0
              ? <span className="font-semibold" style={{ color: '#155230' }}>{selected.size} selected</span>
              : 'Select players above'}
            {msg && (
              <span className="ml-3 font-medium" style={{ color: msg.startsWith('Error') ? '#dc2626' : '#155230' }}>
                {msg}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
              Close
            </button>
            <button onClick={handleAdd} disabled={selected.size === 0 || adding}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
              {adding ? 'Adding…' : `Add ${selected.size > 0 ? selected.size : ''} player${selected.size !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────

export default function DashboardPage() {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [county, setCounty] = useState<County | null>(null)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

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

  // ── Trips ──
  const [trips, setTrips] = useState<Trip[]>([])
  const [tripsLoading, setTripsLoading] = useState(false)
  const [showCreateTrip, setShowCreateTrip] = useState(false)
  const [tripForm, setTripForm] = useState({ name: '', eventDate: '', description: '' })
  const [creatingTrip, setCreatingTrip] = useState(false)
  const [createTripError, setCreateTripError] = useState('')

  // ── Squads ──
  const [squads, setSquads] = useState<Squad[]>([])
  const [squadsLoading, setSquadsLoading] = useState(false)
  const [showCreateSquad, setShowCreateSquad] = useState(false)
  const [squadForm, setSquadForm] = useState({ name: '', description: '' })
  const [creatingSquad, setCreatingSquad] = useState(false)
  const [createSquadError, setCreateSquadError] = useState('')

  // ── Shared player selector ──
  const [selectorTarget, setSelectorTarget] = useState<SelectorTarget | null>(null)

  // ── Fetchers ──────────────────────────────────────────────

  const fetchPlayers = useCallback(async (t: string) => {
    setPlayersLoading(true)
    try {
      const res = await fetch('/api/dashboard/players', { headers: { Authorization: `Bearer ${t}` } })
      const data = await res.json()
      setPlayers(data.players || [])
    } finally { setPlayersLoading(false) }
  }, [])

  const fetchTrips = useCallback(async (t: string) => {
    setTripsLoading(true)
    try {
      const res = await fetch('/api/dashboard/trips', { headers: { Authorization: `Bearer ${t}` } })
      const data = await res.json()
      setTrips(data.trips || [])
    } finally { setTripsLoading(false) }
  }, [])

  const fetchSquads = useCallback(async (t: string) => {
    setSquadsLoading(true)
    try {
      const res = await fetch('/api/dashboard/squads', { headers: { Authorization: `Bearer ${t}` } })
      const data = await res.json()
      setSquads(data.squads || [])
    } finally { setSquadsLoading(false) }
  }, [])

  const fetchCounty = useCallback(async (t: string) => {
    const res = await fetch('/api/dashboard/me', { headers: { Authorization: `Bearer ${t}` } })
    if (!res.ok) return false
    const data = await res.json()
    setCounty(data.county)
    return true
  }, [])

  // ── Auth bootstrap ────────────────────────────────────────

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.access_token) {
        const t = session.access_token
        setToken(t)
        const ok = await fetchCounty(t)
        if (ok) {
          setAuthState('authorized')
          fetchPlayers(t); fetchTrips(t); fetchSquads(t)
        } else {
          setAuthState('unauthenticated')
        }
      } else {
        setAuthState('unauthenticated')
      }
    })
  }, [fetchCounty, fetchPlayers, fetchTrips, fetchSquads])

  // ── Handlers ──────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
    setLoggingIn(false)
    if (error) { setLoginError(error.message); return }
    const t = data.session?.access_token
    if (!t) { setLoginError('Login failed.'); return }
    setToken(t)
    const ok = await fetchCounty(t)
    if (!ok) { setLoginError('No county account found for this email.'); return }
    setAuthState('authorized')
    fetchPlayers(t); fetchTrips(t); fetchSquads(t)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAuthState('unauthenticated')
    setToken(null); setCounty(null)
    setPlayers([]); setTrips([]); setSquads([])
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
    } finally { setAddingPlayer(false) }
  }

  const handleConsentChange = async (playerId: string, newStatus: string) => {
    await fetch('/api/dashboard/players', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ playerId, consentStatus: newStatus }),
    })
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, consent_status: newStatus as Player['consent_status'] } : p))
  }

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateTripError('')
    setCreatingTrip(true)
    try {
      const res = await fetch('/api/dashboard/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(tripForm),
      })
      const data = await res.json()
      if (!res.ok) { setCreateTripError(data.error || 'Failed to create trip.'); return }
      setShowCreateTrip(false)
      setTripForm({ name: '', eventDate: '', description: '' })
      if (token) fetchTrips(token)
    } finally { setCreatingTrip(false) }
  }

  const handleCreateSquad = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateSquadError('')
    setCreatingSquad(true)
    try {
      const res = await fetch('/api/dashboard/squads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(squadForm),
      })
      const data = await res.json()
      if (!res.ok) { setCreateSquadError(data.error || 'Failed to create squad.'); return }
      setShowCreateSquad(false)
      setSquadForm({ name: '', description: '' })
      if (token) fetchSquads(token)
    } finally { setCreatingSquad(false) }
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
            <Link href="/" className="inline-block mb-4">
              <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
                <svg style={{ width: '22px', height: '22px' }} fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </Link>
            <h1 className="text-2xl font-black text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-500 mt-1">CountyConsent dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
            {loginError && <div className="rounded-xl p-3 text-sm text-red-700 bg-red-50">{loginError}</div>}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" required value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input type="password" required value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)} className={inputClass} />
            </div>
            <button type="submit" disabled={loggingIn}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
              {loggingIn ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: '#155230' }}>Sign up</Link>
          </p>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ─────────────────────────────────────────────

  const isCountyUnion = county?.account_type === 'county_union'

  const tabs: { id: Tab; label: string }[] = [
    { id: 'players', label: 'Players' },
    { id: 'trips',   label: 'Trips' },
    { id: 'squads',  label: 'Squads' },
    ...(isCountyUnion ? [{ id: 'search' as Tab, label: 'Search all clubs' }] : []),
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f7f5ee' }}>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm hidden sm:block">CountyConsent</span>
            </Link>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{ background: '#edf7f2', borderColor: '#a7d9bc', color: '#155230' }}>
              {isCountyUnion ? 'County Union' : 'Golf Club'}
            </span>
            {county && (
              <span className="text-sm font-semibold text-gray-900 hidden md:block">
                {county.county_union_name}
              </span>
            )}
          </div>
          <button onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Affiliation banner for golf clubs */}
        {!isCountyUnion && county?.parent_county_name && (
          <div className="mb-6 px-5 py-3.5 rounded-xl border text-sm flex items-center gap-2"
            style={{ background: '#edf7f2', borderColor: '#a7d9bc', color: '#155230' }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Affiliated to <strong className="mx-1">{county.parent_county_name}</strong>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 w-fit flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={tab === t.id
                ? { background: 'linear-gradient(135deg,#155230,#1a6b3e)', color: '#fff' }
                : { color: '#6b7280' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PLAYERS TAB ── */}
        {tab === 'players' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-black text-gray-900">Players</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {players.length} player{players.length !== 1 ? 's' : ''} · {players.filter(p => p.consent_status === 'consent_received').length} with consent
                </p>
              </div>
              <button onClick={() => setShowAddPlayer(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
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
                <div className="text-center py-20 text-gray-400 text-sm">No players yet. Add your first player above.</div>
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
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full border appearance-none cursor-pointer ${CONSENT_STYLES[p.consent_status]}`}>
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

        {/* ── TRIPS TAB ── */}
        {tab === 'trips' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-black text-gray-900">Trips</h2>
                <p className="text-sm text-gray-500 mt-0.5">{trips.length} trip{trips.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setShowCreateTrip(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create trip
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {tripsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-green-700 rounded-full animate-spin" />
                </div>
              ) : trips.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-sm">No trips yet. Create your first trip above.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Trip name', 'Date', 'Description', 'Players', ''].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {trips.map(trip => (
                        <tr key={trip.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{trip.name}</td>
                          <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(trip.event_date)}</td>
                          <td className="px-5 py-4 text-gray-600 max-w-xs truncate">{trip.description || '—'}</td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                              style={{ background: '#edf7f2', borderColor: '#a7d9bc', color: '#155230' }}>
                              {trip.player_count} player{trip.player_count !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => setSelectorTarget({ type: 'trip', id: trip.id, name: trip.name })}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
                              style={{ borderColor: '#a7d9bc', color: '#155230' }}>
                              Add players
                            </button>
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

        {/* ── SQUADS TAB ── */}
        {tab === 'squads' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-black text-gray-900">Squads</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Named player groups for the season — no date required
                </p>
              </div>
              <button onClick={() => setShowCreateSquad(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create squad
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {squadsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-green-700 rounded-full animate-spin" />
                </div>
              ) : squads.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-sm">No squads yet. Create your first squad above.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Squad name', 'Description', 'Players', ''].map(h => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {squads.map(squad => (
                        <tr key={squad.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{squad.name}</td>
                          <td className="px-5 py-4 text-gray-600 max-w-xs truncate">{squad.description || '—'}</td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                              style={{ background: '#edf7f2', borderColor: '#a7d9bc', color: '#155230' }}>
                              {squad.player_count} player{squad.player_count !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => setSelectorTarget({ type: 'squad', id: squad.id, name: squad.name })}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
                              style={{ borderColor: '#a7d9bc', color: '#155230' }}>
                              Add players
                            </button>
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

        {/* ── SEARCH TAB (county union only) ── */}
        {tab === 'search' && isCountyUnion && (
          <SearchAllClubs
            token={token!}
            trips={trips}
            squads={squads}
            onRefreshTrips={() => token && fetchTrips(token)}
            onRefreshSquads={() => token && fetchSquads(token)}
          />
        )}
      </div>

      {/* ── Shared player selector modal ── */}
      {selectorTarget && county && token && (
        <PlayerSelector
          target={selectorTarget}
          token={token}
          county={county}
          ownPlayers={players}
          onClose={() => setSelectorTarget(null)}
          onAdded={() => {
            if (selectorTarget.type === 'trip' && token) fetchTrips(token)
            if (selectorTarget.type === 'squad' && token) fetchSquads(token)
          }}
        />
      )}

      {/* ── Add player modal ── */}
      {showAddPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900 text-lg">Add player</h2>
              <CloseBtn onClick={() => setShowAddPlayer(false)} />
            </div>
            <form onSubmit={handleAddPlayer} className="p-6 space-y-4">
              {addPlayerError && <div className="rounded-xl p-3 text-sm text-red-700 bg-red-50">{addPlayerError}</div>}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name *</label>
                <input required type="text" placeholder="e.g. Jamie Thompson"
                  value={addPlayerForm.fullName}
                  onChange={e => setAddPlayerForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of birth</label>
                <input type="date" value={addPlayerForm.dateOfBirth}
                  onChange={e => setAddPlayerForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parent / guardian name</label>
                <input type="text" placeholder="e.g. Sarah Thompson"
                  value={addPlayerForm.parentName}
                  onChange={e => setAddPlayerForm(prev => ({ ...prev, parentName: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Parent / guardian email</label>
                <input type="email" placeholder="sarah@example.com"
                  value={addPlayerForm.parentEmail}
                  onChange={e => setAddPlayerForm(prev => ({ ...prev, parentEmail: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consent status</label>
                <select value={addPlayerForm.consentStatus}
                  onChange={e => setAddPlayerForm(prev => ({ ...prev, consentStatus: e.target.value }))}
                  className={inputClass}>
                  {Object.entries(CONSENT_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddPlayer(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={addingPlayer}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all"
                  style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
                  {addingPlayer ? 'Adding…' : 'Add player'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create trip modal ── */}
      {showCreateTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900 text-lg">Create trip</h2>
              <CloseBtn onClick={() => setShowCreateTrip(false)} />
            </div>
            <form onSubmit={handleCreateTrip} className="p-6 space-y-4">
              {createTripError && <div className="rounded-xl p-3 text-sm text-red-700 bg-red-50">{createTripError}</div>}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trip name *</label>
                <input required type="text" placeholder="e.g. County Junior Tour 2025"
                  value={tripForm.name}
                  onChange={e => setTripForm(prev => ({ ...prev, name: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                <input type="date" value={tripForm.eventDate}
                  onChange={e => setTripForm(prev => ({ ...prev, eventDate: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <input type="text" placeholder="Optional notes"
                  value={tripForm.description}
                  onChange={e => setTripForm(prev => ({ ...prev, description: e.target.value }))}
                  className={inputClass} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateTrip(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creatingTrip}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all"
                  style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
                  {creatingTrip ? 'Creating…' : 'Create trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create squad modal ── */}
      {showCreateSquad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900 text-lg">Create squad</h2>
              <CloseBtn onClick={() => setShowCreateSquad(false)} />
            </div>
            <form onSubmit={handleCreateSquad} className="p-6 space-y-4">
              {createSquadError && <div className="rounded-xl p-3 text-sm text-red-700 bg-red-50">{createSquadError}</div>}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Squad name *</label>
                <input required type="text" placeholder="e.g. U18 County Squad 2025"
                  value={squadForm.name}
                  onChange={e => setSquadForm(prev => ({ ...prev, name: e.target.value }))}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <input type="text" placeholder="Optional notes about this squad"
                  value={squadForm.description}
                  onChange={e => setSquadForm(prev => ({ ...prev, description: e.target.value }))}
                  className={inputClass} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateSquad(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creatingSquad}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all"
                  style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
                  {creatingSquad ? 'Creating…' : 'Create squad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Search All Clubs (county union only) ──────────────────────
// Extracted to keep the main component manageable.

type SearchAllClubsProps = {
  token: string
  trips: Trip[]
  squads: Squad[]
  onRefreshTrips: () => void
  onRefreshSquads: () => void
}

function SearchAllClubs({ token, trips, squads, onRefreshTrips, onRefreshSquads }: SearchAllClubsProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Player[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const [targetType, setTargetType] = useState<'trip' | 'squad'>('trip')
  const [targetId, setTargetId] = useState('')
  const [adding, setAdding] = useState(false)
  const [addMsg, setAddMsg] = useState('')

  const toggle = (id: string) =>
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearchError(''); setResults([]); setSelected(new Set()); setAddMsg('')
    setSearching(true)
    try {
      const res = await fetch(`/api/dashboard/players/search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) { setSearchError(data.error || 'Search failed.'); return }
      setResults(data.players || [])
    } finally { setSearching(false) }
  }

  const handleAdd = async () => {
    if (!targetId || selected.size === 0) return
    setAdding(true); setAddMsg('')
    const url = targetType === 'trip'
      ? `/api/dashboard/trips/${targetId}/players`
      : `/api/dashboard/squads/${targetId}/players`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ playerIds: [...selected] }),
      })
      const data = await res.json()
      if (!res.ok) { setAddMsg(`Error: ${data.error}`); return }
      setAddMsg(`${data.added} player${data.added !== 1 ? 's' : ''} added.`)
      setSelected(new Set())
      if (targetType === 'trip') onRefreshTrips()
      else onRefreshSquads()
    } finally { setAdding(false) }
  }

  const targetList = targetType === 'trip' ? trips : squads

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-black text-gray-900">Search all clubs</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Find consented players across all golf clubs linked to your county union.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input type="search" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search by player name or club name…"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
        <button type="submit" disabled={searching}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all"
          style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {searchError && (
        <div className="rounded-xl p-4 text-sm font-medium mb-4" style={{ background: '#fef2f2', color: '#dc2626' }}>
          {searchError}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              {results.length} consented player{results.length !== 1 ? 's' : ''} found
            </span>
            {selected.size > 0 && (
              <span className="text-xs text-gray-500">{selected.size} selected</span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3.5 w-10">
                    <input type="checkbox" className="rounded"
                      checked={selected.size === results.length}
                      onChange={() => selected.size === results.length
                        ? setSelected(new Set())
                        : setSelected(new Set(results.map(p => p.id)))} />
                  </th>
                  {['Player name', 'Club', 'Date of birth', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {results.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => toggle(p.id)}>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded"
                        checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{p.full_name}</td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{p.club_name || '—'}</td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(p.date_of_birth)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CONSENT_STYLES[p.consent_status]}`}>
                        {CONSENT_LABELS[p.consent_status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {results.length === 0 && !searching && query && !searchError && (
        <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100 shadow-sm">
          No consented players found for &ldquo;{query}&rdquo;.
        </div>
      )}

      {/* Add selected to trip or squad */}
      {selected.size > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Add {selected.size} selected player{selected.size !== 1 ? 's' : ''} to…
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Trip or squad toggle */}
            <div className="flex gap-1 p-1 rounded-xl border border-gray-200 bg-gray-50 w-fit">
              {(['trip', 'squad'] as const).map(t => (
                <button key={t} type="button"
                  onClick={() => { setTargetType(t); setTargetId('') }}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all"
                  style={targetType === t
                    ? { background: 'linear-gradient(135deg,#155230,#1a6b3e)', color: '#fff' }
                    : { color: '#6b7280' }}>
                  {t}
                </button>
              ))}
            </div>
            <select value={targetId} onChange={e => setTargetId(e.target.value)}
              className="flex-1 sm:w-56 px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700">
              <option value="">Select {targetType}…</option>
              {targetList.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <button onClick={handleAdd} disabled={!targetId || adding}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#155230,#1a6b3e)' }}>
              {adding ? 'Adding…' : `Add to ${targetType}`}
            </button>
          </div>
          {addMsg && (
            <p className="text-sm mt-3 font-medium"
              style={{ color: addMsg.startsWith('Error') ? '#dc2626' : '#155230' }}>
              {addMsg}
            </p>
          )}
          {targetList.length === 0 && (
            <p className="text-sm text-amber-700 mt-3">
              No {targetType}s yet — create one in the {targetType === 'trip' ? 'Trips' : 'Squads'} tab first.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
