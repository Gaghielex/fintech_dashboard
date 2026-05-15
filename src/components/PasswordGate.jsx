import { useCallback, useState } from 'react'
import { AUTH_STORAGE_KEY } from '../utils/storageKeys.js'

/**
 * Client-side gate (PRD): deterrent only; password from VITE_APP_PASSWORD.
 * @param {{ children: import('react').ReactNode }} props
 */
export function PasswordGate({ children }) {
  const expected = import.meta.env.VITE_APP_PASSWORD

  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState(/** @type {string | null} */ (null))

  const submit = useCallback(
    (e) => {
      e.preventDefault()
      setFormError(null)

      if (!expected || expected === 'choose_a_password_here') {
        setFormError('App password is not configured (VITE_APP_PASSWORD).')
        return
      }

      if (password === expected) {
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, '1')
        } catch {
          /* private mode / blocked storage */
        }
        setUnlocked(true)
        return
      }

      setFormError('Incorrect password.')
      setPassword('')
    },
    [expected, password],
  )

  if (unlocked) {
    return children
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 py-12">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-surface p-6 shadow-lg">
        <div className="space-y-1 text-center">
          <h1 className="font-syne text-2xl font-extrabold tracking-tight text-ink">
            Household
          </h1>
          <p className="font-dm-sans text-sm text-ink-muted">
            Enter the shared password to continue.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-2">
            <span className="font-dm-sans text-xs font-medium uppercase tracking-wide text-ink-muted">
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="font-dm-mono w-full rounded-lg border border-border bg-surface-1 px-3 py-2.5 text-sm text-ink outline-none ring-primary/40 placeholder:text-ink-faint focus:border-primary focus:ring-2"
              placeholder="••••••••"
            />
          </label>

          {formError ? (
            <p className="font-dm-sans text-sm text-negative" role="alert">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            className="font-dm-sans w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-canvas transition hover:opacity-90"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
