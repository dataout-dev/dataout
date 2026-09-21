import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { availablePlaygrounds } from '../data/playgrounds'
import { ChevronDown } from './icons'

const learnItems = [{ label: 'SQL', to: '/learn/sql' }]
const playgroundItems = availablePlaygrounds.map((p) => ({ label: p.name, to: p.path }))

// A nav link that opens a small menu on hover or keyboard focus. The label itself still links
// to the section's overview page.
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

function Layout() {
  const { session } = useAuth()

  return (
    <div className="min-h-screen bg-cream">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-heading/10">
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
        </div>

        <div className="flex items-center gap-4">
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
      </nav>
      <Outlet />
    </div>
  )
}

export default Layout
