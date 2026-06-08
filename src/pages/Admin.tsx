import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../lib/auth'
import { useMatches } from '../lib/hooks'
import { supabase } from '../lib/supabase'
import { TEAMS } from '../data/teams'
import type { MatchRow, Round } from '../lib/types'

export function AdminPage() {
  const { session } = useAuth()
  const { matches, loading } = useMatches()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [filter, setFilter] = useState<Round | 'all'>('all')

  useEffect(() => {
    if (!session) { setIsAdmin(false); return }
    supabase.from('admin_emails').select('email').limit(1).then(({ data }) => {
      setIsAdmin((data?.length ?? 0) > 0)
    })
  }, [session])

  const visible = useMemo(
    () => filter === 'all' ? matches : matches.filter(m => m.round === filter),
    [matches, filter],
  )

  if (loading || isAdmin === null) return <div className="text-neutral-500">Loading…</div>
  if (!isAdmin) {
    return (
      <div className="text-neutral-500">
        Not an admin. Ask the project owner to add your email to <code>admin_emails</code>.
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Match results</h1>
      <p className="text-sm text-neutral-500 mb-4">
        Enter actual results here. Picks rescore automatically.
      </p>
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        {(['all', 'group', 'r32', 'r16', 'qf', 'sf', 'third', 'final'] as const).map(r => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`px-2 py-1 rounded ${
              filter === r
                ? 'bg-pitch-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            {r === 'all' ? 'All' : r.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {visible.map(m => (
          <AdminRow key={m.match_number} match={m} />
        ))}
      </div>
    </div>
  )
}

function AdminRow({ match }: { match: MatchRow }) {
  const [teamA, setTeamA] = useState(match.actual_team_a_code ?? match.team_a_code ?? '')
  const [teamB, setTeamB] = useState(match.actual_team_b_code ?? match.team_b_code ?? '')
  const [scoreA, setScoreA] = useState<number | ''>(match.actual_score_a ?? '')
  const [scoreB, setScoreB] = useState<number | ''>(match.actual_score_b ?? '')
  const [winner, setWinner] = useState(match.actual_winner_code ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setSaving(true)
    setError(null)
    const { error } = await supabase
      .from('matches')
      .update({
        actual_team_a_code: teamA || null,
        actual_team_b_code: teamB || null,
        actual_score_a: scoreA === '' ? null : scoreA,
        actual_score_b: scoreB === '' ? null : scoreB,
        actual_winner_code: winner || null,
      })
      .eq('match_number', match.match_number)
    setSaving(false)
    if (error) setError(error.message)
  }

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_120px_120px] gap-2 items-center">
      <div className="text-xs text-neutral-500">
        M{match.match_number}<br />{match.round.toUpperCase()}
      </div>
      <div className="flex items-center gap-2">
        <select
          value={teamA}
          onChange={(e) => setTeamA(e.target.value)}
          className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm"
        >
          <option value="">{match.slot_a_label ?? 'TBD'}</option>
          {TEAMS.map(t => <option key={t.code} value={t.code}>{t.flag} {t.name}</option>)}
        </select>
        <input
          type="number"
          value={scoreA}
          onChange={(e) => setScoreA(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          className="w-14 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm"
          placeholder="–"
        />
      </div>
      <div className="flex items-center gap-2">
        <select
          value={teamB}
          onChange={(e) => setTeamB(e.target.value)}
          className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm"
        >
          <option value="">{match.slot_b_label ?? 'TBD'}</option>
          {TEAMS.map(t => <option key={t.code} value={t.code}>{t.flag} {t.name}</option>)}
        </select>
        <input
          type="number"
          value={scoreB}
          onChange={(e) => setScoreB(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          className="w-14 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm"
          placeholder="–"
        />
      </div>
      <select
        value={winner}
        onChange={(e) => setWinner(e.target.value)}
        className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm"
      >
        <option value="">
          {match.round === 'group' ? '(Draw)' : 'Pick winner'}
        </option>
        {[teamA, teamB]
          .filter((c): c is string => !!c)
          .map(c => {
            const t = TEAMS.find(x => x.code === c)
            return <option key={c} value={c}>{t?.flag} {t?.name}</option>
          })}
      </select>
      <button
        onClick={save}
        disabled={saving}
        className="px-3 py-1.5 rounded bg-pitch-600 hover:bg-pitch-700 text-white text-sm font-medium disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
      {error && <p className="col-span-full text-xs text-red-500">{error}</p>}
    </div>
  )
}
