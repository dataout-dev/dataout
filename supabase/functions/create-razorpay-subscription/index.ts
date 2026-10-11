import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Three pricing tiers. Each needs its own Plan (and, for the discounted first
// period, an Offer) created in the Razorpay dashboard — the IDs come in as
// secrets, never hardcoded here. total_count is just "enough cycles that the
// subscription effectively auto-renews indefinitely"; adjust freely.
const TIERS: Record<string, { planIdSecret: string; offerIdSecret: string; totalCount: number }> = {
  monthly: { planIdSecret: 'RAZORPAY_PLAN_ID_MONTHLY', offerIdSecret: 'RAZORPAY_OFFER_ID_MONTHLY', totalCount: 24 },
  half_yearly: { planIdSecret: 'RAZORPAY_PLAN_ID_HALF_YEARLY', offerIdSecret: 'RAZORPAY_OFFER_ID_HALF_YEARLY', totalCount: 10 },
  yearly: { planIdSecret: 'RAZORPAY_PLAN_ID_YEARLY', offerIdSecret: 'RAZORPAY_OFFER_ID_YEARLY', totalCount: 5 },
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  })
  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser()
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: corsHeaders })
  }

  let tierKey: string
  try {
    const body = await req.json()
    tierKey = body.tier
  } catch {
    return new Response(JSON.stringify({ error: 'Missing request body' }), { status: 400, headers: corsHeaders })
  }

  const tier = TIERS[tierKey]
  if (!tier) {
    return new Response(JSON.stringify({ error: `Unknown tier "${tierKey}"` }), { status: 400, headers: corsHeaders })
  }

  const planId = Deno.env.get(tier.planIdSecret)
  const offerId = Deno.env.get(tier.offerIdSecret) // optional — fine if not set
  if (!planId) {
    return new Response(JSON.stringify({ error: `${tier.planIdSecret} is not configured` }), { status: 500, headers: corsHeaders })
  }

  const basicAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)
  const rpRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
    method: 'POST',
    headers: { Authorization: `Basic ${basicAuth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: planId,
      ...(offerId ? { offer_id: offerId } : {}),
      customer_notify: 1,
      total_count: tier.totalCount,
      notes: { supabase_user_id: user.id, tier: tierKey },
    }),
  })
  const subscription = await rpRes.json()
  if (!rpRes.ok) {
    return new Response(JSON.stringify({ error: subscription?.error?.description ?? 'Razorpay error' }), {
      status: 502,
      headers: corsHeaders,
    })
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { error: upsertError } = await admin.from('subscriptions').upsert({
    user_id: user.id,
    user_email: user.email,
    razorpay_subscription_id: subscription.id,
    plan_id: planId,
    status: subscription.status,
    cancel_requested: false, // reset in case this user previously cancelled and is resubscribing
    updated_at: new Date().toISOString(),
  })
  if (upsertError) console.error('subscriptions upsert failed:', upsertError)

  return new Response(JSON.stringify({ subscription_id: subscription.id, key_id: RAZORPAY_KEY_ID }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
