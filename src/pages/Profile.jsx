import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { lessons } from '../data/lessons'
import { ArrowLeft, Database, Pencil, UserIcon } from '../components/icons'

function getDisplayName(session) {
  const meta = session?.user?.user_metadata || {}
  return meta.display_name || meta.full_name || meta.name || meta.user_name || session?.user?.email || 'there'
}

function Profile() {
  const { session } = useAuth()
  const [progress, setProgress] = useState([])
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (!session) return

    setName(getDisplayName(session))

    async function fetchProgress() {
      const { data, error } = await supabase.from('progress').select('*')
      if (error) {
        console.error('Error fetching progress:', error)
      } else {
        setProgress(data)
      }
    }

    fetchProgress()
  }, [session])

  if (!session) return null

  const completedIds = new Set(progress.map((row) => row.lesson_id))
  const sqlLessons = lessons.filter((l) => l.subject === 'sql')
  const completedCount = sqlLessons.filter((l) => completedIds.has(l.id)).length
  const total = sqlLessons.length
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0
  const displayName = getDisplayName(session)

  const handleSaveName = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setNameError('Name cannot be empty.')
      return
    }
    setSaving(true)
    setNameError('')
    const { error } = await supabase.auth.updateUser({ data: { display_name: trimmed } })
    setSaving(false)
    if (error) {
      setNameError(error.message)
    } else {
      setEditing(false)
    }
  }

  const handleCancel = () => {
    setName(displayName)
    setNameError('')
    setEditing(false)
  }

  return (
    <div className="bg-cream min-h-screen">
      <section className="relative overflow-hidden border-b border-heading/10">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-8 pt-10 pb-16">
          <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-caption hover:text-heading transition-colors mb-10">
            <ArrowLeft className="h-4 w-4" /> Back to learning
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-primary-accent tracking-widest uppercase mb-3">Your profile</p>
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-heading leading-[1.1] mb-3">
                Keep going, {displayName}.
              </h1>
              <p className="text-body-text max-w-md">
                Your progress is saved here so you can pick up right where you left off.
              </p>
            </div>
            <span className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-heading/10 text-heading shrink-0">
              <UserIcon className="h-6 w-6" />
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-8 py-14 flex flex-col gap-6">
        <div className="bg-surface rounded-2xl border border-heading/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-primary-accent tracking-widest uppercase mb-2">Account</p>
              <h2 className="text-xl font-semibold text-heading">Your details</h2>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-heading">
              <UserIcon className="h-5 w-5" />
            </span>
          </div>

          <label className="block text-sm font-medium text-heading mb-2">Name</label>

          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                autoFocus
                className="flex-1 rounded-xl border border-heading/10 bg-cream px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent/30"
              />
              <button
                onClick={handleSaveName}
                disabled={saving}
                className="text-sm font-semibold text-cream bg-heading rounded-lg px-4 py-3 hover:bg-heading/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="text-sm font-medium text-caption px-3 py-3 hover:text-heading transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-cream rounded-xl pl-4 pr-2 py-2">
              <span className="text-sm text-heading">{displayName}</span>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-heading px-3 py-2 rounded-lg hover:bg-heading/5 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" /> Change
              </button>
            </div>
          )}

          {nameError && <p className="mt-2 text-sm text-wrong">{nameError}</p>}

          <p className="mt-3 text-xs text-caption">Use the name you want to see across your learning space.</p>
        </div>

        <div className="bg-surface rounded-2xl border border-heading/10 p-6">
          <p className="text-xs font-semibold text-primary-accent tracking-widest uppercase mb-4">Learning snapshot</p>

          <div className="flex items-start justify-between mb-1">
            <p className="font-display font-semibold text-4xl text-heading">{percent}%</p>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#cfe3f5] text-[#2f6f9e]">
              <Database className="h-4 w-4" />
            </span>
          </div>
          <p className="text-sm text-caption mb-4">SQL path complete</p>

          <div className="h-2 w-full rounded-full bg-cream overflow-hidden">
            <div className="h-full bg-heading rounded-full transition-[width]" style={{ width: `${percent}%` }} />
          </div>

          <p className="mt-3 text-xs text-caption">
            {completedCount} of {total} lesson{total === 1 ? '' : 's'} completed
          </p>
        </div>
      </section>
    </div>
  )
}

export default Profile
