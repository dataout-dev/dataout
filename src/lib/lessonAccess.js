import { pathIndex, sqlPath } from '../data/curriculum/index.js'

export function isStepUnlocked(id, completedIds) {
  const index = pathIndex(id)
  if (index === -1) return false
  if (completedIds.has(id)) return true
  return sqlPath.slice(0, index).every((step) => completedIds.has(step.id))
}

export function nextStep(completedIds) {
  return sqlPath.find((step) => !completedIds.has(step.id)) ?? null
}
