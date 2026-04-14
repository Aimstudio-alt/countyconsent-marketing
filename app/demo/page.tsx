"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

type Golfer = {
  id: number;
  first_name: string;
  last_name: string;
  dob: string;
  parent_email: string;
  consented: boolean;
  medical: string | null;
};

// ── Demo data ─────────────────────────────────────────────────────────────────

const BASE_GOLFERS: Golfer[] = [
  { id: 1, first_name: "James",  last_name: "Taylor",  dob: "12 Mar 2011", parent_email: "r.taylor@email.com",   consented: false, medical: "Asthma — uses Salbutamol (Ventolin) 100mcg inhaler. Self-administers. Use 15 min before exercise. Spare inhaler in golf bag at all times." },
  { id: 2, first_name: "Sophie", last_name: "Davis",   dob: "24 Aug 2010", parent_email: "m.davis@email.com",    consented: false, medical: null },
  { id: 3, first_name: "Liam",   last_name: "Parker",  dob: "05 Nov 2009", parent_email: "j.parker@email.com",   consented: true,  medical: null },
  { id: 4, first_name: "Olivia", last_name: "Brown",   dob: "18 Jan 2011", parent_email: "c.brown@email.com",    consented: true,  medical: null },
  { id: 5, first_name: "Noah",   last_name: "Wilson",  dob: "30 Jun 2010", parent_email: "a.wilson@email.com",   consented: true,  medical: null },
  { id: 6, first_name: "Emma",   last_name: "Collins", dob: "14 Sep 2009", parent_email: "p.collins@email.com",  consented: true,  medical: null },
];

const SCREENS = [
  { id: 1, label: "Dashboard" },
  { id: 2, label: "Team Managers" },
  { id: 3, label: "Create Trip" },
  { id: 4, label: "Trip Created" },
  { id: 5, label: "Trip Detail" },
  { id: 6, label: "Select from Register" },
  { id: 7, label: "Email Sent" },
  { id: 8, label: "Golfer Detail" },
  { id: 9, label: "Medical Summary" },
];

const REGISTER_GOLFERS = [
  { id: 10, first_name: "Callum", last_name: "Fraser",   dob: "22 May 2012", parent_email: "d.fraser@email.com" },
  { id: 11, first_name: "Isla",   last_name: "McKenzie", dob: "09 Oct 2011", parent_email: "f.mckenzie@email.com" },
  { id: 12, first_name: "Rhys",   last_name: "Owen",     dob: "17 Mar 2013", parent_email: "s.owen@email.com" },
];

const SCREEN_HINTS: Record<number, string> = {
  1: 'Click "Invite your first team manager" below to begin. Each step will guide you through the full setup.',
  2: 'This is where you manage your team. Click "Next: create a trip" at the bottom when you\'re ready to continue.',
  3: 'Fill in the trip details below, then click "Create trip" to set it up.',
  4: 'Trip created! Taking you to the trip view\u2026',
  5: 'Explore the trip. Click "Add golfer" to pull someone from your register, or send a consent email to a pending golfer.',
  6: 'Select a junior from your county register and click "Add to trip" to add them.',
  7: 'The consent email is on its way. The parent gets a unique secure link to complete the form online.',
  8: "This is the golfer's full record — medical details, emergency contacts, and consent status at a glance.",
  9: 'The medical summary is printable for the day of travel — all alerts and contacts in one place.',
};

// ── Shared sub-components ─────────────────────────────────────────────────────

function DonutRing({ pct }: { pct: number }) {
  const r = 17;
  const circ = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(100, pct) / 100) * circ;
  const stroke = pct === 100 ? "#16a34a" : pct >= 50 ? "#f59e0b" : pct > 0 ? "#ef4444" : "#e2e8f0";
  return (
    <div className="relative w-11 h-11 flex-shrink-0">
      <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="22" cy="22" r={r} fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
        {pct > 0 && (
          <circle cx="22" cy="22" r={r} fill="none" stroke={stroke} strokeWidth="4.5"
            strokeDasharray={`${filled} ${circ - filled}`} strokeLinecap="round" />
        )}
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-700 leading-none">
        {pct}%
      </span>
    </div>
  );
}

