import { useEffect, useState } from 'react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

export function ProfilePage() {
  const { session } = useAuth()
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return
    supabase
      .from('profiles')
      .select('display_name')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        setName(data?.display_name ?? '')
        setLoading(false)
      })
  }, [session])

  if (!session) return null
  if (loading) return <div className="text-neutral-500">Loading…</div>

  return (
    <div className="max-w-md">
      <h1 className="font-display text-2xl font-bold mb-4">Your profile</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const { error } = await supabase
            .from('profiles')
            .upsert({ id: session.user.id, display_name: name })
          if (!error) {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
          }
        }}
        className="space-y-3"
      >
        <label className="block">
          <span className="text-sm font-medium">Display name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950"
            placeholder="What should we call you on the leaderboard?"
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-pitch-600 hover:bg-pitch-700 text-white font-medium"
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </form>
    </div>
  )
}
