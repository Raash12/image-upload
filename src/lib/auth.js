const AUTH_KEY = 'gallery-admin-session'

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
}

export function login(username, password) {
  const isValid =
    username.trim() === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password

  if (!isValid) return null

  const session = { username: ADMIN_CREDENTIALS.username, role: 'admin' }
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(session))
  return session
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY)
}

export function getSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    return session?.role === 'admin' ? session : null
  } catch {
    return null
  }
}

export function isAdmin(session) {
  return session?.role === 'admin'
}
