const STORAGE_KEY = 'dataout-exercises-v1'

function readAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

export const emptyProgress = { attempts: 0, solved: false, revealed: false, draft: '' }

export function loadExerciseProgress(exerciseId) {
  const saved = readAll()[exerciseId]
  return {
    attempts: Number.isInteger(saved?.attempts) ? saved.attempts : 0,
    solved: saved?.solved === true,
    revealed: saved?.revealed === true,
    draft: typeof saved?.draft === 'string' ? saved.draft.slice(0, 20000) : '',
  }
}

export function saveExerciseProgress(exerciseId, progress) {
  try {
    const all = readAll()
    all[exerciseId] = progress
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
  }
}

export const ATTEMPTS_TO_GIVE_UP = 3
