import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../lib/useSubscription'
import { ArrowLeft, Sparkles, CircleAlert, CircleCheck, Check, Award } from '../components/icons'

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

// half_yearly works out to the lowest per-month cost of the three (₹499 / 6 ≈
// ₹83/mo, vs ₹99/mo and ₹1099/12 ≈ ₹92/mo) — that's why it carries the
// "Best value" ribbon rather than the yearly plan.
const TIERS = [
  {
    key: 'monthly',
    label: 'Monthly',
    price: '₹99',
    note: 'per month',
  },
  {
    key: 'half_yearly',
    label: '6 months',
    price: '₹499',
    note: 'every 6 months',
    perMonth: '≈ ₹83 / month',
    highlight: true,
  },
  {
    key: 'yearly',
    label: '12 months',
    price: '₹1099',
    note: 'per year',
    perMonth: '≈ ₹92 / month',
  },
]

const INCLUDED = [
  'Every Expert-level tier and lesson across SQL, Python, and Git',
  'All SQL capstone projects — guided and unguided',
  'Jump straight to any lesson or tier, free or premium, without finishing earlier ones first',
  'Any new premium content we add later, at no extra cost',
]

const COMING_LATER = [
  'Guided and unguided capstone projects for Python and Git',
  'Real competition quests — timed challenges on real datasets',
]

// An ad blocker or Brave's Shields (on by default, every site) commonly blocks
// checkout.razorpay.com outright — the <script> tag never fires load or error,
// it just silently never resolves. A timeout is the only way to detect that.
const SCRIPT_TIMEOUT_MS = 6000

