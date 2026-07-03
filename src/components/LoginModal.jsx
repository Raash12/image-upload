import { useEffect, useState } from 'react'
import { login } from '@/lib/auth'

export default function LoginModal({ open, onClose, onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    const session = login(username, password)
    if (!session) {
      setError('Invalid admin credentials.')
      return
    }

    setUsername('')
    setPassword('')
    onLogin(session)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-150">
      <button
        type="button"
        aria-label="Close login dialog"
        onClick={onClose}
        className="absolute inset-0 bg-sky-900/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-lg border border-sky-200 bg-white p-6 text-sky-950 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-sky-700">Admin Login</h2>
          <p className="text-sm text-sky-500">Sign in to manage gallery images.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="modal-username" className="text-sm font-medium leading-none text-sky-700">
              Username
            </label>
            <input
              id="modal-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              className="flex h-10 w-full rounded-md border border-sky-300 bg-white px-3 py-2 text-sm text-sky-900 placeholder:text-sky-400 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="modal-password" className="text-sm font-medium leading-none text-sky-700">
              Password
            </label>
            <input
              id="modal-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="flex h-10 w-full rounded-md border border-sky-300 bg-white px-3 py-2 text-sm text-sky-900 placeholder:text-sky-400 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:border-sky-500"
            />
          </div>

          {error && (
            <div className="rounded-md bg-rose-50 p-2.5 text-xs text-rose-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 shadow-md hover:shadow-lg"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}