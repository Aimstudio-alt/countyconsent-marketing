"use client";

import { useState } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

type Golfer = {
  id: number;
  first_name: string;
  last_name: string;
  dob: string;
  parent_email: string;
  email_confirmed: boolean;
  flagged_own_email: boolean;
  consented: boolean;
  medical: string | null;
};

// ── Demo data ─────────────────────────────────────────────────────────────────

const IMPORTED_GOLFERS: Golfer[] = [
  { id: 1, first_name: "Freya",  last_name: "Ahmed",     dob: "14 Feb 2011", parent_email: "s.ahmed@email.com",         email_confirmed: false, flagged_own_email: false, consented: false, medical: null },
  { id: 2, first_name: "Oscar",  last_name: "Whitfield",  dob: "03 Sep 2010", parent_email: "oscarwhitfield10@email.com", email_confirmed: false, flagged_own_email: true,  consented: false, medical: "Type 1 diabetes — carries an insulin pen at all times. Check blood glucose before and after play." },
  { id: 3, first_name: "Ruby",   last_name: "Sinclair",   dob: "21 Jun 2012", parent_email: "m.sinclair@email.com",      email_confirmed: false, flagged_own_email: false, consented: false, medical: null },
  { id: 4, first_name: "Harvey", last_name: "Nolan",      dob: "09 Nov 2011", parent_email: "d.nolan@email.com",         email_confirmed: false, flagged_own_email: false, consented: false, medical: null },
];

const SCREENS = [
  { id: 1, label: "Golfers" },
  { id: 2, label: "Contact Details" },
  { id: 3, label: "Send Consent" },
  { id: 4, label: "Parent Consent" },
  { id: 5, label: "Golfer Record" },
  { id: 6, label: "Trips (Optional)" },
  { id: 7, label: "Medical Summary" },
];

const SCREEN_HINTS: Record<number, string> = {
  1: 'Step 1 of 7 — Click "Import golfers" to bring in a membership list. This is the first thing anyone does — no trip required.',
  2: 'Step 2 of 7 — Confirm each parent/guardian email. Look closely at Oscar’s — it’s flagged as possibly his own address.',
  3: 'Step 3 of 7 — Send to one parent at a time, or click "Send consent requests to all" to email everyone confirmed in one action.',
  4: 'Step 4 of 7 — This is what a parent sees. Click "Simulate parent submitting" to complete the form on their behalf.',
  5: 'Step 5 of 7 — Consent, medical and emergency details are all visible from the golfer’s own record. No trip needed.',
  6: 'Step 6 of 7 — Optional. Mostly used by county unions to organise an away day. Click "Create a trip" to see how it works, or skip ahead.',
  7: 'Step 7 of 7 — The medical summary is ready to print, whether it’s for a trip or just for the club. That’s the walkthrough!',
};

// ── Shared sub-components ─────────────────────────────────────────────────────

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

function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div className="flex items-center gap-1 text-sm text-slate-500 mb-6 min-w-0 overflow-hidden">
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-1 min-w-0 flex-shrink">
          {i > 0 && <svg className="w-3 h-3 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
          <span className={`truncate ${i === items.length - 1 ? "font-semibold text-slate-900" : ""}`}>{item}</span>
        </span>
      ))}
    </div>
  );
}