function ConsentBadge({ consented }: { consented: boolean }) {
  if (consented) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}>
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        Received
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
      Pending
    </span>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  const styles: Record<string, { icon: string; value: string }> = {
    green:   { icon: "bg-green-100 text-green-700",   value: "text-green-700" },
    blue:    { icon: "bg-blue-100 text-blue-700",     value: "text-blue-700" },
    emerald: { icon: "bg-emerald-100 text-emerald-700", value: "text-emerald-700" },
    red:     { icon: "bg-red-100 text-red-700",       value: "text-red-700" },
  };
  const s = styles[color];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.icon}`}>{icon}</div>
      <div className={`text-3xl font-black tracking-tight ${s.value}`}>{value}</div>
      <div className="text-slate-500 text-xs font-semibold mt-1 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-6">
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-1.5">
          {i > 0 && <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
          <span className={i === items.length - 1 ? "font-semibold text-slate-900" : ""}>{item}</span>
        </span>
      ))}
    </div>
  );
}

/** Wraps a clickable element with a prominent bouncing callout + animated ring. */
function ClickHint({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex flex-col items-center" style={{ gap: 0 }}>
      {/* Bouncing label above */}
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md pointer-events-none whitespace-nowrap animate-bounce"
        style={{ background: "#c9921c", color: "white", marginBottom: 4 }}>
        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
        {label}
      </span>
      {/* Triangle pointer */}
      <span className="pointer-events-none" style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #c9921c', marginBottom: 3 }} />
      {/* Wrapped element with double ring */}
      <span className="relative inline-flex">
        <span className="absolute -inset-2 rounded-xl pointer-events-none animate-pulse"
          style={{ boxShadow: '0 0 0 3px #f59e0b, 0 0 0 6px rgba(245,158,11,0.25)' }} />
        {children}
      </span>
    </span>
  );
}

// ── Screen 1: Dashboard (empty new-user state) ────────────────────────────────

function Screen1({ onNewTrip }: { onNewTrip: () => void }) {
  return (
    <div className="space-y-8">

      {/* Welcome callout */}
      <div className="rounded-2xl border p-4 flex items-start gap-3"
        style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
        <span className="text-xl flex-shrink-0">👋</span>
        <div>
          <p className="font-bold text-green-900 text-sm">Welcome to the interactive demo</p>
          <p className="text-green-800 text-xs mt-0.5 leading-relaxed">
            Click the <span className="font-bold" style={{ color: "#c9921c" }}>amber highlighted buttons</span> to step through the complete workflow.
            No sign-up needed — all data is fictional.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Welcome to CountyConsent. Let&apos;s get your organisation set up.</p>
      </div>

      {/* Empty stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Upcoming Trips",    value: 0, color: "green"   },
          { label: "Total Golfers",     value: 0, color: "blue"    },
          { label: "Consents Received", value: 0, color: "emerald" },
          { label: "Medical Alerts",    value: 0, color: "red"     },
        ].map(({ label, value, color }) => {
          const styles: Record<string, { icon: string; value: string }> = {
            green:   { icon: "bg-green-100 text-green-700",     value: "text-green-700" },
            blue:    { icon: "bg-blue-100 text-blue-700",       value: "text-blue-700" },
            emerald: { icon: "bg-emerald-100 text-emerald-700", value: "text-emerald-700" },
            red:     { icon: "bg-red-100 text-red-700",         value: "text-red-700" },
          };
          const s = styles[color];
          return (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className={`text-3xl font-black tracking-tight ${s.value}`}>{value}</div>
              <div className="text-slate-500 text-xs font-semibold mt-1 uppercase tracking-wide">{label}</div>
            </div>
          );
        })}
      </div>

      {/* Single empty-state CTA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#f0fdf4" }}>
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Start by setting up your team</h2>
          <p className="text-slate-500 text-sm max-w-sm">
            Invite your team managers first. Once they&apos;re set up, you can create trips and start collecting consent.
          </p>
        </div>
        <ClickHint label="Click here to begin">
          <button onClick={onNewTrip}
            className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Invite your first team manager
          </button>
        </ClickHint>
      </div>

    </div>
  );
}

// ── Screen 2: Create Trip ─────────────────────────────────────────────────────

function Screen2({ onSubmit, onBack }: { onSubmit: () => void; onBack: () => void }) {
  return (
    <div className="max-w-2xl space-y-6">
      <Breadcrumb items={["Dashboard", "New Trip"]} />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create new trip</h1>
        <p className="text-slate-500 mt-1 text-sm">Set up the trip details. You can add golfers afterwards.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trip name <span className="text-red-500">*</span></label>
          <input defaultValue="Northumberland Junior Open" readOnly
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Venue</label>
          <input defaultValue="Slaley Hall Golf Club" readOnly
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Departure date <span className="text-red-500">*</span></label>
            <input type="date" defaultValue="2026-07-15" readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Return date</label>
            <input type="date" defaultValue="2026-07-15" readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Team manager</label>
          <input defaultValue="Sarah Mitchell" readOnly
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:outline-none" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <ClickHint label="Create the trip">
            <button onClick={onSubmit}
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
              style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Create trip
            </button>
          </ClickHint>
          <button onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Screen 3: Trip Created ────────────────────────────────────────────────────

function Screen3() {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 text-center space-y-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#f0fdf4" }}>
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">Trip created!</h2>
        <p className="text-slate-500 text-sm mt-1">Northumberland Junior Open has been set up.</p>
      </div>
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Opening trip details…
      </div>
    </div>
  );
}

// ── Screen 4: Trip Detail ─────────────────────────────────────────────────────

function Screen4({ golfers, onAddGolfer, onSendEmail, onViewGolfer, onPrintMedical, onBack }: {
  golfers: Golfer[];
  onAddGolfer: () => void;
  onSendEmail: (email: string) => void;
  onViewGolfer: () => void;
  onPrintMedical: () => void;
  onBack: () => void;
}) {
  const consented = golfers.filter(g => g.consented).length;
  const medical = golfers.filter(g => g.medical);
  const pct = Math.round((consented / golfers.length) * 100);

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Dashboard", "Northumberland Junior Open"]} />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Northumberland Junior Open</h1>
          <p className="text-slate-500 text-sm mt-0.5">Slaley Hall Golf Club · 15 Jul 2026</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onPrintMedical}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Medical summary
          </button>
          <ClickHint label="Add a golfer">
            <button onClick={onAddGolfer}
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
              style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Add golfer
            </button>
          </ClickHint>
        </div>
      </div>

      {/* Consent progress */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
          <div className="text-2xl font-black text-slate-900">{golfers.length}</div>
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide mt-1">Total</div>
        </div>
        <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-4 text-center">
          <div className="text-2xl font-black text-green-700">{consented}</div>
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide mt-1">Consented</div>
        </div>
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-4 text-center">
          <div className="text-2xl font-black text-amber-600">{golfers.length - consented}</div>
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide mt-1">Pending</div>
        </div>
      </div>

      {/* Medical alert banner */}
      {medical.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            </div>
            <div>
              <p className="text-red-800 font-semibold text-sm">Medical alert — {medical.length} golfer requires attention</p>
              <p className="text-red-700 text-sm mt-0.5">
                <strong>James Taylor</strong> — Asthma. Ensure inhaler is accessible at all times.
              </p>
            </div>
          </div>
          <button onClick={onViewGolfer}
            className="text-xs font-bold text-red-700 px-3 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 transition-colors flex-shrink-0">
            View details
          </button>
        </div>
      )}

      {/* Golfer table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700">Golfers</h2>
          <span className="text-xs text-slate-400">{pct}% consent rate</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3 hidden sm:table-cell">Date of Birth</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {golfers.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{g.first_name} {g.last_name}</span>
                    {g.medical && (
                      <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">MED</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">{g.dob}</td>
                <td className="px-5 py-3.5"><ConsentBadge consented={g.consented} /></td>
                <td className="px-5 py-3.5 text-right">
                  {g.id === 1 ? (
                    <ClickHint label="See medical alert">
                      <button onClick={onViewGolfer}
                        className="text-xs font-semibold text-green-700 hover:text-green-800 px-3 py-1.5 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors">
                        View details
                      </button>
                    </ClickHint>
                  ) : g.id === 2 && !g.consented ? (
                    <ClickHint label="Send email">
                      <button onClick={() => onSendEmail(g.parent_email)}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                        Send consent email
                      </button>
                    </ClickHint>
                  ) : !g.consented ? (
                    <button onClick={() => onSendEmail(g.parent_email)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      Send consent email
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ── Screen 5: Select from Register ───────────────────────────────────────────

function Screen5({ onAdd, onBack }: {
  onAdd: (g: Omit<Golfer, "id" | "consented" | "medical">) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleAdd = () => {
    const g = REGISTER_GOLFERS.find(r => r.id === selected);
    if (!g) return;
    onAdd({ first_name: g.first_name, last_name: g.last_name, dob: g.dob, parent_email: g.parent_email });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Breadcrumb items={["Dashboard", "Northumberland Junior Open", "Add from Register"]} />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add golfer from register</h1>
        <p className="text-slate-500 mt-1 text-sm">Select a junior already in your county register to add to this trip.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-700">County register</p>
          <span className="text-xs text-slate-400">{REGISTER_GOLFERS.length} available</span>
        </div>
        <div className="divide-y divide-slate-100">
          {REGISTER_GOLFERS.map((g) => (
            <label key={g.id}
              className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors ${selected === g.id ? "bg-green-50" : "hover:bg-slate-50"}`}>
              <input type="radio" name="register-golfer" checked={selected === g.id}
                onChange={() => setSelected(g.id)}
                className="w-4 h-4 accent-green-700 flex-shrink-0" />
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700 flex-shrink-0">
                {g.first_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{g.first_name} {g.last_name}</p>
                <p className="text-xs text-slate-400">DOB: {g.dob}</p>
              </div>
              {selected === g.id && (
                <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">Selected</span>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {selected !== null ? (
          <ClickHint label="Add to trip">
            <button onClick={handleAdd}
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
              style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Add to trip
            </button>
          </ClickHint>
        ) : (
          <button disabled
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl opacity-40 cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Add to trip
          </button>
        )}
        <button onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Screen 6: Email Sent ──────────────────────────────────────────────────────

function Screen6({ emailSentTo, onBack }: { emailSentTo: string; onBack: () => void }) {
  return (
    <div className="max-w-lg mx-auto">
      <Breadcrumb items={["Dashboard", "Northumberland Junior Open"]} />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: "#f0fdf4" }}>
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Consent email sent</h2>
          <p className="text-slate-500 text-sm mt-2">
            An email with a unique consent link has been sent to{" "}
            <span className="font-semibold text-slate-700">{emailSentTo}</span>.
          </p>
          <p className="text-slate-400 text-xs mt-2">The parent will be prompted to complete the full consent form online.</p>
        </div>
        <div className="pt-2">
          <button onClick={onBack}
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
            ← Back to trip
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Screen 7: Golfer Detail ───────────────────────────────────────────────────

function Screen7({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <Breadcrumb items={["Dashboard", "Northumberland Junior Open", "James Taylor"]} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">James Taylor</h1>
          <p className="text-slate-500 text-sm mt-0.5">DOB: 12 Mar 2011 · Northumberland Junior Open</p>
        </div>
        <button onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex-shrink-0">
          ← Back to trip
        </button>
      </div>

      {/* Medical alert */}
      <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
          </div>
          <h3 className="font-bold text-red-900 text-sm uppercase tracking-wide">Medical Alert — Asthma</h3>
        </div>
        <p className="text-red-800 text-sm leading-relaxed">
          James uses a <strong>Salbutamol (Ventolin) 100mcg inhaler</strong> and is able to self-administer. Triggers include exercise and cold air. Spare inhaler kept in his golf bag at all times. Should use inhaler 15 minutes before exercise in cold or windy conditions.
        </p>
      </div>

      {/* Consent form details */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Parent / Guardian</h3>
          <Detail label="Name" value="Robert Taylor" />
          <Detail label="Relationship" value="Father" />
          <Detail label="Mobile" value="07712 345678" />
          <Detail label="Email" value="r.taylor@email.com" />
          <Detail label="Parental responsibility" value="Confirmed ✓" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Emergency Contact</h3>
          <Detail label="Name" value="Sarah Taylor" />
          <Detail label="Relationship" value="Mother" />
          <Detail label="Mobile" value="07798 456789" />
          <Detail label="Home phone" value="01434 612344" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">GP Details</h3>
          <Detail label="GP name" value="Dr A. Mitchell" />
          <Detail label="Surgery" value="Hexham General Practice" />
          <Detail label="Phone" value="01434 602 024" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Consents Given</h3>
          <Detail label="Supervision" value="✓ Agreed" />
          <Detail label="Emergency medical" value="✓ Agreed" />
          <Detail label="Transport" value="✓ Agreed" />
          <Detail label="Photography" value="✓ Agreed" />
          <Detail label="Data use" value="✓ Agreed" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 text-sm mb-3">Signature</h3>
        <p className="text-sm text-slate-700">Signed by <strong>Robert Taylor</strong> on <strong>3 Jun 2025</strong></p>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex-shrink-0">{label}</span>
      <span className="text-sm text-slate-900 text-right">{value}</span>
    </div>
  );
}

// ── Screen 8: Medical Summary ─────────────────────────────────────────────────

function Screen8({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb items={["Dashboard", "Northumberland Junior Open", "Medical Summary"]} />
        <button onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
          ← Back to trip
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Medical Summary</h1>
            <p className="text-slate-500 text-sm mt-0.5">Northumberland Junior Open · Slaley Hall Golf Club · 15 Jul 2026</p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#f0fdf4" }}>
            <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 py-2">
          <span className="text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">1 medical alert</span>
          <span className="text-xs text-slate-500">of {6} golfers requires attention from the team manager</span>
        </div>

        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            </div>
            <div>
              <p className="font-bold text-red-900">James Taylor</p>
              <p className="text-red-700 text-xs">DOB: 12 Mar 2011</p>
            </div>
            <span className="ml-auto text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">ASTHMA</span>
          </div>

          <div className="space-y-2 text-sm text-red-800 leading-relaxed">
            <p><strong>Condition:</strong> Asthma</p>
            <p><strong>Medication:</strong> Salbutamol (Ventolin) 100mcg inhaler — self-administers</p>
            <p><strong>Action:</strong> Ensure inhaler is accessible at all times. Use 15 minutes before exercise in cold or windy conditions.</p>
            <p><strong>Spare inhaler:</strong> Kept in golf bag at all times.</p>
          </div>

          <div className="border-t border-red-200 pt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">Parent contact</p>
              <p className="text-red-900 font-semibold">Robert Taylor</p>
              <p className="text-red-800">07712 345678</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">Emergency contact</p>
              <p className="text-red-900 font-semibold">Sarah Taylor (Mother)</p>
              <p className="text-red-800">07798 456789</p>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl p-5">
          <h3 className="font-bold text-slate-700 text-sm mb-3">All golfers — no medical needs</h3>
          <div className="space-y-2">
            {["Sophie Davis", "Liam Parker", "Olivia Brown", "Noah Wilson", "Emma Collins"].map(name => (
              <div key={name} className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {name} — No medical conditions reported
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center pt-2">
          Generated by CountyConsent · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · Northumberland County Golf Union
        </p>
      </div>
    </div>
  );
}

// ── Screen 9: Team Managers ───────────────────────────────────────────────────

type Manager = { initials: string; name: string; role: string; confirmed: boolean; lastSeen: string | null };

function Screen9({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [managers, setManagers] = useState<Manager[]>([
    { initials: "SM", name: "Sarah Mitchell", role: "Admin",        confirmed: true,  lastSeen: "Today, 09:42" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const handleSend = () => {
    const name = form.name.trim() || "New Manager";
    const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    setManagers(prev => [...prev, { initials, name, role: "Team Manager", confirmed: false, lastSeen: null }]);
    setShowForm(false);
    setSent(true);
    setForm({ name: "", email: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Dashboard
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Managers</h1>
          <p className="text-slate-500 mt-1 text-sm">Invite staff and manage their access. Invite links are sent automatically by email.</p>
        </div>
        {!showForm && !sent && (
          <ClickHint label="Click to invite a manager">
            <button onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
              style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Invite manager
            </button>
          </ClickHint>
        )}
        {(showForm || sent) && (
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl opacity-50 cursor-default"
            style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Invite manager
          </button>
        )}
      </div>

      {/* Inline invite form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-sm">Invite a team manager</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full name</label>
              <input placeholder="e.g. Paul Robson" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email address</label>
              <input type="email" placeholder="e.g. paul@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ClickHint label="Send the invite">
              <button onClick={handleSend}
                className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
                style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Send invite email
              </button>
            </ClickHint>
            <button onClick={() => setShowForm(false)} className="text-sm text-slate-500 hover:text-slate-700 font-semibold px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success banner */}
      {sent && (
        <div className="rounded-2xl border p-4 flex items-center gap-3" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-semibold text-green-900">Invite sent! They&apos;ll receive an email with a link to set their password.</p>
        </div>
      )}

      {/* Staff list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-700">Staff ({managers.length})</p>
          {managers.some(m => !m.confirmed) && (
            <span className="text-xs text-amber-700 font-semibold">{managers.filter(m => !m.confirmed).length} invite pending</span>
          )}
        </div>
        <div className="divide-y divide-slate-100">
          {managers.map((m) => (
            <div key={m.name} className={`flex items-center gap-4 px-5 py-4 ${!m.confirmed ? "bg-amber-50/40" : ""}`}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: "#155230" }}>
                {m.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                <p className="text-xs text-slate-400">{m.role}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {m.confirmed ? (
                  <>
                    <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">Active</span>
                    {m.lastSeen && <span className="text-xs text-slate-400 hidden sm:block">Last seen: {m.lastSeen}</span>}
                  </>
                ) : (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">Invite pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          ← Back to dashboard
        </button>
        <ClickHint label="Next: create a trip">
          <button onClick={onNext}
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
            Next: create a trip
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </ClickHint>
      </div>
    </div>
  );
}

// ── Main demo page ────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [screen, setScreen] = useState(1);
  const [fading, setFading] = useState(false);
  const [golfers, setGolfers] = useState<Golfer[]>(BASE_GOLFERS);
  const [emailSentTo, setEmailSentTo] = useState("m.davis@email.com");

  const navigate = (to: number) => {
    setFading(true);
    setTimeout(() => {
      setScreen(to);
      setFading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 180);
  };

  const restart = () => {
    setGolfers(BASE_GOLFERS);
    setEmailSentTo("m.davis@email.com");
    navigate(1);
  };

  // Auto-advance from trip-created confirmation to trip detail
  useEffect(() => {
    if (screen !== 4) return;
    const t = setTimeout(() => navigate(5), 1500);
    return () => clearTimeout(t);
  }, [screen]);

  const consentedCount = golfers.filter(g => g.consented).length;
  const medicalCount = golfers.filter(g => g.medical).length;

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-geist-sans, system-ui, sans-serif)", background: "#f8fafc" }}>

      {/* Demo banner */}
      <div className="text-center py-2 px-4 text-xs font-semibold" style={{ background: "#155230", color: "#bbf7d0" }}>
        This is a demo — no real data is stored · Fictional data only · Screen layouts are for illustration purposes only
      </div>

      {/* Demo controls */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:block">
              Step {screen}/{SCREENS.length}
            </span>
            <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-0">
              <div className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${(screen / SCREENS.length) * 100}%`, background: "linear-gradient(90deg, #155230, #22c55e)" }} />
            </div>
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
              {SCREENS.find(s => s.id === screen)?.label}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={restart}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              ↺ Restart
            </button>
            <Link href="/pricing"
              className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #155230, #1a6b3e)" }}>
              Sign up now →
            </Link>
          </div>
        </div>
      </div>

      {/* Per-screen guidance strip */}
      {SCREEN_HINTS[screen] && screen !== 4 && (
        <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a" }} className="px-4 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center gap-2.5">
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
              style={{ background: "#c9921c" }}>
              {screen}
            </span>
            <p className="text-sm font-medium" style={{ color: "#78350f" }}>
              {SCREEN_HINTS[screen]}
            </p>
          </div>
        </div>
      )}
      {screen === 4 && (
        <div style={{ background: "#f0fdf4", borderBottom: "1px solid #bbf7d0" }} className="px-4 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center gap-2.5">
            <svg className="w-4 h-4 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-green-800">{SCREEN_HINTS[4]}</p>
          </div>
        </div>
      )}

      {/* Fake app nav */}
      <nav style={{ background: "#052e16" }} className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#155230" }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-bold text-white text-sm">CountyConsent</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {[
                { label: "Dashboard", active: screen !== 2 },
                { label: "Staff", active: screen === 2 },
                { label: "Archived", active: false },
              ].map(({ label, active }) => (
                <button key={label}
                  onClick={() => label === "Staff" ? navigate(2) : label === "Dashboard" ? navigate(1) : undefined}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${active ? "text-white bg-white/10" : "text-green-300/70 hover:text-white hover:bg-white/5"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-300 text-xs hidden md:block">Northumberland County Golf Union</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#155230" }}>
                SM
              </div>
              <span className="text-white text-xs font-semibold hidden sm:block">Sarah Mitchell</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Screen content */}
      <main
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
        style={{ opacity: fading ? 0 : 1, transition: "opacity 0.18s ease" }}>

        {screen === 1 && (
          <Screen1 onNewTrip={() => navigate(2)} />
        )}
        {screen === 2 && (
          <Screen9 onBack={() => navigate(1)} onNext={() => navigate(3)} />
        )}
        {screen === 3 && (
          <Screen2 onSubmit={() => navigate(4)} onBack={() => navigate(2)} />
        )}
        {screen === 4 && <Screen3 />}
        {screen === 5 && (
          <Screen4 golfers={golfers} onAddGolfer={() => navigate(6)}
            onSendEmail={(email) => { setEmailSentTo(email); navigate(7); }}
            onViewGolfer={() => navigate(8)} onPrintMedical={() => navigate(9)}
            onBack={() => navigate(1)} />
        )}
        {screen === 6 && (
          <Screen5
            onAdd={(g) => {
              setGolfers(prev => [...prev, { ...g, id: prev.length + 1, consented: false, medical: null }]);
              navigate(5);
            }}
            onBack={() => navigate(5)} />
        )}
        {screen === 7 && <Screen6 emailSentTo={emailSentTo} onBack={() => navigate(5)} />}
        {screen === 8 && <Screen7 onBack={() => navigate(5)} />}
        {screen === 9 && <Screen8 onBack={() => navigate(5)} />}

      </main>
    </div>
  );
}
