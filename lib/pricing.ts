// Single source of truth for CountyConsent's displayed monthly pricing and
// account-type labels.
//
// NOTE: the amount actually charged lives in the Stripe price IDs (the
// STRIPE_*_PRICE_ID env vars, selected by STRIPE_MODE). These strings are the
// display copy shown on the marketing/signup pages and in the invoice-request
// admin email — keep them in step with the Stripe prices.

export type AccountType = 'county_union' | 'golf_club'

// Bare price strings (no "/month" suffix — callers append it to suit context).
export const MONTHLY_PRICE: Record<AccountType, string> = {
  county_union: '£199',
  golf_club: '£65',
}

export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  county_union: 'County Union',
  golf_club: 'Golf Club',
}
