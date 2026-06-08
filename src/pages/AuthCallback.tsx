import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // The Supabase client auto-parses the magic-link hash. We just wait for
    // a session and route on.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) navigate('/groups', { replace: true })
    })
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/groups', { replace: true })
    })
    return () => sub.subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="p-12 text-center text-neutral-500">
      Signing you in…
    </div>
  )
}
