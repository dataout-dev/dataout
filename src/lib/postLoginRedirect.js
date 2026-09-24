const KEY = 'dataout:post-login'

export function safePath(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return null
  if (/^\/(login|signup)(\/|\?|#|$)/.test(path)) return null
  return path
}

export function rememberRedirect(path) {
  try {
    sessionStorage.setItem(KEY, path)
  } catch {
  }
}

export function forgetRedirect() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
  }
}

export function takeRedirect() {
  try {
    const path = safePath(sessionStorage.getItem(KEY))
    sessionStorage.removeItem(KEY)
    return path
  } catch {
    return null
  }
}
