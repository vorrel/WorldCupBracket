import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { ThemeToggle } from './ThemeToggle'

function NavTab({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1.5 rounded-md text-sm font-medium transition ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export function Layout() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!session) { setIsAdmin(false); return }
    supabase.from('admin_emails').select('email').limit(1).then(({ data }) => {
      setIsAdmin((data?.length ?? 0) > 0)
    })
  }, [session])

  return (
    <div className="min-h-full flex flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="font-display font-bold text-lg mr-4 flex items-center gap-2"
          >
            <span className="text-primary">⚽</span>
            <span>WC26 Bracket</span>
          </button>
          <nav className="flex gap-1 flex-1">
            <NavTab to="/leaderboard">Leaderboard</NavTab>
            {session && <NavTab to="/groups">Groups</NavTab>}
            {session && <NavTab to="/bracket">Bracket</NavTab>}
            {isAdmin && <NavTab to="/admin">Admin</NavTab>}
          </nav>
          <div className="flex items-center gap-2 text-sm">
            <ThemeToggle />
            {session ? (
              <>
                <NavLink to="/profile" className="text-muted-foreground hover:underline">
                  {session.user.email}
                </NavLink>
                <button
                  onClick={async () => { await signOut(); navigate('/sign-in') }}
                  className="px-2 py-1 text-muted-foreground hover:text-foreground"
                >
                  Sign out
                </button>
              </>
            ) : (
              <NavLink
                to="/sign-in"
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium"
              >
                Sign in
              </NavLink>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        FIFA World Cup 2026 — picks lock at each match's kickoff.
      </footer>
    </div>
  )
}
