'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const GOVERNING_BODIES = ['England Golf', 'Scotland Golf', 'Wales Golf', 'Golf Ireland']
const PLANS = ['monthly', 'annual', 'pilot']

type County = {
  id: string
  county_union_name: string
  governing_body: string
  secretary_name: string
  email: string
  phone: string
  plan: string
  subscription_status: string
  created_at: string
  last_login: string | null
  stripe_customer_id: string | null
}

type AuthState = 'loading' | 'unauthenticated' | 'unauthorized' | 'authorized'

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-100',
  trialing: 'bg-blue-50 text-blue-700 border-blue-100',
  pilot: 'bg-purple-50 text-purple-700 border-purple-100',
  pending_payment: 'bg-amber-50 text-amber-700 border-amber-100',
  suspended: 'bg-gray-100 text-gray-600 border-gray-200',
  cancelled: 'bg-red-50 text-red-700 border-red-100',
}

function fmt(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminPage() {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [token, setToken] = useState<string | null>(null)
  const [counties, setCounties] = useState<County[]>([])
  const [search, setSearch] = useState('')
  const [dataLoading, setDataLoading] = useState(false)

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // Create modal
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({
    countyUnionName: '', governingBody: '', secretaryName: '',
    email: '', phone: '', plan: 'pilot', password: '',
  })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<County | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchCounties = useCallback(async (accessToken: string) => {
    setDataLoading(true)
    try {
      const res = await fetch('/api/admin/counties', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (res.status === 401) { setAuthState('unauthorized'); return }
      const data = await res.json()
      setCounties(data.counties || [])
      setAuthState('authorized')
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setToken(session.access_token)
        fetchCounties(session.access_token)
      } else {
        setAuthState('unauthenticated')
      }
    })
  }, [fetchCounties])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
    setLoggingIn(false)
    if (error) { setLoginError(error.message); return }
    const accessToken = data.session?.access_token
    if (accessToken) { setToken(accessToken); fetchCounties(accessToken) }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setAuthState('unauthenticated')
    setToken(null)
    setCounties([])
  }

  const handleSuspend = async (county: County) => {
    const newStatus = county.subscription_status === 'suspended' ? 'active' : 'suspended'
    await fetch(`/api/admin/counties/${county.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ subscription_status: newStatus }),
    })
    setCounties(prev => prev.map(c => c.id === county.id ? { ...c, subscription_status: newStatus } : c))
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await fetch(`/api/admin/counties/${deleteTarget.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setCounties(prev => prev.filter(c => c.id !== deleteTarget.id))
    setDeleteTarget(null)
    setDeleting(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    const res = await fetch('/api/admin/counties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(createForm),
    })
    const data = await res.json()
    setCreating(false)
    if (!res.ok) { setCreateError(data.error || 'Failed to create account.'); return }
    setShowCreate(false)
    setCreateForm({ countyUnionName: '', governingBody: '', secretaryName: '', email: '', phone: '', plan: 'pilot', password: '' })
    if (token) fetchCounties(token)
  }

  const filtered = counties.filter(c =>
    [c.county_union_name, c.governing_body, c.secretary_name, c.email].some(
      v => v.toLowerCase().includes(search.toLowerCase())
    )
  )

  const stats = {
    total: counties.length,
    active: counties.filter(c => ['active', 'trialing', 'pilot'].includes(c.subscription_status)).length,
    pending: counties.filter(c => c.subscription_status === 'pending_payment').length,
    suspended: counties.filter(c => ['suspended', 'cancelled'].includes(c.subscription_status)).length,
  }

  // ── LOADING ──────────────────────────────────────────────
  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:'#f7f5ee'}}>
        <div className="w-8 h-8 border-2 border-gray-300 border-t-green-700 rounded-full animate-spin" />
      </div>
    )
  }

  // ── LOGIN ─────────────────────────────────────────────────
  if (authState === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{background:'#f7f5ee'}}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{background:'linear-gradient(135deg,#155230,#1a6b3e)'}}>
              <svg style={{width:'20px',height:'20px'}} fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-1">CountyConsent super admin</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-4">
            {loginError && <div className="rounded-xl p-3 text-sm text-red-700 bg-red-50">{loginError}</div>}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <button type="submit" disabled={loggingIn}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{background:'linear-gradient(135deg,#155230,#1a6b3e)'}}>
              {loggingIn ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── UNAUTHORIZED ──────────────────────────────────────────
  if (authState === 'unauthorized') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{background:'#f7f5ee'}}>
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900 mb-2">Access denied</p>
          <p className="text-gray-500 text-sm mb-6">Your account does not have super admin access.</p>
          <button onClick={handleLogout} className="text-sm font-semibold underline" style={{color:'#155230'}}>
            Sign out
          </button>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ─────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{background:'#f7f5ee'}}>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{background:'linear-gradient(135deg,#155230,#1a6b3e)'}}>
              <svg style={{width:'16px',height:'16px'}} fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900">CountyConsent</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{background:'#edf7f2',borderColor:'#a7d9bc',color:'#155230'}}>
              Super Admin
            </span>
          </div>
          <button onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total accounts', value: stats.total },
            { label: 'Active / trialing', value: stats.active },
            { label: 'Pending payment', value: stats.pending },
            { label: 'Suspended / cancelled', value: stats.suspended },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-3xl font-black text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            placeholder="Search by name, email or governing body…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
          />
          <button onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{background:'linear-gradient(135deg,#155230,#1a6b3e)'}}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create account
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {dataLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-green-700 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">
              {search ? 'No accounts match your search.' : 'No county accounts yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['County', 'Governing body', 'Secretary', 'Email', 'Plan', 'Status', 'Signed up', 'Last login', ''].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(county => (
                    <tr key={county.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{county.county_union_name}</td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{county.governing_body}</td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{county.secretary_name}</td>
                      <td className="px-5 py-4 text-gray-600">{county.email}</td>
                      <td className="px-5 py-4">
                        <span className="capitalize text-gray-700 font-medium">{county.plan}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[county.subscription_status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {county.subscription_status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(county.created_at)}</td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{fmt(county.last_login)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSuspend(county)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
                            style={{borderColor:'#d1d5db',color:'#374151'}}>
                            {county.subscription_status === 'suspended' ? 'Reactivate' : 'Suspend'}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(county)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-100 text-red-600 transition-colors hover:bg-red-50">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create county modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900 text-lg">Create county account</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {createError && <div className="rounded-xl p-3 text-sm text-red-700 bg-red-50">{createError}</div>}
              {[
                { label: 'County union name', name: 'countyUnionName', type: 'text', placeholder: 'e.g. Durham County Golf Union' },
                { label: 'Secretary full name', name: 'secretaryName', type: 'text', placeholder: 'e.g. Jane Smith' },
                { label: 'Email address', name: 'email', type: 'email', placeholder: 'jane@durhamgolf.org' },
                { label: 'Phone number', name: 'phone', type: 'tel', placeholder: '07700 900000' },
                { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 8 characters' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <input type={type} required placeholder={placeholder} minLength={name === 'password' ? 8 : undefined}
                    value={createForm[name as keyof typeof createForm]}
                    onChange={e => setCreateForm(prev => ({ ...prev, [name]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Governing body</label>
                <select required value={createForm.governingBody}
                  onChange={e => setCreateForm(prev => ({ ...prev, governingBody: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700">
                  <option value="">Select governing body</option>
                  {GOVERNING_BODIES.map(gb => <option key={gb} value={gb}>{gb}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Plan</label>
                <select value={createForm.plan}
                  onChange={e => setCreateForm(prev => ({ ...prev, plan: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700">
                  {PLANS.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{background:'linear-gradient(135deg,#155230,#1a6b3e)'}}>
                  {creating ? 'Creating…' : 'Create account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-black text-gray-900 text-lg mb-2">Delete account?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This will permanently delete <strong>{deleteTarget.county_union_name}</strong> and remove their Supabase Auth user. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
