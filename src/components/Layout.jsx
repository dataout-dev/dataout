import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { availablePlaygrounds } from '../data/playgrounds'
import { availableExerciseSubjects } from '../data/exerciseSubjects'
import { ChevronDown, Menu, X } from './icons'

const learnItems = [{ label: 'SQL', to: '/learn/sql' }]
const playgroundItems = availablePlaygrounds.map((p) => ({ label: p.name, to: p.path }))
const exerciseItems = availableExerciseSubjects.map((s) => ({ label: s.name, to: s.path }))

function NavDropdown({ label, to, items }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
    >
      <Link to={to} className="flex items-center gap-1 text-body-text text-sm hover:text-heading transition-colors">
        {label}
        <ChevronDown className="h-3.5 w-3.5" />
      </Link>

      {open && (
        <div className="absolute left-0 top-full pt-2 z-30">
          <div className="bg-surface border border-heading/10 rounded-xl shadow-sm py-1.5 min-w-[130px]">
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block px-4 py-2 text-sm text-body-text hover:bg-heading/5 hover:text-heading transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileMenu({ session, onNavigate }) {
  const row = 'block rounded-lg px-3 py-2.5 text-sm text-body-text hover:bg-heading/5 hover:text-heading transition-colors'
  const subRow = 'block rounded-lg py-2 pl-8 pr-3 text-sm text-caption hover:bg-heading/5 hover:text-heading transition-colors'

  return (
    <div id="mobile-menu" className="md:hidden absolute inset-x-0 top-full z-40 border-b border-heading/10 bg-cream shadow-sm">
      <div className="flex flex-col gap-0.5 px-4 py-3">
        <Link to="/" className={row} onClick={onNavigate}>Home</Link>
        <Link to="/learn" className={row} onClick={onNavigate}>Learn</Link>
        {learnItems.map((item) => (
          <Link key={item.to} to={item.to} className={subRow} onClick={onNavigate}>{item.label}</Link>
        ))}
        <Link to="/playground" className={row} onClick={onNavigate}>Playground</Link>
        {playgroundItems.map((item) => (
          <Link key={item.to} to={item.to} className={subRow} onClick={onNavigate}>{item.label}</Link>
        ))}
        <Link to="/exercise" className={row} onClick={onNavigate}>Exercise</Link>
        {exerciseItems.map((item) => (
          <Link key={item.to} to={item.to} className={subRow} onClick={onNavigate}>{item.label}</Link>
        ))}
        <Link to="/settings" className={row} onClick={onNavigate}>Settings</Link>

        <div className="my-2 h-px bg-heading/10" />

        {session ? (
          <>
            <Link to="/profile" className={row} onClick={onNavigate}>Profile</Link>
            <button
              onClick={() => {
                onNavigate()
                supabase.auth.signOut()
              }}
              className="mt-1 rounded-lg border border-heading/15 px-3 py-2.5 text-left text-sm font-medium text-heading hover:bg-heading/5 transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              to="/login"
              onClick={onNavigate}
              className="rounded-lg border border-heading/15 px-4 py-2.5 text-center text-sm font-medium text-heading hover:bg-heading/5 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              onClick={onNavigate}
              className="rounded-lg bg-heading px-4 py-2.5 text-center text-sm font-semibold text-cream hover:bg-heading/90 transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function Layout() {
  const { session } = useAuth()
  const { pathname } = useLocation()
  const [openOn, setOpenOn] = useState(null)
  const menuOpen = openOn === pathname

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenOn(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-cream">
      <nav className="relative flex items-center justify-between px-4 py-4 sm:px-8 border-b border-heading/10">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-heading text-cream text-xs font-semibold font-display">
            do
          </span>
          <span className="font-display font-semibold text-heading text-lg">DataOut</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-body-text text-sm hover:text-heading transition-colors">Home</Link>
          <NavDropdown label="Learn" to="/learn" items={learnItems} />
          <NavDropdown label="Playground" to="/playground" items={playgroundItems} />
          <NavDropdown label="Exercise" to="/exercise" items={exerciseItems} />
        </div>

        <button
          type="button"
          onClick={() => setOpenOn(menuOpen ? null : pathname)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-heading hover:bg-heading/5 transition-colors"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/settings" className="text-body-text text-sm hover:text-heading transition-colors">Settings</Link>
          {session ? (
            <>
              <Link to="/profile" className="text-body-text text-sm hover:text-heading transition-colors">Profile</Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-sm font-medium text-heading px-4 py-2 border border-heading/15 rounded-lg hover:bg-heading/5 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-body-text text-sm hover:text-heading transition-colors">Log in</Link>
              <Link
                to="/signup"
                className="text-sm font-semibold px-4 py-2.5 rounded-lg bg-heading text-cream hover:bg-heading/90 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {menuOpen && <MobileMenu session={session} onNavigate={() => setOpenOn(null)} />}
      </nav>
      <Outlet />
    </div>
  )
}

export default Layout
