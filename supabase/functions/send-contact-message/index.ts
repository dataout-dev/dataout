import { corsHeaders } from '../_shared/cors.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const CONTACT_RECIPIENT_EMAIL = Deno.env.get('CONTACT_RECIPIENT_EMAIL')!

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(s: string) {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return s.replace(/[&<>"']/g, (c) => map[c])
}

// Deployed with --no-verify-jwt: visitors without an account (e.g. reporting a
// billing issue they can't log in to fix) still need to be able to reach this.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  let body: { name?: string; email?: string; category?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Missing request body' }), { status: 400, headers: corsHeaders })
  }

  const name = (body.name ?? '').trim().slice(0, 200)
  const email = (body.email ?? '').trim().slice(0, 200)
  const category = (body.category ?? 'General feedback').trim().slice(0, 100)
  const message = (body.message ?? '').trim().slice(0, 5000)

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Name, email, and message are required.' }), { status: 400, headers: corsHeaders })
  }
  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: 'That email address looks invalid.' }), { status: 400, headers: corsHeaders })
  }

  const rpRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'DataOut Contact <onboarding@resend.dev>',
      to: [CONTACT_RECIPIENT_EMAIL],
      reply_to: email,
      subject: `[DataOut] ${category} from ${name}`,
      html: `
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Category:</strong> ${escapeHtml(category)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    }),
  })

  if (!rpRes.ok) {
    console.error('Resend send failed:', await rpRes.text())
    return new Response(JSON.stringify({ error: 'Could not send your message right now. Please try again later.' }), {
      status: 502,
      headers: corsHeaders,
    })
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})
