// Scoring rules:
//
//   Group stage:
//     - Correct winner / draw:        1 pt
//     - Exact score (additional):     1 pt
//
//   Knockout (per-match):
//     - R32 correct winner:           2 pt
//     - R16:                          4 pt
//     - QF:                           8 pt
//     - SF:                          16 pt
//     - Third-place:                  4 pt
//     - Final:                       32 pt   (correct champion)
//
// "Correct winner" for a knockout match means the user's predicted winner
// matches the actual winner — even if the bracket path that got them there
// differed from the user's predictions.

import type { MatchRow, PickRow } from './types'

export const POINTS = {
  group_winner: 1,
  group_exact_score: 1,
  r32: 2,
  r16: 4,
  qf: 8,
  sf: 16,
  third: 4,
  final: 32,
} as const

export type MatchScore = {
  matchNumber: number
  points: number
  detail: 'unscored' | 'wrong' | 'winner_only' | 'winner_and_score'
}

export function scoreOne(match: MatchRow, pick: PickRow | undefined): MatchScore {
  if (!pick || match.actual_winner_code === null && (match.actual_score_a === null || match.actual_score_b === null)) {
    return { matchNumber: match.match_number, points: 0, detail: 'unscored' }
  }

  if (match.round === 'group') {
    const winnerCorrect = pick.predicted_winner_code === match.actual_winner_code
    const scoresKnown = match.actual_score_a !== null && match.actual_score_b !== null
    const scoreCorrect = scoresKnown
      && pick.predicted_score_a === match.actual_score_a
      && pick.predicted_score_b === match.actual_score_b
    if (winnerCorrect && scoreCorrect) {
      return { matchNumber: match.match_number, points: POINTS.group_winner + POINTS.group_exact_score, detail: 'winner_and_score' }
    }
    if (winnerCorrect) {
      return { matchNumber: match.match_number, points: POINTS.group_winner, detail: 'winner_only' }
    }
    return { matchNumber: match.match_number, points: 0, detail: 'wrong' }
  }

  // Knockouts: winner-only.
  const correct = pick.predicted_winner_code && pick.predicted_winner_code === match.actual_winner_code
  if (!correct) {
    return { matchNumber: match.match_number, points: 0, detail: 'wrong' }
  }
  const points =
    match.round === 'r32' ? POINTS.r32
    : match.round === 'r16' ? POINTS.r16
    : match.round === 'qf' ? POINTS.qf
    : match.round === 'sf' ? POINTS.sf
    : match.round === 'third' ? POINTS.third
    : POINTS.final
  return { matchNumber: match.match_number, points, detail: 'winner_only' }
}

export type UserScore = {
  total: number
  byRound: Record<MatchRow['round'], number>
  byMatch: MatchScore[]
}

export function scoreUser(matches: MatchRow[], picks: PickRow[]): UserScore {
  const picksByMatch = new Map(picks.map(p => [p.match_number, p]))
  const out: UserScore = {
    total: 0,
    byRound: { group: 0, r32: 0, r16: 0, qf: 0, sf: 0, third: 0, final: 0 },
    byMatch: [],
  }
  for (const m of matches) {
    const s = scoreOne(m, picksByMatch.get(m.match_number))
    out.byMatch.push(s)
    out.total += s.points
    out.byRound[m.round] += s.points
  }
  return out
}
