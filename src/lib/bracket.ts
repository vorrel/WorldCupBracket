// Computes a user's predicted bracket from their match picks.
//
// Inputs: their `picks` (winner + score per group match, winner per knockout
// match) and the static `matches` schedule.
//
// Outputs: per-knockout-match, who they predict in slot A and slot B.

import type { Group } from '../data/teams'
import { GROUPS, teamsInGroup } from '../data/teams'
import type { Match } from '../data/matches'
import { MATCHES_BY_NUMBER } from '../data/matches'

export type PickMap = Map<number, {
  predicted_winner_code: string | null
  predicted_score_a: number | null
  predicted_score_b: number | null
}>

export type GroupTeamStanding = {
  code: string
  played: number
  pts: number
  gd: number
  gf: number
  ga: number
}

export type GroupStandings = Record<Group, GroupTeamStanding[]>

// Stable ranking comparator: pts, GD, GF, then alphabetical for determinism.
function rankCompare(a: GroupTeamStanding, b: GroupTeamStanding): number {
  return (
    b.pts - a.pts ||
    b.gd - a.gd ||
    b.gf - a.gf ||
    a.code.localeCompare(b.code)
  )
}

export function computeGroupStandings(picks: PickMap): GroupStandings {
  const out = {} as GroupStandings

  for (const g of GROUPS) {
    const teams = teamsInGroup(g)
    const standings = new Map<string, GroupTeamStanding>(
      teams.map(t => [t.code, { code: t.code, played: 0, pts: 0, gd: 0, gf: 0, ga: 0 }]),
    )

    // Find all group matches for this group.
    const groupMatches = Object.values(MATCHES_BY_NUMBER).filter(m => m.group === g)
    for (const m of groupMatches) {
      const pick = picks.get(m.matchNumber)
      if (!pick || !m.teamA || !m.teamB) continue
      const a = standings.get(m.teamA)!
      const b = standings.get(m.teamB)!

      const sa = pick.predicted_score_a ?? null
      const sb = pick.predicted_score_b ?? null
      const winner = pick.predicted_winner_code // null = predicted draw

      a.played += 1
      b.played += 1

      if (sa !== null && sb !== null) {
        a.gf += sa; a.ga += sb; a.gd += sa - sb
        b.gf += sb; b.ga += sa; b.gd += sb - sa
      }

      if (winner === null) {
        a.pts += 1
        b.pts += 1
      } else if (winner === m.teamA) {
        a.pts += 3
      } else if (winner === m.teamB) {
        b.pts += 3
      }
    }

    out[g] = [...standings.values()].sort(rankCompare)
  }

  return out
}

// FIFA bracket layout for the eight R32 slots that take a third-placed team.
// Each slot lists the groups whose 3rd-placed team can land there.
export const THIRD_PLACE_SLOTS: { matchNumber: number; allowedGroups: Group[] }[] = [
  { matchNumber: 74, allowedGroups: ['A', 'B', 'C', 'D', 'F'] },
  { matchNumber: 77, allowedGroups: ['C', 'D', 'F', 'G', 'H'] },
  { matchNumber: 79, allowedGroups: ['C', 'E', 'F', 'H', 'I'] },
  { matchNumber: 80, allowedGroups: ['E', 'H', 'I', 'J', 'K'] },
  { matchNumber: 81, allowedGroups: ['B', 'E', 'F', 'I', 'J'] },
  { matchNumber: 82, allowedGroups: ['A', 'E', 'H', 'I', 'J'] },
  { matchNumber: 85, allowedGroups: ['E', 'F', 'G', 'I', 'J'] },
  { matchNumber: 87, allowedGroups: ['D', 'E', 'I', 'J', 'L'] },
]

// Greedy assignment of the user's 8 best third-placed teams to the R32 slots
// that take a third. Returns map of match number -> team code.
export function assignThirdPlaceSlots(standings: GroupStandings): Map<number, string> {
  // Rank all 12 third-placed teams by user's predicted standings.
  const thirds = GROUPS.map(g => ({
    group: g,
    standing: standings[g][2], // index 2 = 3rd place
  })).sort((a, b) => rankCompare(a.standing, b.standing))

  const advancing = thirds.slice(0, 8)
  const remaining = [...advancing]
  const out = new Map<number, string>()

  // Order slots by the most constrained first (fewest allowed groups still on the table).
  // Since each slot has 5 allowed groups, we use a greedy by best-team-first instead.
  // For each advancing third (best to worst), place into the first slot whose
  // allowed list matches and isn't taken.
  const slots = [...THIRD_PLACE_SLOTS]
  for (const t of advancing) {
    const slotIdx = slots.findIndex(s => s.allowedGroups.includes(t.group) && !out.has(s.matchNumber))
    if (slotIdx >= 0) {
      out.set(slots[slotIdx].matchNumber, t.standing.code)
    } else {
      // Fallback: place in any remaining slot. Shouldn't happen with a valid
      // 8-of-12 selection per FIFA's allocation table.
      const fallback = slots.find(s => !out.has(s.matchNumber))
      if (fallback) out.set(fallback.matchNumber, t.standing.code)
    }
  }

  void remaining
  return out
}

