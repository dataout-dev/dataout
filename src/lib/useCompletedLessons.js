import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

const NONE = new Set()

// Lessons solved during this browser session, so a page that mounts right after a
// solve (before the progress upsert is visible to a fresh read) still sees them.
const solvedThisSession = new Map()

export function useCompletedLessons() {
  const { session } = useAuth()
  const userId = session?.user?.id
  const [progress, setProgress] = useState({ userId: null, ids: NONE, loaded: false })

  useEffect(() => {
    if (!userId) return

    let cancelled = false

    supabase
      .from('progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) console.error('Error fetching progress:', error)

        setProgress((prev) => {
          const ids = new Set(error ? [] : data.map((row) => row.lesson_id))
          solvedThisSession.get(userId)?.forEach((id) => ids.add(id))
          if (prev.userId === userId) prev.ids.forEach((id) => ids.add(id))
          return { userId, ids, loaded: true }
        })
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  const markCompleted = useCallback(
    (lessonId) => {
      if (!userId) return
      if (!solvedThisSession.has(userId)) solvedThisSession.set(userId, new Set())
      solvedThisSession.get(userId).add(lessonId)

      setProgress((prev) => {
        const sameUser = prev.userId === userId
        const ids = new Set(sameUser ? prev.ids : NONE)
        ids.add(lessonId)
        return { userId, ids, loaded: sameUser && prev.loaded }
      })
    },
    [userId]
  )

  const isCurrent = progress.userId === userId

  return {
    completedIds: isCurrent ? progress.ids : NONE,
    loaded: isCurrent && progress.loaded,
    markCompleted,
  }
}
