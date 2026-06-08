import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useMatches } from '../lib/hooks'
import { BracketGrid } from '../components/BracketGrid'
import { scoreUser } from '../lib/scoring'
import type { PickRow, ProfileRow } from '../lib/types'

export function UserBracketPage() {
  const { userId } = useParams<{ userId: string }>()
  const { matches, loading: ml } = useMatches()
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [picks, setPicks] = useState<PickRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    let active = true
    Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('picks').select('*').eq('user_id', userId),
    ]).then(([{ data: prof }, { data: pks }]) => {
      if (!active) return
      setProfile(prof)
      setPicks(pks ?? [])
      setLoading(false)
    })
    return () => { active = false }
  }, [userId])

  if (ml || loading) return <div className="text-neutral-500">Loading…</div>

  if (!profile) {
    return <div className="text-neutral-500">No player with that id.</div>
  }

  const score = scoreUser(matches, picks)

  return (
    <div>
      <div className="mb-4">
        <Link to="/leaderboard" className="text-xs text-neutral-500 hover:underline">← Leaderboard</Link>
        <h1 className="font-display text-2xl font-bold">{profile.display_name}'s bracket</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Total <span className="font-bold text-neutral-900 dark:text-neutral-100">{score.total}</span> pts
          {' · '}
          Group {score.byRound.group} pts
          {' · '}
          Knockout {score.total - score.byRound.group} pts
        </p>
      </div>

      <BracketGrid
        matches={matches}
        picks={picks}
        onPick={() => {}}
        readonly
      />
    </div>
  )
}
