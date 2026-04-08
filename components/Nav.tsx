'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-17 flex items-center justify-between" style={{height:'68px'}}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#155230,#228450)'}}>
            <svg className="w-4.5 h-4.5 text-white" style={{width:'18px',height:'18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-gray-900 text-base leading-none tracking-tight">CountyConsent</span>
            <span className="hidden sm:block text-xs text-gray-400 leading-none mt-0.5">Junior Golf Safeguarding</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['Features','How it works','Pricing','FAQ'].map((label) => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g,'-')}`}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/pricing" className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
            style={{background:'linear-gradient(135deg,#155230,#1a6b3e)'}}>
            Get started
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4 shadow-lg">
          {['Features','How it works','Pricing','FAQ'].map((label) => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g,'-')}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700">{label}</a>
          ))}
          <Link href="/pricing" onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{background:'linear-gradient(135deg,#155230,#1a6b3e)'}}>
            Get started
          </Link>
        </div>
      )}
    </header>
  )
}
