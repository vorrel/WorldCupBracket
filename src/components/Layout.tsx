import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
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

function MobileNavLink({
  to,
  onClick,
  children,
}: {
  to: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium block ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
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
  const location = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!session) { setIsAdmin(false); return }
    supabase.from('admin_emails').select('email').limit(1).then(({ data }) => {
      setIsAdmin((data?.length ?? 0) > 0)
    })
  }, [session])

  // Auto-close the mobile drawer whenever the route changes,
  // including clicks on links inside the drawer itself.
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="font-display font-bold text-lg flex items-center gap-2 shrink-0"
          >
            <span className="text-primary">⚽</span>
            <span className="hidden sm:inline">WC26 Bracket</span>
            <span className="sm:hidden">WC26</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-1 flex-1 ml-4">
            <NavTab to="/leaderboard">Leaderboard</NavTab>
            {session && <NavTab to="/groups">Groups</NavTab>}
            {session && <NavTab to="/bracket">Bracket</NavTab>}
            {isAdmin && <NavTab to="/admin">Admin</NavTab>}
          </nav>

          {/* Spacer to push the right cluster to the edge on mobile */}
          <div className="flex-1 md:hidden" />

          <ThemeToggle />

          {/* Desktop user controls */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            {session ? (
              <>
                <NavLink
                  to="/profile"
                  className="text-muted-foreground hover:underline truncate max-w-[200px]"
                >
                  {session.user.email}
                </NavLink>
                <button
                  onClick={async () => { await signOut(); navigate('/sign-in') }}
                  className="px-2 py-1 text-muted-foreground hover:text-foreground shrink-0"
                >
                  Sign out
                </button>
              </>
            ) : (
              <NavLink
                to="/sign-in"
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium shrink-0"
              >
                Sign in
              </NavLink>
            )}
          </div>

          {/* Hamburger — visible only on mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition"
          >
            {menuOpen ? (
              // X
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="max-w-screen-2xl mx-auto px-4 py-3 flex flex-col gap-1">
              <MobileNavLink to="/leaderboard" onClick={closeMenu}>Leaderboard</MobileNavLink>
              {session && <MobileNavLink to="/groups" onClick={closeMenu}>Groups</MobileNavLink>}
              {session && <MobileNavLink to="/bracket" onClick={closeMenu}>Bracket</MobileNavLink>}
              {isAdmin && <MobileNavLink to="/admin" onClick={closeMenu}>Admin</MobileNavLink>}

              <hr className="my-2 border-border" />

              {session ? (
                <>
                  <MobileNavLink to="/profile" onClick={closeMenu}>
                    <span className="block truncate">{session.user.email}</span>
                  </MobileNavLink>
                  <button
                    onClick={async () => { closeMenu(); await signOut(); navigate('/sign-in') }}
                    className="text-left px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <MobileNavLink to="/sign-in" onClick={closeMenu}>Sign in</MobileNavLink>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-6 min-w-0">
        <Outlet />
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground px-4">
        FIFA World Cup 2026 — picks lock at each match's kickoff.
      </footer>
    </div>
  )
}