function useRazorpayScript() {
  const [status, setStatus] = useState(() => (window.Razorpay ? 'ready' : 'loading'))

  useEffect(() => {
    if (window.Razorpay) {
      setStatus('ready')
      return
    }

    const timer = setTimeout(() => setStatus((s) => (s === 'ready' ? s : 'blocked')), SCRIPT_TIMEOUT_MS)

    const existing = document.querySelector(`script[src="${CHECKOUT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => setStatus('ready'))
      existing.addEventListener('error', () => setStatus('blocked'))
      return () => clearTimeout(timer)
    }

    const script = document.createElement('script')
    script.src = CHECKOUT_SRC
    script.async = true
    script.onload = () => setStatus('ready')
    script.onerror = () => setStatus('blocked')
    document.body.appendChild(script)

    return () => clearTimeout(timer)
  }, [])

  return status
}

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

function formatDate(value) {
  if (!value) return null
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

function Subscribe() {
  const { session } = useAuth()
  const { subscription, isActive, loaded } = useSubscription()
  const razorpayStatus = useRazorpayScript()
  const razorpayReady = razorpayStatus === 'ready'
  const razorpayBlocked = razorpayStatus === 'blocked'
  const [busyTier, setBusyTier] = useState(null)
  const [error, setError] = useState('')
  const [activating, setActivating] = useState(false)
  const pollRef = useRef(null)

  useEffect(() => () => clearInterval(pollRef.current), [])

  const pollForActivation = () => {
    setActivating(true)
    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts += 1
      const { data } = await supabase.from('subscriptions').select('status').eq('user_id', session.user.id).maybeSingle()
      if (data?.status === 'active' || attempts >= 10) {
        clearInterval(pollRef.current)
        setActivating(false)
        if (data?.status === 'active') {
          window.location.reload()
        } else {
          setBusyTier(null)
          setError("We couldn't confirm your payment yet. If money was deducted, reload this page in a minute — it can take a little longer to confirm.")
        }
      }
    }, 2000)
  }

  const subscribeNow = async (tierKey) => {
    setError('')
    setBusyTier(tierKey)
    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-razorpay-subscription', {
        body: { tier: tierKey },
      })
      if (fnError) throw fnError
      const rzp = new window.Razorpay({
        key: data.key_id,
        subscription_id: data.subscription_id,
        name: 'DataOut',
        description: 'DataOut subscription',
        prefill: { email: session.user.email },
        theme: { color: '#1c1c1a' },
        handler: () => pollForActivation(),
        modal: { ondismiss: () => setBusyTier(null) },
      })
      rzp.open()
    } catch (err) {
      setError(await describeFunctionError(err))
      setBusyTier(null)
    }
  }

  const cancelNow = async () => {
    setError('')
    setBusyTier('cancel')
    try {
      const { error: fnError } = await supabase.functions.invoke('cancel-razorpay-subscription')
      if (fnError) throw fnError
      window.location.reload()
    } catch (err) {
      setError(await describeFunctionError(err))
      setBusyTier(null)
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
              <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-3">Subscription</p>
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-heading leading-[1.1] mb-3">
                Unlock the full path.
              </h1>
              <p className="text-body-text max-w-md">Expert-tier lessons and capstone projects, across SQL, Python, and Git.</p>
            </div>
            <span className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-badge text-accent-dark shrink-0">
              <Sparkles className="h-6 w-6" />
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 py-14 flex flex-col gap-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-heading/10 bg-surface p-6">
            <p className="mb-4 text-xs font-semibold text-accent-dark tracking-widest uppercase">What's included</p>
            <ul className="flex flex-col gap-3 text-sm text-body-text">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-correct/10 text-correct shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-primary-accent/25 bg-badge/40 p-6">
            <p className="mb-4 text-xs font-semibold text-accent-dark tracking-widest uppercase">Coming later</p>
            <ul className="flex flex-col gap-3 text-sm text-body-text">
              {COMING_LATER.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-accent-dark shrink-0 mt-0.5">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-caption">Included in your subscription automatically once they ship — no separate purchase.</p>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-wrong/20 bg-wrong/5 p-5">
            <CircleAlert className="h-5 w-5 text-wrong shrink-0" />
            <p className="text-sm text-body-text">{error}</p>
          </div>
        )}

        {razorpayBlocked && (
          <div className="flex items-start gap-3 rounded-2xl border border-wrong/20 bg-wrong/5 p-5">
            <CircleAlert className="h-5 w-5 text-wrong shrink-0" />
            <p className="text-sm text-body-text">
              An ad blocker or privacy extension (including Brave's Shields, which is on by default) is blocking the
              checkout script. Please disable it for this site and reload the page to subscribe.
            </p>
          </div>
        )}

        {!loaded && <p className="text-sm text-caption">Loading…</p>}

        {loaded && isActive && subscription.cancel_requested && (
          <div className="bg-badge/40 rounded-2xl border border-primary-accent/25 p-6 max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-accent-dark shrink-0">
                <CircleCheck className="h-5 w-5" />
              </span>
              <p className="font-semibold text-heading">Your subscription is ending.</p>
            </div>
            <p className="text-sm text-body-text">
              {subscription.current_end
                ? `You'll keep full access until ${formatDate(subscription.current_end)}.`
                : "You'll keep access until the end of your current billing period."}
            </p>
          </div>
        )}

        {loaded && isActive && !subscription.cancel_requested && (
          <div className="bg-correct/5 rounded-2xl border border-correct/20 p-6 max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-correct/10 text-correct shrink-0">
                <CircleCheck className="h-5 w-5" />
              </span>
              <p className="font-semibold text-heading">You're subscribed.</p>
            </div>
            {subscription.current_end && (
              <p className="text-sm text-body-text mb-6">Renews on {formatDate(subscription.current_end)}.</p>
            )}
            <button
              type="button"
              onClick={cancelNow}
              disabled={busyTier === 'cancel'}
              className="rounded-lg border border-heading/15 px-4 py-2.5 text-sm font-semibold text-heading transition-colors hover:bg-heading/5 disabled:opacity-50"
            >
              {busyTier === 'cancel' ? 'Cancelling…' : 'Cancel subscription'}
            </button>
            {subscription.current_end && (
              <p className="mt-3 text-xs text-caption">You'll keep access until {formatDate(subscription.current_end)}.</p>
            )}
          </div>
        )}

        {loaded && !isActive && (
          <>
            {subscription.status === 'cancelled' && (
              <p className="text-sm text-caption">Your previous subscription was cancelled.</p>
            )}
            <div className="grid sm:grid-cols-3 gap-4">
              {TIERS.map((t) => (
                <div
                  key={t.key}
                  className={`relative bg-surface rounded-2xl border p-6 flex flex-col ${
                    t.highlight ? 'border-primary-accent ring-2 ring-primary-accent/15' : 'border-heading/10'
                  }`}
                >
                  {t.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-primary-accent text-cream text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
                      <Award className="h-3 w-3" /> Best value
                    </span>
                  )}
                  <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-3">{t.label}</p>
                  <p className="font-display text-3xl font-semibold text-heading mb-1">{t.price}</p>
                  <p className="text-sm text-body-text mb-1">{t.note}</p>
                  <p className="text-xs text-caption mb-6 flex-1">{t.perMonth ?? ' '}</p>
                  <button
                    type="button"
                    onClick={() => subscribeNow(t.key)}
                    disabled={Boolean(busyTier) || activating || !razorpayReady}
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
                      t.highlight
                        ? 'bg-primary-accent text-cream hover:bg-accent-dark'
                        : 'bg-heading text-cream hover:bg-heading/90'
                    }`}
                  >
                    {activating ? 'Activating…' : busyTier === t.key ? 'Opening checkout…' : 'Subscribe'}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-caption">Cancel anytime. You'll keep access until the end of the billing period you've paid for.</p>
          </>
        )}
      </section>
    </div>
  )
}

export default Subscribe
