import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useMatches } from '../lib/hooks'
import { scoreUser } from '../lib/scoring'
import type { PickRow, ProfileRow } from '../lib/types'

type Row = {
  userId: string
  displayName: string
  total: number
  groupPoints: number
  bracketPoints: number
  picksMade: number
}

export function LeaderboardPage() {
  const { matches, loading: ml } = useMatches()
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [picks, setPicks] = useState<PickRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('picks').select('*'),
    ]).then(([{ data: profs }, { data: pks }]) => {
      if (!active) return
      setProfiles(profs ?? [])
      setPicks(pks ?? [])
      setLoading(false)
    })
    return () => { active = false }
  }, [])

  const rows = useMemo<Row[]>(() => {
    if (!matches.length || !profiles.length) return []
    const picksByUser = new Map<string, PickRow[]>()
    for (const p of picks) {
      const arr = picksByUser.get(p.user_id) ?? []
      arr.push(p)
      picksByUser.set(p.user_id, arr)
    }
    return profiles
      .map(p => {
        const userPicks = picksByUser.get(p.id) ?? []
        const s = scoreUser(matches, userPicks)
        return {
          userId: p.id,
          displayName: p.display_name,
          total: s.total,
          groupPoints: s.byRound.group,
          bracketPoints: s.total - s.byRound.group,
          picksMade: userPicks.length,
        }
      })
      .sort((a, b) => b.total - a.total || a.displayName.localeCompare(b.displayName))
  }, [matches, profiles, picks])

  if (ml || loading) return <div className="text-neutral-500">Loading…</div>

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Leaderboard</h1>
      <p className="text-sm text-neutral-500 mb-4">
        Click anyone to see their bracket. {rows.length} player{rows.length === 1 ? '' : 's'}.
      </p>

      {rows.length === 0 ? (
        <p className="text-neutral-500">
          No brackets yet. <Link to="/sign-in" className="text-pitch-600 underline">Sign in</Link> to be the first.
        </p>
      ) : (
        <div className="overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900 text-left">
              <tr>
                <th className="px-3 py-2 w-12">#</th>
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2 text-right">Group</th>
                <th className="px-3 py-2 text-right">Bracket</th>
                <th className="px-3 py-2 text-right">Total</th>
                <th className="px-3 py-2 text-right text-neutral-400">Picks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.userId}
                  className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                >
                  <td className="px-3 py-2 text-neutral-500 tabular-nums">{i + 1}</td>
                  <td className="px-3 py-2">
                    <Link to={`/u/${r.userId}`} className="text-pitch-700 dark:text-pitch-400 hover:underline font-medium">
                      {r.displayName}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.groupPoints}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.bracketPoints}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-bold">{r.total}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-neutral-400">{r.picksMade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
