import { sqlExercises } from '../data/exercises/sql.js'

const banks = {
  sql: sqlExercises,
}

export const EXERCISE_START = '2026-09-24'

const DAY_MS = 24 * 60 * 60 * 1000

export function exercisesFor(subject) {
  return banks[subject] ?? []
}

export function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export function dayNumber(date = new Date()) {
  const start = Date.parse(`${EXERCISE_START}T00:00:00Z`)
  return Math.max(0, Math.floor((date.getTime() - start) / DAY_MS))
}

export function exerciseForDay(subject, day) {
  const bank = exercisesFor(subject)
  return bank.length === 0 ? null : bank[day % bank.length]
}

export function todaysExercise(subject, date = new Date()) {
  return exerciseForDay(subject, dayNumber(date))
}

export function msUntilNextExercise(date = new Date()) {
  const startOfToday = Date.parse(`${dayKey(date)}T00:00:00Z`)
  return startOfToday + DAY_MS - date.getTime()
}

export function formatCountdown(ms) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
}
