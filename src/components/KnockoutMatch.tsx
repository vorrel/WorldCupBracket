import { TeamBadge } from './TeamBadge'
import type { MatchRow, PickRow } from '../lib/types'

type Side = 'a' | 'b'

function fmtKickoff(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function KnockoutMatch({
  match,
  slotA,
  slotB,
  pick,
  locked,
  onPick,
  readonly,
}: {
  match: MatchRow
  slotA: string | null
  slotB: string | null
  pick: PickRow | undefined
  locked: boolean
  onPick: (winnerCode: string) => void
  readonly?: boolean
}) {
  const winner = pick?.predicted_winner_code ?? null
  const isReal = match.round !== 'third' ? 'Winner' : '3rd-place'

  function choose(side: Side) {
    if (locked || readonly) return
    const code = side === 'a' ? slotA : slotB
    if (!code) return
    onPick(code)
  }

  const slotCls = (code: string | null, isWinner: boolean) => {
    if (!code) return 'opacity-50'
    if (isWinner) return 'bg-primary/15 ring-2 ring-primary text-foreground'
    if (locked) return 'opacity-70'
    if (readonly) return ''
    return 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
  }

  return (
    <div className={`rounded-lg border p-2 min-w-[180px] ${
      locked
        ? 'bg-muted border-border'
        : 'bg-card border-border'
    }`}>
      <div className="text-[10px] text-muted-foreground flex justify-between items-center mb-1">
        <span>M{match.match_number}</span>
        <span className="truncate ml-2">{fmtKickoff(match.kickoff_at)}</span>
      </div>
      <button
        type="button"
        disabled={locked || readonly || !slotA}
        onClick={() => choose('a')}
        className={`w-full text-left p-1.5 rounded mb-1 ${slotCls(slotA, winner !== null && winner === slotA)}`}
      >
        <TeamBadge code={slotA} fallback={match.slot_a_label ?? undefined} size="sm" />
      </button>
      <button
        type="button"
        disabled={locked || readonly || !slotB}
        onClick={() => choose('b')}
        className={`w-full text-left p-1.5 rounded ${slotCls(slotB, winner !== null && winner === slotB)}`}
      >
        <TeamBadge code={slotB} fallback={match.slot_b_label ?? undefined} size="sm" />
      </button>
      {locked && <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">🔒 {isReal}: locked</div>}
    </div>
  )
}
