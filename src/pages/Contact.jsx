import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { ArrowLeft, Mail, CircleCheck, CircleAlert } from '../components/icons'

const CATEGORIES = ['General feedback', 'Bug report', 'Billing question', 'Feature request', 'Other']

// supabase-js's FunctionsHttpError.message is just "Edge Function returned a
// non-2xx status code" — the actual JSON body we returned (e.g. {error: "..."})
// is on err.context, the raw Response. Read it so real errors are visible.
async function describeFunctionError(err) {
  if (err?.context?.json) {
    try {
      const body = await err.context.json()
      if (body?.error) return body.error
    } catch {
      /* not JSON, fall through */
    }
  }
  return err?.message ?? 'Something went wrong.'
}

function Contact() {
  const { session } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState(session?.user?.email ?? '')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const { error: fnError } = await supabase.functions.invoke('send-contact-message', {
        body: { name, email, category, message },
      })
      if (fnError) throw fnError
      setStatus('sent')
      setMessage('')
    } catch (err) {
      setError(await describeFunctionError(err))
      setStatus('error')
    }
  }

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative overflow-hidden border-b border-heading/10">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-8 pt-10 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-caption hover:text-heading transition-colors mb-10">
            <ArrowLeft className="h-4 w-4" /> Back to DataOut
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-3">Contact</p>
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-heading leading-[1.1] mb-3">
                Tell us what's on your mind.
              </h1>
              <p className="text-body-text max-w-md">
                Bug reports, billing questions, feature requests, or just feedback — whatever it is, it reaches us directly.
              </p>
            </div>
            <span className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-badge text-accent-dark shrink-0">
              <Mail className="h-6 w-6" />
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-8 py-14">
        {status === 'sent' ? (
          <div className="rounded-2xl border border-correct/20 bg-correct/5 p-8 flex flex-col items-center text-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-correct/10 text-correct">
              <CircleCheck className="h-6 w-6" />
            </span>
            <p className="text-lg font-semibold text-heading">Message sent.</p>
            <p className="text-sm text-body-text max-w-sm">
              Thanks for reaching out — we read every message and will get back to you at the email you provided.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-2 text-sm font-medium text-heading underline underline-offset-2 hover:no-underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-surface rounded-2xl border border-heading/10 p-6 flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-heading">Name</span>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border border-heading/15 bg-cream px-3.5 py-2.5 text-sm text-body-text outline-none focus:border-heading/40"
                  placeholder="Your name"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-heading">Email</span>
                <input
                  type="email"
                  required
                  maxLength={200}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-heading/15 bg-cream px-3.5 py-2.5 text-sm text-body-text outline-none focus:border-heading/40"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-heading">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-heading/15 bg-cream px-3.5 py-2.5 text-sm text-body-text outline-none focus:border-heading/40"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-heading">Message</span>
              <textarea
                required
                maxLength={5000}
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-lg border border-heading/15 bg-cream px-3.5 py-2.5 text-sm text-body-text outline-none focus:border-heading/40 resize-none"
                placeholder="What's going on?"
              />
            </label>

            {status === 'error' && (
              <div className="flex items-start gap-2.5 rounded-lg border border-wrong/20 bg-wrong/5 px-3.5 py-3">
                <CircleAlert className="h-4 w-4 text-wrong shrink-0 mt-0.5" />
                <p className="text-sm text-body-text">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="self-start text-sm font-semibold px-5 py-2.5 rounded-lg bg-heading text-cream hover:bg-heading/90 transition-colors disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}

export default Contact
