import { useState } from 'react'
import LoginModal from '@/components/LoginModal'

export default function Navbar({ session, onLogin, onLogout }) {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-sky-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <div className="flex h-12 items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h1 className="text-base font-bold tracking-tight text-sky-700">Asset Gallery</h1>
              <p className="hidden text-xs text-sky-500 sm:block">View, browse and fetch gallery items.</p>
            </div>

            <div className="flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-sky-50 text-sky-700">
                    Admin Session
                  </span>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-sky-300 bg-white px-3 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-50"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-sky-600 px-4 text-xs font-medium text-white transition-colors hover:bg-sky-700 shadow-md hover:shadow-lg"
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={onLogin}
      />
    </>
  )
}