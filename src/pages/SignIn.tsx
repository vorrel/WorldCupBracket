import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export function SignInPage() {
  const { session, loading, signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) navigate('/groups', { replace: true })
  }, [session, navigate])

  if (loading) return <div className="p-12 text-center text-neutral-500">Loading…</div>
  if (session) return <Navigate to="/groups" replace />

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pitch-100 to-white dark:from-pitch-950 dark:to-neutral-950">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">⚽</div>
          <h1 className="font-display text-2xl font-bold">World Cup 2026</h1>
          <p className="text-sm text-neutral-500 mt-1">Pick your bracket. Watch your friends miss theirs.</p>
        </div>

        {sent ? (
          <div className="text-center space-y-3">
            <div className="text-2xl">📬</div>
            <p className="font-medium">Check your inbox</p>
            <p className="text-sm text-neutral-500">
              We sent a magic link to <span className="font-mono">{email}</span>.
              Click it to sign in.
            </p>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setSubmitting(true)
              setError(null)
              const { error } = await signInWithEmail(email.trim())
              setSubmitting(false)
              if (error) setError(error.message)
              else setSent(true)
            }}
            className="space-y-3"
          >
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 focus:ring-2 focus:ring-pitch-500 focus:border-pitch-500 outline-none"
              />
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={submitting || !email}
              className="w-full py-2 rounded-lg bg-pitch-600 hover:bg-pitch-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
