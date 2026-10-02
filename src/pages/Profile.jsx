import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { lessons, allProjects } from '../data/lessons'
import { pyLessons } from '../data/python/index.js'
import { gitLessons } from '../data/git/index.js'
import { computeBadges, computeGitBadges, computePythonBadges } from '../lib/badges'
import {
  ArrowLeft,
  Award,
  Check,
  CodeIcon,
  Database,
  Folder,
  GitBranch,
  Lock,
  Pencil,
  Sparkles,
  Trophy,
  UserIcon,
} from '../components/icons'

const badgeIcons = { award: Award, check: Check, sparkles: Sparkles, trophy: Trophy, folder: Folder }

const SNAPSHOTS = [
  { subject: 'sql', label: 'SQL', icon: Database, color: '#cfe3f5', iconColor: '#2f6f9e', lessons },
  { subject: 'python', label: 'Python', icon: CodeIcon, color: '#dcead9', iconColor: '#3f7a4d', lessons: pyLessons },
  { subject: 'git', label: 'Git', icon: GitBranch, color: '#f6dccb', iconColor: '#a05a2c', lessons: gitLessons },
  { subject: 'sql-projects', label: 'SQL projects', icon: Folder, color: '#f5d3d3', iconColor: '#9e4a4a', lessons: allProjects },
]

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
  const displayName = getDisplayName(session)

  const snapshots = SNAPSHOTS.map((s) => {
    const total = s.lessons.length
    const completedCount = s.lessons.filter((l) => completedIds.has(l.id)).length
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0
    return { ...s, total, completedCount, percent }
  })

  const badgeGroups = [
    { subject: 'sql', label: 'SQL', badges: computeBadges(completedIds) },
    { subject: 'python', label: 'Python', badges: computePythonBadges(completedIds) },
    { subject: 'git', label: 'Git', badges: computeGitBadges(completedIds) },
  ]
  const earnedCount = badgeGroups.reduce((sum, g) => sum + g.badges.filter((b) => b.earned).length, 0)
  const totalBadges = badgeGroups.reduce((sum, g) => sum + g.badges.length, 0)

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
              <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-3">Your profile</p>
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

      <section className="max-w-4xl mx-auto px-8 py-14 flex flex-col gap-6">
        <div className="bg-surface rounded-2xl border border-heading/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-2">Account</p>
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
          <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-4">Learning snapshot</p>

          <div className="flex flex-col gap-4">
            {snapshots.map((s) => {
              const isProjects = s.subject === 'sql-projects'
              return (
                <div key={s.subject} className="rounded-xl bg-cream p-4">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-display font-semibold text-3xl text-heading">{s.percent}%</p>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: s.color, color: s.iconColor }}
                    >
                      <s.icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="text-sm text-caption mb-3">{isProjects ? s.label : `${s.label} path complete`}</p>

                  <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
                    <div className="h-full bg-heading rounded-full transition-[width]" style={{ width: `${s.percent}%` }} />
                  </div>

                  <p className="mt-3 text-xs text-caption">
                    {s.completedCount} of {s.total} {isProjects ? 'project' : 'lesson'}
                    {s.total === 1 ? '' : 's'} completed
                  </p>

                  {isProjects && (
                    <ul className="mt-3 flex flex-col gap-1.5 border-t border-heading/10 pt-3">
                      {allProjects.map((project) => {
                        const done = completedIds.has(project.id)
                        return (
                          <li key={project.id} className="flex items-center gap-2 text-xs text-body-text">
                            {done ? (
                              <Check className="h-3 w-3 shrink-0 text-correct" />
                            ) : (
                              <Lock className="h-3 w-3 shrink-0 text-placeholder" />
                            )}
                            <span className={done ? 'text-heading' : ''}>{project.title}</span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-surface rounded-2xl border border-heading/10 p-6">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-2">Badges</p>
              <h2 className="text-xl font-semibold text-heading">Your achievements</h2>
            </div>
            <p className="text-sm text-caption">
              {earnedCount} of {totalBadges} earned
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {badgeGroups.map((group) => (
              <div key={group.subject}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-heading">{group.label}</p>
                  <p className="text-xs text-caption">
                    {group.badges.filter((b) => b.earned).length} of {group.badges.length} earned
                  </p>
                </div>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {group.badges.map((badge) => {
                    const Icon = badgeIcons[badge.icon] || Award
                    const [have, need] = badge.progress
                    return (
                      <li
                        key={badge.id}
                        data-badge={badge.id}
                        data-earned={badge.earned}
                        className={`rounded-xl border p-4 flex flex-col gap-2 ${
                          badge.earned ? 'border-heading/15 bg-cream' : 'border-heading/10 bg-cream/50'
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            badge.earned ? 'text-[#1c1c1a]' : 'bg-heading/5 text-caption'
                          }`}
                          style={badge.earned ? { backgroundColor: badge.color || '#f6dfb0' } : undefined}
                        >
                          {badge.earned ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                        </span>
                        <div>
                          <p className={`text-sm font-semibold ${badge.earned ? 'text-heading' : 'text-body-text'}`}>{badge.title}</p>
                          <p className="text-xs text-caption mt-0.5">{badge.description}</p>
                        </div>
                        {badge.earned ? (
                          <p className="text-xs font-semibold text-correct mt-auto">Earned</p>
                        ) : (
                          <p className="text-xs text-caption mt-auto">
                            {have} / {need}
                          </p>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile
