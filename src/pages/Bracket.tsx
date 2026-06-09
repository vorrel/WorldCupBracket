import { useAuth } from '../lib/auth'
import { useMatches, usePicks, usePickSaver } from '../lib/hooks'
import { BracketGrid } from '../components/BracketGrid'
import type { PickRow } from '../lib/types'

export function BracketPage() {
  const { session } = useAuth()
  const { matches, loading: ml } = useMatches()
  const { picks, setPicks, loading: pl } = usePicks(session?.user.id)
  const { save, status } = usePickSaver(session?.user.id)

  if (ml || pl) return <div className="text-neutral-500">Loading…</div>

  function applyPick(matchNumber: number, winnerCode: string) {
    if (!session) return
    const existing = picks.find(p => p.match_number === matchNumber)
    const next: PickRow = {
      user_id: session.user.id,
      match_number: matchNumber,
      predicted_winner_code: winnerCode,
      predicted_score_a: existing?.predicted_score_a ?? null,
      predicted_score_b: existing?.predicted_score_b ?? null,
      updated_at: new Date().toISOString(),
    }
    setPicks(prev => {
      const idx = prev.findIndex(p => p.match_number === matchNumber)
      if (idx >= 0) {
        const copy = [...prev]; copy[idx] = next; return copy
      }
      return [...prev, next]
    })
    // Write the FULL row so the upsert never clobbers other fields.
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
          <h1 className="font-display text-2xl font-bold">Knockout bracket</h1>
          <p className="text-sm text-neutral-500">
            Slots fill in from your group picks. Click a team to advance them.
          </p>
        </div>
        <SaveBadge status={status} />
      </div>

      <BracketGrid
        matches={matches}
        picks={picks}
        onPick={applyPick}
      />
    </div>
  )
}

function SaveBadge({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null
  if (status === 'saving') return <span className="text-xs text-neutral-500">Saving…</span>
  if (status === 'saved') return <span className="text-xs text-pitch-600">Saved ✓</span>
  return <span className="text-xs text-red-500">Save failed</span>
}
