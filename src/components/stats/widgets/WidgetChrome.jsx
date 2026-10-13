export function WidgetCard({ title, children }) {
  return (
    <div className="my-8 rounded-2xl border border-heading/10 bg-surface p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-accent-dark">Explore · {title}</p>
      {children}
    </div>
  )
}

export function Slider({ label, value, onChange, min, max, step = 1, format = (v) => v }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-heading">{label}</span>
        <span className="font-mono text-xs text-body-text">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-heading/10 accent-primary-accent"
      />
    </label>
  )
}

export function ModeTabs({ options, value, onChange }) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
            value === opt.value
              ? 'border-primary-accent bg-badge text-heading'
              : 'border-heading/10 text-body-text hover:bg-heading/5 hover:text-heading'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-heading/10 bg-cream px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-caption">{label}</p>
      <p className="font-mono text-lg font-semibold text-heading">{value}</p>
    </div>
  )
}
