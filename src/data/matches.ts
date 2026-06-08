// 2026 FIFA World Cup match schedule.
// Times are stored as UTC ISO strings. Convert from UK (BST = UTC+1) to UTC.
//
// Group-stage matchups, knockout structure, and the third-place-team allocation
// follow Sky Sports' published schedule. Verify against fifa.com before sharing
// your bracket — kickoff times in particular may shift.
//
// Match number conventions match FIFA's official numbering (1-104).

import type { Group } from './teams'

export type Round = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final'

export type Match = {
  matchNumber: number        // 1-104
  round: Round
  group?: Group              // for group-stage only
  kickoffAt: string          // ISO UTC

  // Group stage: teams known up front.
  teamA?: string             // team code
  teamB?: string

  // Knockouts: slots are described by labels until results land.
  // Examples: "Winner Group A", "Runner-up Group B", "3rd from A/B/C/D/F", "Winner M73"
  slotALabel?: string
  slotBLabel?: string

  // For knockout matches, the match numbers that feed into this match.
  // Used by the bracket UI to walk back through a user's picks and
  // compute who they think is in each slot.
  feedsFromA?: number        // e.g. 73 for "Winner M73"
  feedsFromB?: number
}

// Convert UK clock time (BST = UTC+1 in June/July) to a UTC ISO string.
function bst(date: string, hhmm: string): string {
  const d = new Date(`${date}T${hhmm}:00Z`)
  d.setUTCHours(d.getUTCHours() - 1)
  return d.toISOString().replace(/\.000Z$/, 'Z')
}

// ----------------------------------------------------------------------------
// GROUP STAGE — 72 matches (June 11–27, 2026)
// ----------------------------------------------------------------------------