/** Wraps a clickable element with a prominent bouncing callout + animated ring. */
function ClickHint({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex flex-col items-center" style={{ gap: 0 }}>
      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md pointer-events-none text-center animate-bounce"
        style={{ background: "#c9921c", color: "white", marginBottom: 4, maxWidth: 180 }}>
        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
        {label}
      </span>
      <span className="pointer-events-none" style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #c9921c', marginBottom: 3 }} />
      <span className="relative inline-flex">
        <span className="absolute -inset-2 rounded-xl pointer-events-none animate-pulse"
          style={{ boxShadow: '0 0 0 3px #f59e0b, 0 0 0 6px rgba(245,158,11,0.25)' }} />
        {children}
      </span>
    </span>
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

// ── Screen 1: Golfers — empty register, import or add ────────────────────────

function Screen1({ imported, onImport }: { imported: boolean; onImport: () => void }) {
  if (!imported) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border p-4 flex items-start gap-3"
          style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <span className="text-xl flex-shrink-0">👋</span>
          <div>
            <p className="font-bold text-green-900 text-sm">Welcome to the interactive demo</p>
            <p className="text-green-800 text-xs mt-0.5 leading-relaxed">
              Click the <span className="font-bold" style={{ color: "#c9921c" }}>amber highlighted buttons</span> to step through the golfer-first workflow.
              No sign-up needed — all data is fictional.
            </p>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Golfers</h1>
          <p className="text-slate-500 mt-1 text-sm">Your register is empty. This is the first thing anyone does — trips come later, if you use them at all.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#f0fdf4" }}>
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Build your golfer register</h2>
            <p className="text-slate-500 text-sm max-w-sm">
              Import a membership list, or add golfers one at a time. Once they&apos;re in the register, they&apos;re available for consent requests — with or without a trip.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ClickHint label="Click here to begin">
              <button onClick={onImport}
                className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import membership list
              </button>
            </ClickHint>
            <button disabled className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl border border-slate-200 text-slate-400 cursor-not-allowed">
              Add golfer individually
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Golfers</h1>
        <p className="text-slate-500 mt-1 text-sm">{IMPORTED_GOLFERS.length} golfers imported into the Westshire County Golf Union register.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700">Register</h2>
          <span className="text-xs text-slate-400">{IMPORTED_GOLFERS.length} golfers</span>
        </div>
        <div className="divide-y divide-slate-100">
          {IMPORTED_GOLFERS.map((g) => (
            <div key={g.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 flex-shrink-0">
                {g.first_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{g.first_name} {g.last_name}</p>
                <p className="text-xs text-slate-400">DOB: {g.dob}</p>
              </div>
              {g.medical && <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">MED</span>}
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">Email unconfirmed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Screen 2: Contact details — confirm parent/guardian emails ──────────────

function Screen2({ confirmedIds, onConfirm }: { confirmedIds: Set<number>; onConfirm: (id: number) => void }) {
  const allConfirmed = confirmedIds.size === IMPORTED_GOLFERS.length;

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Golfers", "Contact Details"]} />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Contact details</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Each imported email is held unconfirmed until a staff member confirms it belongs to a parent or guardian. Nothing can be sent until it&apos;s confirmed.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-700">Parent / guardian emails</p>
          <span className="text-xs text-slate-400">{confirmedIds.size} of {IMPORTED_GOLFERS.length} confirmed</span>
        </div>
        <div className="divide-y divide-slate-100">
          {IMPORTED_GOLFERS.map((g) => {
            const confirmed = confirmedIds.has(g.id);
            return (
              <div key={g.id}>
                <div className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 flex-shrink-0">
                    {g.first_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{g.first_name} {g.last_name}</p>
                    <p className="text-xs text-slate-400">{g.parent_email}</p>
                  </div>
                  {confirmed ? (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">Confirmed</span>
                  ) : g.flagged_own_email ? (
                    <ClickHint label="Check, then confirm">
                      <button onClick={() => onConfirm(g.id)}
                        className="text-xs font-semibold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors">
                        Confirm anyway
                      </button>
                    </ClickHint>
                  ) : (
                    <button onClick={() => onConfirm(g.id)}
                      className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                      Confirm
                    </button>
                  )}
                </div>
                {g.flagged_own_email && !confirmed && (
                  <div className="px-5 pb-4 -mt-1">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        <strong>This looks like it might be Oscar&apos;s own email address</strong>, not a parent or guardian&apos;s — the address contains his name and birth year. Check with the club before confirming.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {allConfirmed && (
        <div className="rounded-2xl border p-4 flex items-center gap-3" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-semibold text-green-900">All emails confirmed. Consent requests can now be sent.</p>
        </div>
      )}
    </div>
  );
}

// ── Screen 3: Send consent requests ──────────────────────────────────────────

function Screen3({ confirmedCount, sentIds, onSendOne, onSendAll }: {
  confirmedCount: number;
  sentIds: Set<number>;
  onSendOne: (id: number) => void;
  onSendAll: () => void;
}) {
  const allSent = sentIds.size === IMPORTED_GOLFERS.length;

  return (
    <div className="max-w-xl space-y-6">
      <Breadcrumb items={["Golfers", "Send Consent"]} />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Send consent requests</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Send to everyone confirmed in one action, or send to a single parent individually — for example if you&apos;re chasing just one after the rest already have theirs.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-700">Confirmed parents</p>
          <span className="text-xs text-slate-400">{sentIds.size} of {confirmedCount} sent</span>
        </div>
        <div className="divide-y divide-slate-100">
          {IMPORTED_GOLFERS.map((g) => {
            const isSent = sentIds.has(g.id);
            return (
              <div key={g.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 flex-shrink-0">
                  {g.first_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{g.first_name} {g.last_name}</p>
                  <p className="text-xs text-slate-400">{g.parent_email}</p>
                </div>
                {isSent ? (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">Sent</span>
                ) : (
                  <button onClick={() => onSendOne(g.id)}
                    className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                    Send
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Or send to everyone confirmed at once</span>
          <span className="text-2xl font-black text-green-700">{confirmedCount}</span>
        </div>

        {!allSent ? (
          <ClickHint label="Send to everyone confirmed">
            <button onClick={onSendAll}
              className="w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-sm transition-all"
              style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Send consent requests to all {confirmedCount}
            </button>
          </ClickHint>
        ) : (
          <div className="rounded-2xl border p-4 flex items-center gap-3" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-semibold text-green-900">
              {confirmedCount} consent {confirmedCount === 1 ? "request" : "requests"} sent. Each parent gets a unique, secure link by email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Screen 4: Parent completes the form ──────────────────────────────────────

function Screen4({ submitted, onSubmit }: { submitted: boolean; onSubmit: () => void }) {
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Breadcrumb items={["Golfers", "Send Consent", "Parent Consent"]} />
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">What the parent sees</h1>
        <p className="text-slate-500 mt-1 text-sm">Freya&apos;s mum opens the link on her phone — no account, no app, no password.</p>
      </div>

      <div className="relative mx-auto w-72 bg-gray-900 rounded-3xl shadow-2xl p-2">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5">
            <p className="text-xs font-bold text-gray-900">Consent form — Freya Ahmed</p>
            <p className="text-xs text-gray-400">Westshire County Golf Union</p>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Emergency contact</p>
              <div className="h-6 bg-gray-100 rounded-md flex items-center px-2 text-xs text-gray-500">Sadia Ahmed · 07700 900112</div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">GP name & phone</p>
              <div className="h-6 bg-gray-100 rounded-md flex items-center px-2 text-xs text-gray-500">Dr R. Nkomo · 0121 496 0132</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">
              <p className="text-xs font-semibold text-gray-700 mb-1">Medical information</p>
              <p className="text-xs text-gray-500">No known conditions</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Parent / guardian signature</p>
              <div className="h-8 bg-gray-50 border border-dashed border-gray-200 rounded-md flex items-center justify-center">
                <span className="text-xs text-gray-400 italic">Sadia Ahmed</span>
              </div>
            </div>
            {!submitted ? (
              <ClickHint label="Simulate parent submitting">
                <button onClick={onSubmit} className="w-full py-2 bg-green-700 text-white text-xs font-bold rounded-xl">
                  Submit consent ✓
                </button>
              </ClickHint>
            ) : (
              <div className="w-full py-2 bg-green-100 text-green-800 text-xs font-bold rounded-xl text-center">
                Consent submitted ✓
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Screen 5: Golfer record — full consent visible, no trip needed ──────────

function Screen5() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={["Golfers", "Freya Ahmed"]} />

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Freya Ahmed</h1>
        <p className="text-slate-500 text-sm mt-0.5">DOB: 14 Feb 2011 · Westshire County Golf Union register</p>
        <p className="text-green-700 text-xs font-semibold mt-2">Everything below is visible from Freya&apos;s own record — no trip needed.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Parent / Guardian</h3>
          <Detail label="Name" value="Sadia Ahmed" />
          <Detail label="Relationship" value="Mother" />
          <Detail label="Mobile" value="07700 900112" />
          <Detail label="Email" value="s.ahmed@email.com — confirmed" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">GP Details</h3>
          <Detail label="GP name" value="Dr R. Nkomo" />
          <Detail label="Phone" value="0121 496 0132" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Medical</h3>
          <Detail label="Conditions" value="None recorded" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Consents Given</h3>
          <Detail label="Supervision" value="✓ Agreed" />
          <Detail label="Emergency medical" value="✓ Agreed" />
          <Detail label="Photography" value="✓ Agreed" />
          <Detail label="Data use" value="✓ Agreed" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 text-sm mb-3">Signature</h3>
        <p className="text-sm text-slate-700">Signed by <strong>Sadia Ahmed</strong> on <strong>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</strong></p>
      </div>
    </div>
  );
}

// ── Screen 6: Trips — optional, mainly for county unions ────────────────────

function Screen6({ tripCreated, golferAdded, onCreateTrip, onAddGolfer }: {
  tripCreated: boolean;
  golferAdded: boolean;
  onCreateTrip: () => void;
  onAddGolfer: () => void;
}) {
  return (
    <div className="max-w-2xl space-y-6">
      <Breadcrumb items={["Golfers", "Trips (Optional)"]} />
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mb-3"
          style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>
          Optional
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Trips</h1>
        <p className="text-slate-500 mt-1 text-sm max-w-lg">
          Most golf clubs never create a trip — golfers stay in the register and get consent requests directly. County unions more often use trips to organise an away day and pull golfers in from the register.
        </p>
      </div>

      {!tripCreated ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trip name</label>
            <input defaultValue="Westshire Junior Open" readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Venue</label>
            <input defaultValue="Ashgrove Golf Club" readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:outline-none" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <ClickHint label="Create the trip">
              <button onClick={onCreateTrip}
                className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
                style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Create trip
              </button>
            </ClickHint>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50">
            <p className="text-sm font-bold text-slate-700">Westshire Junior Open</p>
            <p className="text-xs text-slate-400">Ashgrove Golf Club</p>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-slate-600">Golfers on this trip are added from the register — nothing is re-entered.</p>
            {!golferAdded ? (
              <ClickHint label="Add from the register">
                <button onClick={onAddGolfer}
                  className="inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
                  style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Add golfers from register
                </button>
              </ClickHint>
            ) : (
              <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 flex-shrink-0">F</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">Freya Ahmed</p>
                  <p className="text-xs text-slate-400">Added from register — consent already on file</p>
                </div>
                <ConsentBadge consented={true} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Screen 7: Medical summary — for a trip, or for the club ──────────────────

function Screen7({ scope }: { scope: "club" | "trip" }) {
  const withMedical = IMPORTED_GOLFERS.filter(g => g.medical);

  return (
    <div className="space-y-6">
      <Breadcrumb items={["Golfers", "Medical Summary"]} />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Medical summary</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {scope === "trip" ? "Westshire Junior Open · Ashgrove Golf Club" : "Whole club register — Westshire County Golf Union"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#f0fdf4" }}>
            <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-black text-slate-900">{IMPORTED_GOLFERS.length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Golfers</p>
          </div>
          <div>
            <p className="text-2xl font-black text-red-600">{withMedical.length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Medical alerts</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        This summary works the same way whether it&apos;s printed for a specific trip or for the whole club — the golfers and their medical details come from the register either way.
      </p>

      {withMedical.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Medical Alerts</h2>
          {withMedical.map(g => (
            <div key={g.id} className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-red-900">{g.first_name} {g.last_name}</p>
                  <p className="text-red-700 text-xs">DOB: {g.dob}</p>
                </div>
                <span className="ml-auto text-xs font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">MEDICAL</span>
              </div>
              <p className="text-sm text-red-800 leading-relaxed">{g.medical}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border-2 border-green-300 p-5 text-center space-y-3" style={{ background: "#f0fdf4" }}>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#dcfce7" }}>
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-green-900">That&apos;s the walkthrough.</p>
            <p className="text-green-800 text-sm">Everything starts and ends with the register — trips are just an optional way to group golfers for a specific event.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <a href="/pricing" className="inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-2 rounded-xl shadow-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
            Get started for free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main demo page ────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [screen, setScreen] = useState(1);
  const [fading, setFading] = useState(false);
  const [imported, setImported] = useState(false);
  const [confirmedIds, setConfirmedIds] = useState<Set<number>>(new Set());
  const [sentIds, setSentIds] = useState<Set<number>>(new Set());
  const [parentSubmitted, setParentSubmitted] = useState(false);
  const [tripCreated, setTripCreated] = useState(false);
  const [golferAdded, setGolferAdded] = useState(false);

  const navigate = (to: number) => {
    setFading(true);
    setTimeout(() => {
      setScreen(to);
      setFading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 180);
  };

  const restart = () => {
    setImported(false);
    setConfirmedIds(new Set());
    setSentIds(new Set());
    setParentSubmitted(false);
    setTripCreated(false);
    setGolferAdded(false);
    navigate(1);
  };

  const confirmedCount = confirmedIds.size;

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-geist-sans, system-ui, sans-serif)", background: "#f8fafc" }}>

      {/* Demo banner */}
      <div className="text-center py-2 px-4 text-xs font-semibold leading-relaxed" style={{ background: "#155230", color: "#bbf7d0" }}>
        <span className="hidden sm:inline">This is a demo — no real data is stored · Fictional data only · Screen layouts are for illustration purposes only</span>
        <span className="sm:hidden">Demo only — no real data stored</span>
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
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap hidden sm:block">
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
      {SCREEN_HINTS[screen] && (
        <div style={{ background: "#b45309", borderBottom: "2px solid #92400e" }} className="px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold text-white leading-snug">
              {SCREEN_HINTS[screen]}
            </p>
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
              {["Golfers", "Trips", "Archived"].map((label) => (
                <span key={label}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${label === "Golfers" ? "text-white bg-white/10" : "text-green-300/70"}`}>
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-300 text-xs hidden md:block">Westshire County Golf Union</span>
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
          <Screen1 imported={imported} onImport={() => { setImported(true); }} />
        )}
        {screen === 2 && (
          <Screen2 confirmedIds={confirmedIds} onConfirm={(id) => setConfirmedIds(prev => new Set([...prev, id]))} />
        )}
        {screen === 3 && (
          <Screen3
            confirmedCount={confirmedCount}
            sentIds={sentIds}
            onSendOne={(id) => setSentIds(prev => new Set([...prev, id]))}
            onSendAll={() => setSentIds(new Set(IMPORTED_GOLFERS.map(g => g.id)))}
          />
        )}
        {screen === 4 && (
          <Screen4 submitted={parentSubmitted} onSubmit={() => setParentSubmitted(true)} />
        )}
        {screen === 5 && <Screen5 />}
        {screen === 6 && (
          <Screen6
            tripCreated={tripCreated}
            golferAdded={golferAdded}
            onCreateTrip={() => setTripCreated(true)}
            onAddGolfer={() => setGolferAdded(true)}
          />
        )}
        {screen === 7 && <Screen7 scope={tripCreated ? "trip" : "club"} />}

        {/* Step navigation */}
        <div className="flex items-center justify-between gap-3 pt-8 mt-8 border-t border-slate-200">
          <button onClick={() => navigate(Math.max(1, screen - 1))} disabled={screen === 1}
            className="text-sm font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            ← Back
          </button>
          {screen < SCREENS.length ? (
            <ClickHint label={`Next: ${SCREENS.find(s => s.id === screen + 1)?.label}`}>
              <button
                onClick={() => navigate(screen + 1)}
                disabled={
                  (screen === 1 && !imported) ||
                  (screen === 2 && confirmedCount < IMPORTED_GOLFERS.length) ||
                  (screen === 3 && sentIds.size < IMPORTED_GOLFERS.length) ||
                  (screen === 4 && !parentSubmitted)
                }
                className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #166534, #15803d)" }}>
                Next: {SCREENS.find(s => s.id === screen + 1)?.label}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </ClickHint>
          ) : (
            <span />
          )}
        </div>
      </main>
    </div>
  );
}
