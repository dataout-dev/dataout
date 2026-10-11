import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

const NONE = { status: 'none' }

export function useSubscription() {
  const { session } = useAuth()
  const userId = session?.user?.id
  const [state, setState] = useState({ userId: null, subscription: NONE, loaded: false })

  useEffect(() => {
    if (!userId) return

    let cancelled = false

    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) console.error('Error fetching subscription:', error)
        setState({ userId, subscription: data ?? NONE, loaded: true })
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  const isCurrent = state.userId === userId
  const subscription = isCurrent ? state.subscription : NONE

  return {
    subscription,
    isActive: subscription.status === 'active',
    loaded: userId ? isCurrent && state.loaded : true,
  }
}