export type BracketSlots = Map<number, { a: string | null; b: string | null }>

// For each knockout match (73–104), figure out which team the user predicts
// in slot A and slot B, based on their group picks and earlier knockout picks.
export function computeBracketSlots(
  standings: GroupStandings,
  picks: PickMap,
): BracketSlots {
  const slots: BracketSlots = new Map()
  const thirdAssignments = assignThirdPlaceSlots(standings)

  const winnerFor = (matchNum: number): string | null => {
    return picks.get(matchNum)?.predicted_winner_code ?? null
  }

  // R32 — derived from groups + third-place assignments.
  const r32: Record<number, [string | null, string | null]> = {
    73: [standings.A[1]?.code ?? null, standings.B[1]?.code ?? null],
    74: [standings.E[0]?.code ?? null, thirdAssignments.get(74) ?? null],
    75: [standings.F[0]?.code ?? null, standings.C[1]?.code ?? null],
    76: [standings.C[0]?.code ?? null, standings.F[1]?.code ?? null],
    77: [standings.I[0]?.code ?? null, thirdAssignments.get(77) ?? null],
    78: [standings.E[1]?.code ?? null, standings.I[1]?.code ?? null],
    79: [standings.A[0]?.code ?? null, thirdAssignments.get(79) ?? null],
    80: [standings.L[0]?.code ?? null, thirdAssignments.get(80) ?? null],
    81: [standings.D[0]?.code ?? null, thirdAssignments.get(81) ?? null],
    82: [standings.G[0]?.code ?? null, thirdAssignments.get(82) ?? null],
    83: [standings.K[1]?.code ?? null, standings.L[1]?.code ?? null],
    84: [standings.H[0]?.code ?? null, standings.J[1]?.code ?? null],
    85: [standings.B[0]?.code ?? null, thirdAssignments.get(85) ?? null],
    86: [standings.J[0]?.code ?? null, standings.H[1]?.code ?? null],
    87: [standings.K[0]?.code ?? null, thirdAssignments.get(87) ?? null],
    88: [standings.D[1]?.code ?? null, standings.G[1]?.code ?? null],
  }
  for (const [k, v] of Object.entries(r32)) {
    slots.set(Number(k), { a: v[0], b: v[1] })
  }

  // R16 → Final: each slot's team comes from the user's predicted winner of
  // the match that feeds it.
  for (const matchNum of [89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 104]) {
    const m = MATCHES_BY_NUMBER[matchNum]
    slots.set(matchNum, {
      a: m.feedsFromA ? winnerFor(m.feedsFromA) : null,
      b: m.feedsFromB ? winnerFor(m.feedsFromB) : null,
    })
  }

  // Third-place: losers of the two SFs. Approximation: if the user picked a
  // winner of an SF, the *other* SF team is their predicted loser.
  for (const matchNum of [103]) {
    const m = MATCHES_BY_NUMBER[matchNum]
    const sfA = m.feedsFromA ? slots.get(m.feedsFromA) : null
    const sfB = m.feedsFromB ? slots.get(m.feedsFromB) : null
    const winA = m.feedsFromA ? winnerFor(m.feedsFromA) : null
    const winB = m.feedsFromB ? winnerFor(m.feedsFromB) : null
    const loserA = sfA && winA ? (sfA.a === winA ? sfA.b : sfA.a) : null
    const loserB = sfB && winB ? (sfB.a === winB ? sfB.b : sfB.a) : null
    slots.set(matchNum, { a: loserA, b: loserB })
  }

  return slots
}

// Convenience: full predicted bracket for a user.
export function computeBracket(picks: PickMap) {
  const standings = computeGroupStandings(picks)
  const slots = computeBracketSlots(standings, picks)
  return { standings, slots }
}

// Helper used in UI: given a match, return the team-code pair for its slots.
// For group matches, just returns the actual teams.
export function slotsFor(
  match: Match,
  bracket: { slots: BracketSlots },
): { a: string | null; b: string | null } {
  if (match.round === 'group') {
    return { a: match.teamA ?? null, b: match.teamB ?? null }
  }
  return bracket.slots.get(match.matchNumber) ?? { a: null, b: null }
}

