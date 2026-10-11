import { Sparkles } from './icons'

// Shown next to any tier/lesson/project title flagged premium in
// src/data/premiumConfig.js — always visible regardless of whether the
// content is currently locked, available, or already completed, so a learner
// can tell what's paid before they ever reach it.
function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-widest text-[#9e4a4a] bg-[#f5d3d3] rounded-full px-2 py-0.5 uppercase">
      <Sparkles className="h-2.5 w-2.5" /> Premium
    </span>
  )
}

export default PremiumBadge
