import { TeamBadge } from './TeamBadge'
import type { MatchRow, PickRow } from '../lib/types'

type Choice = 'A' | 'DRAW' | 'B'

function pickChoice(pick: PickRow | undefined, match: MatchRow): Choice | null {
  if (!pick) return null
  if (pick.predicted_winner_code === null) return 'DRAW'
  if (pick.predicted_winner_code === match.team_a_code) return 'A'
  if (pick.predicted_winner_code === match.team_b_code) return 'B'
  return null
}

function fmtKickoff(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function MatchPicker({
  match,
  pick,
  locked,
  onPick,
}: {
  match: MatchRow
  pick: PickRow | undefined
  locked: boolean
  onPick: (patch: Partial<PickRow>) => void
}) {
  const choice = pickChoice(pick, match)
  const allowDraw = match.round === 'group'

  function setWinner(c: Choice) {
    if (locked) return
    const winner =
      c === 'A' ? match.team_a_code
      : c === 'B' ? match.team_b_code
      : null
    onPick({ predicted_winner_code: winner })
  }

  function setScore(side: 'a' | 'b', value: string) {
    if (locked) return
    const num = value === '' ? null : Math.max(0, Math.min(20, parseInt(value, 10) || 0))
    onPick(side === 'a' ? { predicted_score_a: num } : { predicted_score_b: num })
  }

  return (
    <div className={`rounded-lg border p-3 ${
      locked
        ? 'bg-neutral-50 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 opacity-80'
        : 'bg-white border-neutral-200 hover:border-pitch-500 dark:bg-neutral-900 dark:border-neutral-800'
    }`}>
      <div className="text-[11px] text-neutral-500 mb-2 flex justify-between">
        <span>M{match.match_number} · {fmtKickoff(match.kickoff_at)}</span>
        {locked && <span className="text-amber-600 dark:text-amber-400">🔒 locked</span>}
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
        <button
          type="button"
          disabled={locked}
          onClick={() => setWinner('A')}
          className={`flex items-center gap-2 p-2 rounded-md text-left ${
            choice === 'A'
              ? 'bg-pitch-100 ring-2 ring-pitch-500 dark:bg-pitch-900/50'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <TeamBadge code={match.team_a_code} fallback={match.slot_a_label ?? undefined} size="sm" />
        </button>

        <div className="flex flex-col items-center gap-1">
          {match.round === 'group' ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={20}
                disabled={locked}
                value={pick?.predicted_score_a ?? ''}
                onChange={(e) => setScore('a', e.target.value)}
                className="w-10 text-center rounded border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 text-sm"
                placeholder="–"
              />
              <span className="text-neutral-400 text-xs">vs</span>
              <input
                type="number"
                min={0}
                max={20}
                disabled={locked}
                value={pick?.predicted_score_b ?? ''}
                onChange={(e) => setScore('b', e.target.value)}
                className="w-10 text-center rounded border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 text-sm"
                placeholder="–"
              />
            </div>
          ) : (
            <span className="text-xs text-neutral-400">vs</span>
          )}
          {allowDraw && (
            <button
              type="button"
              disabled={locked}
              onClick={() => setWinner('DRAW')}
              className={`px-2 py-0.5 rounded text-xs ${
                choice === 'DRAW'
                  ? 'bg-pitch-100 ring-1 ring-pitch-500 dark:bg-pitch-900/50'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Draw
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={locked}
          onClick={() => setWinner('B')}
          className={`flex items-center gap-2 p-2 rounded-md text-right justify-end ${
            choice === 'B'
              ? 'bg-pitch-100 ring-2 ring-pitch-500 dark:bg-pitch-900/50'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <TeamBadge code={match.team_b_code} fallback={match.slot_b_label ?? undefined} size="sm" />
        </button>
      </div>
    </div>
  )
}
