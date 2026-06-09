import { useMemo } from 'react'
import { useAuth } from '../lib/auth'
import { useMatches, usePicks, usePickSaver } from '../lib/hooks'
import { GROUPS, teamsInGroup, type Group } from '../data/teams'
import { MatchPicker } from '../components/MatchPicker'
import { TeamBadge } from '../components/TeamBadge'
import { computeGroupStandings, type PickMap } from '../lib/bracket'
import type { PickRow } from '../lib/types'

export function GroupsPage() {
  const { session } = useAuth()
  const { matches, loading: ml } = useMatches()
  const { picks, setPicks, loading: pl } = usePicks(session?.user.id)
  const { save, status } = usePickSaver(session?.user.id)

  const pickMap = useMemo<PickMap>(() => {
    const m = new Map() as PickMap
    for (const p of picks) {
      m.set(p.match_number, {
        predicted_winner_code: p.predicted_winner_code,
        predicted_score_a: p.predicted_score_a,
        predicted_score_b: p.predicted_score_b,
      })
    }
    return m
  }, [picks])

  const standings = useMemo(() => computeGroupStandings(pickMap), [pickMap])
  const groupMatches = useMemo(
    () => matches.filter(m => m.round === 'group'),
    [matches],
  )

  if (ml || pl) return <div className="text-muted-foreground">Loading…</div>

  function applyPick(matchNumber: number, patch: Partial<PickRow>) {
    if (!session) return
    // Merge against the latest known pick. Use `in` so an explicit `null`
    // (e.g. picking "Draw" or clearing a score) overrides the old value
    // instead of being swallowed by `??`.
    const existing = picks.find(p => p.match_number === matchNumber)
    const next: PickRow = {
      user_id: session.user.id,
      match_number: matchNumber,
      predicted_winner_code: 'predicted_winner_code' in patch
        ? (patch.predicted_winner_code ?? null)
        : (existing?.predicted_winner_code ?? null),
      predicted_score_a: 'predicted_score_a' in patch
        ? (patch.predicted_score_a ?? null)
        : (existing?.predicted_score_a ?? null),
      predicted_score_b: 'predicted_score_b' in patch
        ? (patch.predicted_score_b ?? null)
        : (existing?.predicted_score_b ?? null),
      updated_at: new Date().toISOString(),
    }
    setPicks(prev => {
      const idx = prev.findIndex(p => p.match_number === matchNumber)
      if (idx >= 0) {
        const copy = [...prev]; copy[idx] = next; return copy
      }
      return [...prev, next]
    })
    // Always write the FULL row so upserting one field never clobbers the others.
    save(matchNumber, {
      predicted_winner_code: next.predicted_winner_code,
      predicted_score_a: next.predicted_score_a,
      predicted_score_b: next.predicted_score_b,
    })
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Group stage</h1>
          <p className="text-sm text-muted-foreground">
            Pick a winner (or draw) for each match. Optional score for the bonus point.
          </p>
        </div>
        <SaveBadge status={status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GROUPS.map(g => (
          <GroupCard
            key={g}
            group={g}
            matches={groupMatches.filter(m => m.group_letter === g)}
            pickMap={pickMap}
            standings={standings[g]}
            onPick={applyPick}
          />
        ))}
      </div>
    </div>
  )
}

function GroupCard({
  group,
  matches,
  pickMap,
  standings,
  onPick,
}: {
  group: Group
  matches: ReturnType<typeof useMatches>['matches']
  pickMap: PickMap
  standings: ReturnType<typeof computeGroupStandings>[Group]
  onPick: (matchNumber: number, patch: Partial<PickRow>) => void
}) {
  const now = Date.now()
  return (
    <section className="border border-border rounded-xl p-4 bg-card text-card-foreground shadow-sm">
      <header className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-lg">Group {group}</h2>
        <span className="text-xs text-muted-foreground">{teamsInGroup(group).length} teams</span>
      </header>

      <ol className="text-xs space-y-0.5 mb-3">
        {standings.map((t, i) => (
          <li key={t.code} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className={`w-4 text-right tabular-nums ${
                i < 2 ? 'font-bold text-primary' : i === 2 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'
              }`}>{i + 1}.</span>
              <TeamBadge code={t.code} size="sm" />
            </span>
            <span className="tabular-nums text-muted-foreground">
              {t.pts}pt · {t.gd >= 0 ? '+' : ''}{t.gd}gd
            </span>
          </li>
        ))}
      </ol>

      <div className="space-y-2">
        {matches.map(m => (
          <MatchPicker
            key={m.match_number}
            match={m}
            pick={(() => {
              const p = pickMap.get(m.match_number)
              if (!p) return undefined
              return {
                user_id: '',
                match_number: m.match_number,
                predicted_winner_code: p.predicted_winner_code,
                predicted_score_a: p.predicted_score_a,
                predicted_score_b: p.predicted_score_b,
                updated_at: '',
              }
            })()}
            locked={new Date(m.kickoff_at).getTime() <= now}
            onPick={(patch) => onPick(m.match_number, patch)}
          />
        ))}
      </div>
    </section>
  )
}

function SaveBadge({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null
  if (status === 'saving') return <span className="text-xs text-muted-foreground">Saving…</span>
  if (status === 'saved') return <span className="text-xs text-primary">Saved ✓</span>
  return <span className="text-xs text-destructive">Save failed</span>
}
