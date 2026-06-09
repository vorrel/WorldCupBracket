import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { SignInPage } from './pages/SignIn'
import { AuthCallbackPage } from './pages/AuthCallback'
import { GroupsPage } from './pages/Groups'
import { BracketPage } from './pages/Bracket'
import { LeaderboardPage } from './pages/Leaderboard'
import { UserBracketPage } from './pages/UserBracket'
import { AdminPage } from './pages/Admin'
import { ProfilePage } from './pages/Profile'
import { useAuth } from './lib/auth'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>
  if (!session) return <Navigate to="/sign-in" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      <Route element={<Layout />}>
        <Route index element={<Navigate to="/leaderboard" replace />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/u/:userId" element={<UserBracketPage />} />
        <Route
          path="/groups"
          element={
            <RequireAuth>
              <GroupsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/bracket"
          element={
            <RequireAuth>
              <BracketPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminPage />
            </RequireAuth>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
