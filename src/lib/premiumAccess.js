import { premiumContent } from '../data/premiumConfig'

// Whether a piece of content is categorized as premium at all, regardless of
// whether the viewer currently has access to it — used to show a "Premium"
// badge even on content that's still structurally locked (not reached yet).
export function isPremiumKey(key) {
  return premiumContent[key] === 1
}

// Content is premium-locked only when the static config flags it AND the
// current user has no active subscription.
export function isPremiumKeyLocked(key, hasActiveSubscription) {
  if (hasActiveSubscription) return false
  return isPremiumKey(key)
}

export const sqlTierKey = (tierId) => `sql:tier:${tierId}`
export const sqlProjectKey = (projectId) => `sql:project:${projectId}`
export const pythonTierKey = (tierId) => `python:tier:${tierId}`
export const gitTierKey = (tierId) => `git:tier:${tierId}`
export const statsTierKey = (tierId) => `stats:tier:${tierId}`
