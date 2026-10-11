import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { data: row, error: rowError } = await admin
    .from('subscriptions')
    .select('razorpay_subscription_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (rowError || !row?.razorpay_subscription_id) {
    return new Response(JSON.stringify({ error: 'No active subscription found' }), { status: 404, headers: corsHeaders })
  }

  const basicAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)
  const rpRes = await fetch(`https://api.razorpay.com/v1/subscriptions/${row.razorpay_subscription_id}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basicAuth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ cancel_at_cycle_end: 1 }),
  })
  const cancelled = await rpRes.json()
  if (!rpRes.ok) {
    console.error('razorpay cancel failed:', row.razorpay_subscription_id, cancelled)
    return new Response(JSON.stringify({ error: cancelled?.error?.description ?? 'Razorpay error' }), {
      status: 502,
      headers: corsHeaders,
    })
  }

  // cancel_at_cycle_end means Razorpay keeps this subscription (and its
  // access) alive until current_end — so status stays whatever it already is
  // ('active'), not 'cancelled'. The webhook flips status for real once
  // Razorpay actually ends it at cycle end. This flag just drives the
  // "ends on <date>" UI in the meantime.
  await admin
    .from('subscriptions')
    .update({ cancel_requested: true, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)

  return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})
