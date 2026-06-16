'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

/**
 * Shared layout for the public /legal hub on the marketing site.
 *
 * Each /legal/* page is a server component that reads its markdown source from
 * app/legal/_content/*.md at build time and passes it here as a raw string with
 * a human title. This renders the sidebar navigation plus a self-contained
 * markdown renderer (no external dependency) covering the subset used by the
 * legal documents: h1/h2/h3, paragraphs, pipe tables, bullet lists, bold,
 * italic and links.
 *
 * Brand green: #216048.
 */

const BRAND = '#216048'

const NAV: { href: string; label: string }[] = [
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/cookies', label: 'Cookie Policy' },
  { href: '/legal/terms', label: 'Terms of Service' },
  { href: '/legal/dpa', label: 'Data Processing Agreement' },
]

// Cross-links inside the documents (e.g. "/cookies", "/dpa") resolve to the
// hub routes. Internal links use next/link; everything else is a plain <a>.
function resolveHref(href: string): { href: string; internal: boolean } {
  const m = href.match(/^\/(privacy|cookies|terms|dpa)$/)
  if (m) return { href: `/legal/${m[1]}`, internal: true }
  if (href.startsWith('/')) return { href, internal: true }
  return { href, internal: false }
}

// ---- inline rendering: bold, italic, links --------------------------------
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\))/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[2] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold" style={{ color: '#0f1a10' }}>
          {m[2]}
        </strong>
      )
    } else if (m[3] !== undefined) {
      nodes.push(<em key={`${keyPrefix}-i${i}`}>{m[3]}</em>)
    } else if (m[4] !== undefined && m[5] !== undefined) {
      const { href, internal } = resolveHref(m[5])
      nodes.push(
        internal ? (
          <Link
            key={`${keyPrefix}-l${i}`}
            href={href}
            className="font-medium underline underline-offset-2"
            style={{ color: BRAND }}
          >
            {m[4]}
          </Link>
        ) : (
          <a
            key={`${keyPrefix}-l${i}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-2"
            style={{ color: BRAND }}
          >
            {m[4]}
          </a>
        )
      )
    }
    last = regex.lastIndex
    i++
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function splitRow(line: string): string[] {
  let s = line.trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|')) s = s.slice(0, -1)
  return s.split('|').map((c) => c.trim())
}

// ---- block rendering ------------------------------------------------------
function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const blocks: React.ReactNode[] = []
  let i = 0
  let key = 0

  const isTableSep = (l: string) => /^\s*\|?[\s:-]*-[\s:|-]*\|?\s*$/.test(l) && l.includes('-')

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    // headings
    const h = line.match(/^(#{1,3})\s+(.*)$/)
    if (h) {
      const level = h[1].length
      const content = renderInline(h[2].trim(), `h${key}`)
      if (level === 1) {
        blocks.push(
          <h1 key={key++} className="text-3xl md:text-4xl font-bold tracking-tight mb-6" style={{ color: BRAND }}>
            {content}
          </h1>
        )
      } else if (level === 2) {
        blocks.push(
          <h2
            key={key++}
            className="text-xl font-semibold mt-10 mb-3 pb-2 border-b"
            style={{ color: '#0f1a10', borderColor: '#e5e7eb' }}
          >
            {content}
          </h2>
        )
      } else {
        blocks.push(
          <h3 key={key++} className="text-lg font-semibold mt-6 mb-2" style={{ color: '#0f1a10' }}>
            {content}
          </h3>
        )
      }
      i++
      continue
    }

    // table
    if (line.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const header = splitRow(line)
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        rows.push(splitRow(lines[i]))
        i++
      }
      blocks.push(
        <div key={key++} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {header.map((cell, c) => (
                  <th
                    key={c}
                    className="border px-3 py-2 text-left font-semibold align-top"
                    style={{ borderColor: '#e5e7eb', background: '#f7f5ee', color: '#0f1a10' }}
                  >
                    {renderInline(cell, `th${key}-${c}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className="border px-3 py-2 align-top"
                      style={{ borderColor: '#e5e7eb', color: '#374151' }}
                    >
                      {renderInline(cell, `td${key}-${r}-${c}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // bullet list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
        i++
      }
      blocks.push(
        <ul key={key++} className="my-4 list-disc space-y-2 pl-6 leading-relaxed" style={{ color: '#374151' }}>
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `li${key}-${idx}`)}</li>
          ))}
        </ul>
      )
      continue
    }

    // paragraph
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !(lines[i].includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1]))
    ) {
      para.push(lines[i].trim())
      i++
    }
    blocks.push(
      <p key={key++} className="my-4 leading-relaxed" style={{ color: '#374151' }}>
        {renderInline(para.join(' '), `p${key}`)}
      </p>
    )
  }

  return blocks
}

export default function LegalLayout({ title, content }: { title: string; content: string }) {
  const pathname = usePathname()
  const rendered = React.useMemo(() => renderMarkdown(content), [content])

  return (
    <main className="flex-1" style={{ background: '#ffffff' }}>
      {/* Top bar */}
      <header className="border-b" style={{ background: BRAND, borderColor: 'rgba(0,0,0,0.05)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-white">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <svg className="text-white" style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-base">CountyConsent</span>
          </Link>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Legal{title ? ` / ${title}` : ''}
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14 md:grid md:grid-cols-[240px_1fr] md:gap-12">
        {/* Sidebar nav */}
        <nav aria-label="Legal documents" className="mb-8 md:mb-0">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ color: '#9ca3af' }}>
            Legal
          </p>
          <ul className="flex flex-col gap-1 md:sticky md:top-8">
            {NAV.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className="block whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors"
                    style={
                      active
                        ? { background: BRAND, color: 'white', fontWeight: 600 }
                        : { color: '#4b5563' }
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Document */}
        <article className="min-w-0 max-w-3xl">{rendered}</article>
      </div>
    </main>
  )
}
