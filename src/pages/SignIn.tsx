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

  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>
  if (session) return <Navigate to="/groups" replace />

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/15 to-background">
      <div className="w-full max-w-md bg-card text-card-foreground border border-border rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">⚽</div>
          <h1 className="font-display text-2xl font-bold">World Cup 2026</h1>
          <p className="text-sm text-muted-foreground mt-1">Pick your bracket. Watch your friends miss theirs.</p>
        </div>

        {sent ? (
          <div className="text-center space-y-3">
            <div className="text-2xl">📬</div>
            <p className="font-medium">Check your inbox</p>
            <p className="text-sm text-muted-foreground">
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
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none"
              />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={submitting || !email}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
