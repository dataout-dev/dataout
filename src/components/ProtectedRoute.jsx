import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()
  const [hadSession, setHadSession] = useState(false)

  if (loading) return null
  if (session) {
    if (!hadSession) setHadSession(true)
    return children
  }

  if (hadSession) return <Navigate to="/" replace />

  const from = location.pathname + location.search + location.hash
  return <Navigate to="/login" replace state={{ from }} />
}

export default ProtectedRoute
