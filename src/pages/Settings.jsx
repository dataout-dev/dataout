import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { ArrowLeft, Gear, ChevronDown } from '../components/icons'

function SpecialTag() {
  return (
    <span className="rounded-full border border-primary-accent/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-heading">
      Special edition
    </span>
  )
}

function Settings() {
  const { theme, setTheme, themes } = useTheme()
  const activeTheme = themes.find((t) => t.id === theme) || themes[0]

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
              <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-3">Preferences</p>
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-heading leading-[1.1] mb-3">
                Make it yours.
              </h1>
              <p className="text-body-text max-w-md">
                Settings here apply to this browser, so you can tune the look of DataOut to your taste.
              </p>
            </div>
            <span className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-heading/10 text-heading shrink-0">
              <Gear className="h-6 w-6" />
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-8 py-14 flex flex-col gap-6">
        <div className="bg-surface rounded-2xl border border-heading/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-accent-dark tracking-widest uppercase mb-2">Appearance</p>
              <h2 className="text-xl font-semibold text-heading">Theme</h2>
            </div>
            <div className="flex items-center gap-1.5">
              {activeTheme.swatches.map((color, i) => (
                <span
                  key={i}
                  className="h-5 w-5 rounded-full border border-heading/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <label className="block text-sm font-medium text-heading mb-2">Choose a theme</label>
          <div className="relative">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full appearance-none rounded-xl border border-heading/10 bg-cream px-4 py-3 pr-11 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary-accent/30"
            >
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.special ? `${t.name} (special edition)` : t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-caption" />
          </div>

          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-body-text">
            {activeTheme.special && <SpecialTag />}
            {activeTheme.description}
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  t.id === theme ? 'border-primary-accent bg-badge' : 'border-heading/10 hover:bg-heading/[0.02]'
                }`}
              >
                <span className="flex shrink-0 -space-x-1.5">
                  {t.swatches.map((color, i) => (
                    <span
                      key={i}
                      className="h-6 w-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <span>
                  <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-heading">
                    {t.name}
                    {t.special && <SpecialTag />}
                  </span>
                  <span className="block text-xs text-caption">{t.description}</span>
                </span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs text-caption">
            Your theme is saved on this device and applies the next time you visit.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Settings
