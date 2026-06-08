import { useMemo } from 'react'
import { KnockoutMatch } from './KnockoutMatch'
import { computeBracket, slotsFor, type PickMap } from '../lib/bracket'
import type { MatchRow, PickRow, Round } from '../lib/types'

const ROUND_LABEL: Record<Round, string> = {
  group: 'Groups',
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarterfinals',
  sf: 'Semifinals',
  third: 'Third place',
  final: 'Final',
}

const ROUND_ORDER: Round[] = ['r32', 'r16', 'qf', 'sf', 'final']

export function BracketGrid({
  matches,
  picks,
  onPick,
  readonly,
}: {
  matches: MatchRow[]
  picks: PickRow[]
  onPick: (matchNumber: number, winnerCode: string) => void
  readonly?: boolean
}) {
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

  const bracket = useMemo(() => computeBracket(pickMap), [pickMap])

  const knockoutMatches = useMemo(
    () => matches.filter(m => m.round !== 'group'),
    [matches],
  )

  const byRound = useMemo(() => {
    const m: Record<Round, MatchRow[]> = {
      group: [], r32: [], r16: [], qf: [], sf: [], third: [], final: [],
    }
    for (const x of knockoutMatches) m[x.round].push(x)
    for (const r of Object.keys(m) as Round[]) m[r].sort((a, b) => a.match_number - b.match_number)
    return m
  }, [knockoutMatches])

  const now = Date.now()
  const pickFor = (mn: number) => picks.find(p => p.match_number === mn)

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {ROUND_ORDER.map(r => (
          <section key={r} className="flex flex-col gap-2 min-w-[200px]">
            <h2 className="font-display font-bold text-sm text-neutral-700 dark:text-neutral-300 sticky top-0">
              {ROUND_LABEL[r]}
            </h2>
            {byRound[r].map(m => {
              const { a, b } = slotsFor(m as never, bracket)
              return (
                <KnockoutMatch
                  key={m.match_number}
                  match={m}
                  slotA={a}
                  slotB={b}
                  pick={pickFor(m.match_number)}
                  locked={new Date(m.kickoff_at).getTime() <= now}
                  readonly={readonly}
                  onPick={(code) => onPick(m.match_number, code)}
                />
              )
            })}
          </section>
        ))}

        {/* Third-place playoff lives off to the side */}
        <section className="flex flex-col gap-2 min-w-[200px] border-l border-dashed border-neutral-300 dark:border-neutral-700 pl-4">
          <h2 className="font-display font-bold text-sm text-neutral-700 dark:text-neutral-300 sticky top-0">
            Third place
          </h2>
          {byRound.third.map(m => {
            const { a, b } = slotsFor(m as never, bracket)
            return (
              <KnockoutMatch
                key={m.match_number}
                match={m}
                slotA={a}
                slotB={b}
                pick={pickFor(m.match_number)}
                locked={new Date(m.kickoff_at).getTime() <= now}
                readonly={readonly}
                onPick={(code) => onPick(m.match_number, code)}
              />
            )
          })}
        </section>
      </div>
    </div>
  )
}
