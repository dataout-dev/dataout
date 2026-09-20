// src/pages/Signup.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Eye, EyeOff, Mail, GitHubMark, GoogleMark, Sparkles } from '../components/icons'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (session) navigate('/learn')
  }, [session, navigate])

  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/learn` }
    })
  }

  const signInWithGitHub = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/learn` }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/learn`,
        data: { display_name: name }
      }
    })
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email to confirm your account.')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cream">
      <div className="hidden lg:flex flex-col justify-end relative overflow-hidden bg-[#f1e4cd] px-16 py-16">
        <div className="absolute inset-0 bg-grid-plain pointer-events-none" />
        <div className="relative">
          <p className="text-xs font-semibold text-[#e8622c] tracking-widest uppercase mb-4">Coming soon, except SQL</p>
          <h2 className="font-display font-semibold text-5xl text-[#1c1c1a] leading-tight mb-6">
            Start with the skill that compounds.
          </h2>
          <p className="text-[#57534e] max-w-sm">
            A mapped, hands-on path through the tools used in real data teams.
          </p>
        </div>
        <span className="relative mt-10 inline-flex w-fit items-center gap-1.5 bg-surface border border-heading/10 rounded-full pl-2.5 pr-3.5 py-1.5 shadow-sm text-xs font-display italic text-heading">
          <Sparkles className="h-3.5 w-3.5 text-primary-accent" />
          learn by building
        </span>
      </div>

      <div className="flex flex-col px-8 py-10 lg:px-20 lg:py-16">
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center gap-2 text-sm text-caption hover:text-heading transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to DataOut
          </Link>
        </div>

        <div className="max-w-sm mx-auto w-full flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-2.5 mb-9">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-heading text-cream text-xs font-semibold font-display">do</span>
            <span className="font-display font-semibold text-heading text-lg">DataOut</span>
          </div>

          <p className="text-xs font-semibold text-primary-accent tracking-widest uppercase mb-3">Start building</p>
          <h1 className="font-display font-semibold text-4xl text-heading leading-tight mb-3">
            Create your account.
          </h1>
          <p className="text-sm text-body-text mb-8">Join a practical path through SQL, Python, and production data work.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={signInWithGitHub}
              className="flex items-center justify-center gap-2 border border-heading/10 bg-surface rounded-xl py-3 text-sm font-medium text-heading hover:bg-heading/[0.02] transition-colors"
            >
              <GitHubMark className="h-4 w-4" /> GitHub
            </button>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="flex items-center justify-center gap-2 border border-heading/10 bg-surface rounded-xl py-3 text-sm font-medium text-heading hover:bg-heading/[0.02] transition-colors"
            >
              <GoogleMark className="h-4 w-4" /> Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-heading/10" />
            <span className="text-xs text-caption whitespace-nowrap">or continue with email</span>
            <div className="h-px flex-1 bg-heading/10" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-heading/10 bg-surface px-4 py-3 text-sm placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-accent/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-heading/10 bg-surface px-4 py-3 text-sm placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-accent/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  className="w-full rounded-xl border border-heading/10 bg-surface px-4 py-3 pr-11 text-sm placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-accent/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-caption hover:text-heading transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-sm text-body-text">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-heading/20 accent-heading" />
              I agree to the DataOut terms and privacy policy.
            </label>

            {error && <p className="text-sm text-wrong">{error}</p>}
            {message && <p className="text-sm text-body-text">{message}</p>}

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-heading text-cream text-sm font-semibold py-3.5 rounded-xl hover:bg-heading/90 transition-colors"
            >
              Create account
              <Mail className="h-4 w-4" />
            </button>
          </form>

          <p className="text-sm text-caption text-center mt-8">
            Already have an account? <Link to="/login" className="font-semibold text-heading underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
