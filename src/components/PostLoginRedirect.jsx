import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { takeRedirect } from '../lib/postLoginRedirect'

function PostLoginRedirect() {
  const { session } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!session || pathname === '/login' || pathname === '/signup') return
    const to = takeRedirect()
    if (to && to !== pathname) navigate(to, { replace: true })
  }, [session, pathname, navigate])

  return null
}

export default PostLoginRedirect