const groupMatches: Match[] = [
  // June 11
  { matchNumber: 1,  round: 'group', group: 'A', kickoffAt: bst('2026-06-11', '20:00'), teamA: 'MEX', teamB: 'RSA' },
  // June 12
  { matchNumber: 2,  round: 'group', group: 'A', kickoffAt: bst('2026-06-12', '03:00'), teamA: 'KOR', teamB: 'CZE' },
  { matchNumber: 3,  round: 'group', group: 'B', kickoffAt: bst('2026-06-12', '20:00'), teamA: 'CAN', teamB: 'BIH' },
  // June 13
  { matchNumber: 4,  round: 'group', group: 'D', kickoffAt: bst('2026-06-13', '02:00'), teamA: 'USA', teamB: 'PAR' },
  { matchNumber: 5,  round: 'group', group: 'B', kickoffAt: bst('2026-06-13', '20:00'), teamA: 'QAT', teamB: 'SUI' },
  { matchNumber: 6,  round: 'group', group: 'C', kickoffAt: bst('2026-06-13', '23:00'), teamA: 'BRA', teamB: 'MAR' },
  // June 14
  { matchNumber: 7,  round: 'group', group: 'C', kickoffAt: bst('2026-06-14', '02:00'), teamA: 'HAI', teamB: 'SCO' },
  { matchNumber: 8,  round: 'group', group: 'D', kickoffAt: bst('2026-06-14', '05:00'), teamA: 'AUS', teamB: 'TUR' },
  { matchNumber: 9,  round: 'group', group: 'E', kickoffAt: bst('2026-06-14', '18:00'), teamA: 'GER', teamB: 'CUW' },
  { matchNumber: 10, round: 'group', group: 'F', kickoffAt: bst('2026-06-14', '21:00'), teamA: 'NED', teamB: 'JPN' },
  // June 15
  { matchNumber: 11, round: 'group', group: 'E', kickoffAt: bst('2026-06-15', '00:00'), teamA: 'CIV', teamB: 'ECU' },
  { matchNumber: 12, round: 'group', group: 'F', kickoffAt: bst('2026-06-15', '03:00'), teamA: 'SWE', teamB: 'TUN' },
  { matchNumber: 13, round: 'group', group: 'H', kickoffAt: bst('2026-06-15', '17:00'), teamA: 'ESP', teamB: 'CPV' },
  { matchNumber: 14, round: 'group', group: 'G', kickoffAt: bst('2026-06-15', '20:00'), teamA: 'BEL', teamB: 'EGY' },
  { matchNumber: 15, round: 'group', group: 'H', kickoffAt: bst('2026-06-15', '23:00'), teamA: 'KSA', teamB: 'URU' },
  // June 16
  { matchNumber: 16, round: 'group', group: 'G', kickoffAt: bst('2026-06-16', '02:00'), teamA: 'IRN', teamB: 'NZL' },
  { matchNumber: 17, round: 'group', group: 'I', kickoffAt: bst('2026-06-16', '20:00'), teamA: 'FRA', teamB: 'SEN' },
  { matchNumber: 18, round: 'group', group: 'I', kickoffAt: bst('2026-06-16', '23:00'), teamA: 'IRQ', teamB: 'NOR' },
  // June 17
  { matchNumber: 19, round: 'group', group: 'J', kickoffAt: bst('2026-06-17', '02:00'), teamA: 'ARG', teamB: 'ALG' },
  { matchNumber: 20, round: 'group', group: 'J', kickoffAt: bst('2026-06-17', '05:00'), teamA: 'AUT', teamB: 'JOR' },
  { matchNumber: 21, round: 'group', group: 'K', kickoffAt: bst('2026-06-17', '18:00'), teamA: 'POR', teamB: 'COD' },
  { matchNumber: 22, round: 'group', group: 'L', kickoffAt: bst('2026-06-17', '21:00'), teamA: 'ENG', teamB: 'CRO' },
  // June 18
  { matchNumber: 23, round: 'group', group: 'L', kickoffAt: bst('2026-06-18', '00:00'), teamA: 'GHA', teamB: 'PAN' },
  { matchNumber: 24, round: 'group', group: 'K', kickoffAt: bst('2026-06-18', '03:00'), teamA: 'UZB', teamB: 'COL' },
  { matchNumber: 25, round: 'group', group: 'A', kickoffAt: bst('2026-06-18', '17:00'), teamA: 'CZE', teamB: 'RSA' },
  { matchNumber: 26, round: 'group', group: 'B', kickoffAt: bst('2026-06-18', '20:00'), teamA: 'SUI', teamB: 'BIH' },
  { matchNumber: 27, round: 'group', group: 'B', kickoffAt: bst('2026-06-18', '23:00'), teamA: 'CAN', teamB: 'QAT' },
  // June 19
  { matchNumber: 28, round: 'group', group: 'A', kickoffAt: bst('2026-06-19', '02:00'), teamA: 'MEX', teamB: 'KOR' },
  { matchNumber: 29, round: 'group', group: 'D', kickoffAt: bst('2026-06-19', '20:00'), teamA: 'USA', teamB: 'AUS' },
  { matchNumber: 30, round: 'group', group: 'C', kickoffAt: bst('2026-06-19', '23:00'), teamA: 'SCO', teamB: 'MAR' },
  // June 20
  { matchNumber: 31, round: 'group', group: 'C', kickoffAt: bst('2026-06-20', '01:30'), teamA: 'BRA', teamB: 'HAI' },
  { matchNumber: 32, round: 'group', group: 'D', kickoffAt: bst('2026-06-20', '04:00'), teamA: 'TUR', teamB: 'PAR' },
  { matchNumber: 33, round: 'group', group: 'F', kickoffAt: bst('2026-06-20', '18:00'), teamA: 'NED', teamB: 'SWE' },
  { matchNumber: 34, round: 'group', group: 'E', kickoffAt: bst('2026-06-20', '21:00'), teamA: 'GER', teamB: 'CIV' },
  // June 21
  { matchNumber: 35, round: 'group', group: 'E', kickoffAt: bst('2026-06-21', '01:00'), teamA: 'ECU', teamB: 'CUW' },
  { matchNumber: 36, round: 'group', group: 'F', kickoffAt: bst('2026-06-21', '05:00'), teamA: 'TUN', teamB: 'JPN' },
  { matchNumber: 37, round: 'group', group: 'H', kickoffAt: bst('2026-06-21', '17:00'), teamA: 'ESP', teamB: 'KSA' },
  { matchNumber: 38, round: 'group', group: 'G', kickoffAt: bst('2026-06-21', '20:00'), teamA: 'BEL', teamB: 'IRN' },
  { matchNumber: 39, round: 'group', group: 'H', kickoffAt: bst('2026-06-21', '23:00'), teamA: 'URU', teamB: 'CPV' },
  // June 22
  { matchNumber: 40, round: 'group', group: 'G', kickoffAt: bst('2026-06-22', '02:00'), teamA: 'NZL', teamB: 'EGY' },
  { matchNumber: 41, round: 'group', group: 'J', kickoffAt: bst('2026-06-22', '18:00'), teamA: 'ARG', teamB: 'AUT' },
  { matchNumber: 42, round: 'group', group: 'I', kickoffAt: bst('2026-06-22', '22:00'), teamA: 'FRA', teamB: 'IRQ' },
  // June 23
  { matchNumber: 43, round: 'group', group: 'I', kickoffAt: bst('2026-06-23', '01:00'), teamA: 'NOR', teamB: 'SEN' },
  { matchNumber: 44, round: 'group', group: 'J', kickoffAt: bst('2026-06-23', '04:00'), teamA: 'JOR', teamB: 'ALG' },
  { matchNumber: 45, round: 'group', group: 'K', kickoffAt: bst('2026-06-23', '18:00'), teamA: 'POR', teamB: 'UZB' },
  { matchNumber: 46, round: 'group', group: 'L', kickoffAt: bst('2026-06-23', '21:00'), teamA: 'ENG', teamB: 'GHA' },
  // June 24
  { matchNumber: 47, round: 'group', group: 'L', kickoffAt: bst('2026-06-24', '00:00'), teamA: 'PAN', teamB: 'CRO' },
  { matchNumber: 48, round: 'group', group: 'K', kickoffAt: bst('2026-06-24', '03:00'), teamA: 'COL', teamB: 'COD' },
  // Group B final round (simultaneous, 20:00 UK)
  { matchNumber: 49, round: 'group', group: 'B', kickoffAt: bst('2026-06-24', '20:00'), teamA: 'SUI', teamB: 'CAN' },
  { matchNumber: 50, round: 'group', group: 'B', kickoffAt: bst('2026-06-24', '20:00'), teamA: 'BIH', teamB: 'QAT' },
  // Group C final round (simultaneous, 23:00 UK)
  { matchNumber: 51, round: 'group', group: 'C', kickoffAt: bst('2026-06-24', '23:00'), teamA: 'MAR', teamB: 'HAI' },
  { matchNumber: 52, round: 'group', group: 'C', kickoffAt: bst('2026-06-24', '23:00'), teamA: 'SCO', teamB: 'BRA' },
  // June 25
  // Group A final round (simultaneous, 02:00 UK)
  { matchNumber: 53, round: 'group', group: 'A', kickoffAt: bst('2026-06-25', '02:00'), teamA: 'RSA', teamB: 'KOR' },
  { matchNumber: 54, round: 'group', group: 'A', kickoffAt: bst('2026-06-25', '02:00'), teamA: 'CZE', teamB: 'MEX' },
  // Group E final round (simultaneous, 21:00 UK)
  { matchNumber: 55, round: 'group', group: 'E', kickoffAt: bst('2026-06-25', '21:00'), teamA: 'CUW', teamB: 'CIV' },
  { matchNumber: 56, round: 'group', group: 'E', kickoffAt: bst('2026-06-25', '21:00'), teamA: 'ECU', teamB: 'GER' },
  // June 26
  // Group F final round (simultaneous, 00:00 UK)
  { matchNumber: 57, round: 'group', group: 'F', kickoffAt: bst('2026-06-26', '00:00'), teamA: 'TUN', teamB: 'NED' },
  { matchNumber: 58, round: 'group', group: 'F', kickoffAt: bst('2026-06-26', '00:00'), teamA: 'JPN', teamB: 'SWE' },
  // Group D final round (simultaneous, 03:00 UK)
  { matchNumber: 59, round: 'group', group: 'D', kickoffAt: bst('2026-06-26', '03:00'), teamA: 'TUR', teamB: 'USA' },
  { matchNumber: 60, round: 'group', group: 'D', kickoffAt: bst('2026-06-26', '03:00'), teamA: 'PAR', teamB: 'AUS' },
  // Group I final round (simultaneous, 20:00 UK)
  { matchNumber: 61, round: 'group', group: 'I', kickoffAt: bst('2026-06-26', '20:00'), teamA: 'NOR', teamB: 'FRA' },
  { matchNumber: 62, round: 'group', group: 'I', kickoffAt: bst('2026-06-26', '20:00'), teamA: 'SEN', teamB: 'IRQ' },
  // June 27
  // Group H final round (simultaneous, 01:00 UK)
  { matchNumber: 63, round: 'group', group: 'H', kickoffAt: bst('2026-06-27', '01:00'), teamA: 'CPV', teamB: 'KSA' },
  { matchNumber: 64, round: 'group', group: 'H', kickoffAt: bst('2026-06-27', '01:00'), teamA: 'URU', teamB: 'ESP' },
  // Group G final round (simultaneous, 04:00 UK)
  { matchNumber: 65, round: 'group', group: 'G', kickoffAt: bst('2026-06-27', '04:00'), teamA: 'NZL', teamB: 'BEL' },
  { matchNumber: 66, round: 'group', group: 'G', kickoffAt: bst('2026-06-27', '04:00'), teamA: 'EGY', teamB: 'IRN' },
  // Group L final round (simultaneous, 22:00 UK)
  { matchNumber: 67, round: 'group', group: 'L', kickoffAt: bst('2026-06-27', '22:00'), teamA: 'PAN', teamB: 'ENG' },
  { matchNumber: 68, round: 'group', group: 'L', kickoffAt: bst('2026-06-27', '22:00'), teamA: 'CRO', teamB: 'GHA' },
  // June 28
  // Group K final round (simultaneous, 00:30 UK)
  { matchNumber: 69, round: 'group', group: 'K', kickoffAt: bst('2026-06-28', '00:30'), teamA: 'COL', teamB: 'POR' },
  { matchNumber: 70, round: 'group', group: 'K', kickoffAt: bst('2026-06-28', '00:30'), teamA: 'COD', teamB: 'UZB' },
  // Group J final round (simultaneous, 03:00 UK)
  { matchNumber: 71, round: 'group', group: 'J', kickoffAt: bst('2026-06-28', '03:00'), teamA: 'ALG', teamB: 'AUT' },
  { matchNumber: 72, round: 'group', group: 'J', kickoffAt: bst('2026-06-28', '03:00'), teamA: 'JOR', teamB: 'ARG' },
]

