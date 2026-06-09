// 2026 FIFA World Cup teams, grouped per the December 5, 2025 draw.
// `code` is a stable slug used as the team id throughout the app.
// `flag` is an emoji shortcut; we render the real flag image from `code` via a CDN.

export type Group =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'

export type Team = {
  code: string      // stable id, used as foreign key
  name: string
  group: Group
  flag: string      // emoji flag
  rank: number      // FIFA/Coca-Cola Men's World Ranking
}

/*
  FIFA Men's World Ranking position per the 1 April 2026 update
  (the last official ranking before kickoff; FIFA's next update lands
  on 11 June 2026, same day as the opener).

  Top-50 ranks are exact. Ranks below 50 (marked with a trailing
  comment) are best estimates — FIFA's published table beyond 50 was
  unavailable; refresh these post-tournament if you want them precise.
*/
export const TEAMS: Team[] = [
  // Group A
  { code: 'MEX', name: 'Mexico',           group: 'A', flag: '🇲🇽',          rank: 14 },
  { code: 'RSA', name: 'South Africa',     group: 'A', flag: '🇿🇦',          rank: 57 /* est */ },
  { code: 'KOR', name: 'South Korea',      group: 'A', flag: '🇰🇷',          rank: 25 },
  { code: 'CZE', name: 'Czech Republic',   group: 'A', flag: '🇨🇿',          rank: 39 },

  // Group B
  { code: 'CAN', name: 'Canada',           group: 'B', flag: '🇨🇦',          rank: 30 },
  { code: 'SUI', name: 'Switzerland',      group: 'B', flag: '🇨🇭',          rank: 19 },
  { code: 'BIH', name: 'Bosnia & Herz.',   group: 'B', flag: '🇧🇦',          rank: 73 /* est */ },
  { code: 'QAT', name: 'Qatar',            group: 'B', flag: '🇶🇦',          rank: 54 /* est */ },

  // Group C
  { code: 'BRA', name: 'Brazil',           group: 'C', flag: '🇧🇷',          rank: 6 },
  { code: 'MAR', name: 'Morocco',          group: 'C', flag: '🇲🇦',          rank: 7 },
  { code: 'HAI', name: 'Haiti',            group: 'C', flag: '🇭🇹',          rank: 95 /* est */ },
  { code: 'SCO', name: 'Scotland',         group: 'C', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',     rank: 42 },

  // Group D
  { code: 'USA', name: 'United States',    group: 'D', flag: '🇺🇸',          rank: 17 },
  { code: 'AUS', name: 'Australia',        group: 'D', flag: '🇦🇺',          rank: 27 },
  { code: 'TUR', name: 'Türkiye',          group: 'D', flag: '🇹🇷',          rank: 22 },
  { code: 'PAR', name: 'Paraguay',         group: 'D', flag: '🇵🇾',          rank: 40 },

  // Group E
  { code: 'GER', name: 'Germany',          group: 'E', flag: '🇩🇪',          rank: 10 },
  { code: 'CIV', name: 'Ivory Coast',      group: 'E', flag: '🇨🇮',          rank: 33 },
  { code: 'CUW', name: 'Curaçao',          group: 'E', flag: '🇨🇼',          rank: 82 /* est */ },
  { code: 'ECU', name: 'Ecuador',          group: 'E', flag: '🇪🇨',          rank: 23 },

  // Group F
  { code: 'NED', name: 'Netherlands',      group: 'F', flag: '🇳🇱',          rank: 8 },
  { code: 'JPN', name: 'Japan',            group: 'F', flag: '🇯🇵',          rank: 18 },
  { code: 'SWE', name: 'Sweden',           group: 'F', flag: '🇸🇪',          rank: 38 },
  { code: 'TUN', name: 'Tunisia',          group: 'F', flag: '🇹🇳',          rank: 46 },

  // Group G
  { code: 'BEL', name: 'Belgium',          group: 'G', flag: '🇧🇪',          rank: 9 },
  { code: 'IRN', name: 'Iran',             group: 'G', flag: '🇮🇷',          rank: 21 },
  { code: 'EGY', name: 'Egypt',            group: 'G', flag: '🇪🇬',          rank: 29 },
  { code: 'NZL', name: 'New Zealand',      group: 'G', flag: '🇳🇿',          rank: 94 /* est */ },

  // Group H
  { code: 'ESP', name: 'Spain',            group: 'H', flag: '🇪🇸',          rank: 2 },
  { code: 'URU', name: 'Uruguay',          group: 'H', flag: '🇺🇾',          rank: 16 },
  { code: 'CPV', name: 'Cape Verde',       group: 'H', flag: '🇨🇻',          rank: 70 /* est */ },
  { code: 'KSA', name: 'Saudi Arabia',     group: 'H', flag: '🇸🇦',          rank: 60 /* est */ },

  // Group I
  { code: 'FRA', name: 'France',           group: 'I', flag: '🇫🇷',          rank: 3 },
  { code: 'SEN', name: 'Senegal',          group: 'I', flag: '🇸🇳',          rank: 15 },
  { code: 'IRQ', name: 'Iraq',             group: 'I', flag: '🇮🇶',          rank: 58 /* est */ },
  { code: 'NOR', name: 'Norway',           group: 'I', flag: '🇳🇴',          rank: 31 },

  // Group J
  { code: 'ARG', name: 'Argentina',        group: 'J', flag: '🇦🇷',          rank: 1 },
  { code: 'AUT', name: 'Austria',          group: 'J', flag: '🇦🇹',          rank: 24 },
  { code: 'ALG', name: 'Algeria',          group: 'J', flag: '🇩🇿',          rank: 28 },
  { code: 'JOR', name: 'Jordan',           group: 'J', flag: '🇯🇴',          rank: 68 /* est */ },

  // Group K
  { code: 'POR', name: 'Portugal',         group: 'K', flag: '🇵🇹',          rank: 5 },
  { code: 'COL', name: 'Colombia',         group: 'K', flag: '🇨🇴',          rank: 13 },
  { code: 'UZB', name: 'Uzbekistan',       group: 'K', flag: '🇺🇿',          rank: 50 },
  { code: 'COD', name: 'DR Congo',         group: 'K', flag: '🇨🇩',          rank: 45 },

  // Group L
  { code: 'ENG', name: 'England',          group: 'L', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',     rank: 4 },
  { code: 'CRO', name: 'Croatia',          group: 'L', flag: '🇭🇷',          rank: 11 },
  { code: 'GHA', name: 'Ghana',            group: 'L', flag: '🇬🇭',          rank: 75 /* est */ },
  { code: 'PAN', name: 'Panama',           group: 'L', flag: '🇵🇦',          rank: 34 },
]

export const TEAMS_BY_CODE: Record<string, Team> = Object.fromEntries(
  TEAMS.map(t => [t.code, t]),
)

export const GROUPS: Group[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export function teamsInGroup(g: Group): Team[] {
  return TEAMS.filter(t => t.group === g)
}
