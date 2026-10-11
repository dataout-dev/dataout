import { createClient } from 'jsr:@supabase/supabase-js@2'

const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Deployed with --no-verify-jwt: Razorpay has no Supabase JWT to send.
// This signature check IS the authentication for this endpoint.
async function verifySignature(rawBody: string, signature: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(RAZORPAY_WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody))
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return expected === signature
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''
  if (!signature || !(await verifySignature(rawBody, signature))) {
    return new Response('Invalid signature', { status: 400 })
  }

  const event = JSON.parse(rawBody)
  const entity = event.payload?.subscription?.entity
  if (!entity) return new Response('ok', { status: 200 })

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const patch = {
    razorpay_subscription_id: entity.id,
    status: entity.status,
    plan_id: entity.plan_id,
    current_start: entity.current_start ? new Date(entity.current_start * 1000).toISOString() : null,
    current_end: entity.current_end ? new Date(entity.current_end * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  }

  const { data: existing } = await admin
    .from('subscriptions')
    .select('user_id')
    .eq('razorpay_subscription_id', entity.id)
    .maybeSingle()

  if (existing) {
    const { error } = await admin.from('subscriptions').update(patch).eq('user_id', existing.user_id)
    if (error) console.error('subscriptions update failed:', error)
  } else if (entity.notes?.supabase_user_id) {
    const { error } = await admin.from('subscriptions').upsert({ user_id: entity.notes.supabase_user_id, ...patch })
    if (error) console.error('subscriptions upsert failed:', error)
  }

  return new Response('ok', { status: 200 })
})