// ----------------------------------------------------------------------------
// KNOCKOUTS — 32 matches
// Slot labels follow Sky Sports / FIFA's published bracket. The eight slots
// that take a third-placed team are labelled with the allowed source groups.
// ----------------------------------------------------------------------------

const knockoutMatches: Match[] = [
  // R32 — June 28 to July 3
  { matchNumber: 73, round: 'r32', kickoffAt: bst('2026-06-28', '20:00'), slotALabel: '2nd Group A', slotBLabel: '2nd Group B' },
  { matchNumber: 74, round: 'r32', kickoffAt: bst('2026-06-29', '21:30'), slotALabel: '1st Group E', slotBLabel: '3rd from A/B/C/D/F' },
  { matchNumber: 75, round: 'r32', kickoffAt: bst('2026-06-30', '02:00'), slotALabel: '1st Group F', slotBLabel: '2nd Group C' },
  { matchNumber: 76, round: 'r32', kickoffAt: bst('2026-06-29', '18:00'), slotALabel: '1st Group C', slotBLabel: '2nd Group F' },
  { matchNumber: 77, round: 'r32', kickoffAt: bst('2026-06-30', '22:00'), slotALabel: '1st Group I', slotBLabel: '3rd from C/D/F/G/H' },
  { matchNumber: 78, round: 'r32', kickoffAt: bst('2026-06-30', '18:00'), slotALabel: '2nd Group E', slotBLabel: '2nd Group I' },
  { matchNumber: 79, round: 'r32', kickoffAt: bst('2026-07-01', '02:00'), slotALabel: '1st Group A', slotBLabel: '3rd from C/E/F/H/I' },
  { matchNumber: 80, round: 'r32', kickoffAt: bst('2026-07-01', '17:00'), slotALabel: '1st Group L', slotBLabel: '3rd from E/H/I/J/K' },
  { matchNumber: 81, round: 'r32', kickoffAt: bst('2026-07-02', '01:00'), slotALabel: '1st Group D', slotBLabel: '3rd from B/E/F/I/J' },
  { matchNumber: 82, round: 'r32', kickoffAt: bst('2026-07-01', '21:00'), slotALabel: '1st Group G', slotBLabel: '3rd from A/E/H/I/J' },
  { matchNumber: 83, round: 'r32', kickoffAt: bst('2026-07-03', '00:00'), slotALabel: '2nd Group K', slotBLabel: '2nd Group L' },
  { matchNumber: 84, round: 'r32', kickoffAt: bst('2026-07-02', '20:00'), slotALabel: '1st Group H', slotBLabel: '2nd Group J' },
  { matchNumber: 85, round: 'r32', kickoffAt: bst('2026-07-03', '04:00'), slotALabel: '1st Group B', slotBLabel: '3rd from E/F/G/I/J' },
  { matchNumber: 86, round: 'r32', kickoffAt: bst('2026-07-03', '23:00'), slotALabel: '1st Group J', slotBLabel: '2nd Group H' },
  { matchNumber: 87, round: 'r32', kickoffAt: bst('2026-07-04', '02:30'), slotALabel: '1st Group K', slotBLabel: '3rd from D/E/I/J/L' },
  { matchNumber: 88, round: 'r32', kickoffAt: bst('2026-07-03', '19:00'), slotALabel: '2nd Group D', slotBLabel: '2nd Group G' },

  // R16 — July 4 to 7
  { matchNumber: 89, round: 'r16', kickoffAt: bst('2026-07-04', '22:00'), slotALabel: 'Winner M74', slotBLabel: 'Winner M77', feedsFromA: 74, feedsFromB: 77 },
  { matchNumber: 90, round: 'r16', kickoffAt: bst('2026-07-04', '18:00'), slotALabel: 'Winner M73', slotBLabel: 'Winner M75', feedsFromA: 73, feedsFromB: 75 },
  { matchNumber: 91, round: 'r16', kickoffAt: bst('2026-07-05', '21:00'), slotALabel: 'Winner M76', slotBLabel: 'Winner M78', feedsFromA: 76, feedsFromB: 78 },
  { matchNumber: 92, round: 'r16', kickoffAt: bst('2026-07-06', '01:00'), slotALabel: 'Winner M79', slotBLabel: 'Winner M80', feedsFromA: 79, feedsFromB: 80 },
  { matchNumber: 93, round: 'r16', kickoffAt: bst('2026-07-06', '20:00'), slotALabel: 'Winner M83', slotBLabel: 'Winner M84', feedsFromA: 83, feedsFromB: 84 },
  { matchNumber: 94, round: 'r16', kickoffAt: bst('2026-07-07', '01:00'), slotALabel: 'Winner M81', slotBLabel: 'Winner M82', feedsFromA: 81, feedsFromB: 82 },
  { matchNumber: 95, round: 'r16', kickoffAt: bst('2026-07-07', '17:00'), slotALabel: 'Winner M86', slotBLabel: 'Winner M88', feedsFromA: 86, feedsFromB: 88 },
  { matchNumber: 96, round: 'r16', kickoffAt: bst('2026-07-07', '21:00'), slotALabel: 'Winner M85', slotBLabel: 'Winner M87', feedsFromA: 85, feedsFromB: 87 },

  // QF — July 9 to 12
  { matchNumber: 97,  round: 'qf', kickoffAt: bst('2026-07-09', '21:00'), slotALabel: 'Winner M89', slotBLabel: 'Winner M90', feedsFromA: 89, feedsFromB: 90 },
  { matchNumber: 98,  round: 'qf', kickoffAt: bst('2026-07-10', '20:00'), slotALabel: 'Winner M93', slotBLabel: 'Winner M94', feedsFromA: 93, feedsFromB: 94 },
  { matchNumber: 99,  round: 'qf', kickoffAt: bst('2026-07-11', '22:00'), slotALabel: 'Winner M91', slotBLabel: 'Winner M92', feedsFromA: 91, feedsFromB: 92 },
  { matchNumber: 100, round: 'qf', kickoffAt: bst('2026-07-12', '02:00'), slotALabel: 'Winner M95', slotBLabel: 'Winner M96', feedsFromA: 95, feedsFromB: 96 },

  // SF — July 14, 15
  { matchNumber: 101, round: 'sf', kickoffAt: bst('2026-07-14', '20:00'), slotALabel: 'Winner M97', slotBLabel: 'Winner M98', feedsFromA: 97, feedsFromB: 98 },
  { matchNumber: 102, round: 'sf', kickoffAt: bst('2026-07-15', '20:00'), slotALabel: 'Winner M99', slotBLabel: 'Winner M100', feedsFromA: 99, feedsFromB: 100 },

  // Third place — July 18
  { matchNumber: 103, round: 'third', kickoffAt: bst('2026-07-18', '22:00'), slotALabel: 'Loser M101', slotBLabel: 'Loser M102', feedsFromA: 101, feedsFromB: 102 },

  // Final — July 19
  { matchNumber: 104, round: 'final', kickoffAt: bst('2026-07-19', '20:00'), slotALabel: 'Winner M101', slotBLabel: 'Winner M102', feedsFromA: 101, feedsFromB: 102 },
]

export const MATCHES: Match[] = [...groupMatches, ...knockoutMatches]

export const MATCHES_BY_NUMBER: Record<number, Match> = Object.fromEntries(
  MATCHES.map(m => [m.matchNumber, m]),
)
