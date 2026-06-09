import { TeamBadge } from './TeamBadge'
import type { MatchRow, PickRow } from '../lib/types'

type Choice = 'A' | 'DRAW' | 'B'

function fmtKickoff(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// What the picker should *show* as selected, given the current pick.
// For group matches, scores are authoritative when both are filled —
// the winner is derived from them, and the saved winner is only used
// when scores are blank.
function displayedChoice(pick: PickRow | undefined, match: MatchRow): Choice | null {
  if (!pick) return null
  const isGroup = match.round === 'group'
  const a = pick.predicted_score_a
  const b = pick.predicted_score_b
  if (isGroup && a !== null && b !== null) {
    if (a > b) return 'A'
    if (b > a) return 'B'
    return 'DRAW'
  }
  if (pick.predicted_winner_code === null) return isGroup ? 'DRAW' : null
  if (pick.predicted_winner_code === match.team_a_code) return 'A'
  if (pick.predicted_winner_code === match.team_b_code) return 'B'
  return null
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
  const choice = displayedChoice(pick, match)
  const isGroup = match.round === 'group'

  function pickWinner(c: 'A' | 'B') {
    if (locked) return
    if (isGroup) {
      // Score shortcut: ensure scores express "team A wins" or "team B wins".
      // If existing scores already reflect that, keep them; otherwise default
      // to 1-0 / 0-1 so the user can fine-tune from there.
      const a = pick?.predicted_score_a ?? null
      const b = pick?.predicted_score_b ?? null
      const aWins = a !== null && b !== null && a > b
      const bWins = a !== null && b !== null && b > a
      const next =
        c === 'A'
          ? (aWins ? { score_a: a!, score_b: b! } : { score_a: 1, score_b: 0 })
          : (bWins ? { score_a: a!, score_b: b! } : { score_a: 0, score_b: 1 })
      onPick({
        predicted_score_a: next.score_a,
        predicted_score_b: next.score_b,
        predicted_winner_code: c === 'A' ? match.team_a_code! : match.team_b_code!,
      })
    } else {
      // Knockout: no scoring, just pick the advancing team.
      onPick({
        predicted_winner_code: c === 'A' ? match.team_a_code! : match.team_b_code!,
      })
    }
  }

  function setScore(side: 'a' | 'b', value: string) {
    if (locked || !isGroup) return
    const num = value === '' ? null : Math.max(0, Math.min(20, parseInt(value, 10) || 0))
    const a = side === 'a' ? num : (pick?.predicted_score_a ?? null)
    const b = side === 'b' ? num : (pick?.predicted_score_b ?? null)
    // Re-derive the winner from the new scoreline so the highlight stays
    // in sync. Either score blank = no winner derivable (null).
    let winner: string | null = pick?.predicted_winner_code ?? null
    if (a !== null && b !== null) {
      if (a > b) winner = match.team_a_code ?? null
      else if (b > a) winner = match.team_b_code ?? null
      else winner = null   // draw
    }
    onPick({
      predicted_score_a: a,
      predicted_score_b: b,
      predicted_winner_code: winner,
    })
  }

  const containerCls = locked
    ? 'bg-neutral-50 border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 opacity-80'
    : 'bg-white border-neutral-200 hover:border-pitch-500 dark:bg-neutral-900 dark:border-neutral-800'

  return (
    <div className={`rounded-lg border p-3 ${containerCls}`}>
      <div className="text-[11px] text-neutral-500 mb-2 flex justify-between">
        <span>M{match.match_number} · {fmtKickoff(match.kickoff_at)}</span>
        {locked && <span className="text-amber-600 dark:text-amber-400">🔒 locked</span>}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 items-center">
        <button
          type="button"
          disabled={locked}
          onClick={() => pickWinner('A')}
          className={`min-w-0 flex items-center gap-2 p-2 rounded-md text-left ${
            choice === 'A'
              ? 'bg-pitch-100 ring-2 ring-pitch-500 dark:bg-pitch-900/50'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <TeamBadge code={match.team_a_code} fallback={match.slot_a_label ?? undefined} size="sm" />
        </button>

        <div className="flex flex-col items-center gap-1">
          {isGroup ? (
            <>
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
              <span
                className={`px-2 py-0.5 rounded text-[11px] ${
                  choice === 'DRAW'
                    ? 'bg-pitch-100 text-pitch-700 ring-1 ring-pitch-500 dark:bg-pitch-900/50 dark:text-pitch-300'
                    : 'text-neutral-400'
                }`}
              >
                Draw
              </span>
            </>
          ) : (
            <span className="text-xs text-neutral-400">vs</span>
          )}
        </div>

        <button
          type="button"
          disabled={locked}
          onClick={() => pickWinner('B')}
          className={`min-w-0 flex items-center gap-2 p-2 rounded-md justify-end ${
            choice === 'B'
              ? 'bg-pitch-100 ring-2 ring-pitch-500 dark:bg-pitch-900/50'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <TeamBadge
            code={match.team_b_code}
            fallback={match.slot_b_label ?? undefined}
            size="sm"
            flagSide="right"
          />
        </button>
      </div>
    </div>
  )
}
