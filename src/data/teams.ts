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
}

export const TEAMS: Team[] = [
  // Group A
  { code: 'MEX', name: 'Mexico',           group: 'A', flag: '🇲🇽' },
  { code: 'RSA', name: 'South Africa',     group: 'A', flag: '🇿🇦' },
  { code: 'KOR', name: 'South Korea',      group: 'A', flag: '🇰🇷' },
  { code: 'CZE', name: 'Czech Republic',   group: 'A', flag: '🇨🇿' },

  // Group B
  { code: 'CAN', name: 'Canada',           group: 'B', flag: '🇨🇦' },
  { code: 'SUI', name: 'Switzerland',      group: 'B', flag: '🇨🇭' },
  { code: 'BIH', name: 'Bosnia & Herz.',   group: 'B', flag: '🇧🇦' },
  { code: 'QAT', name: 'Qatar',            group: 'B', flag: '🇶🇦' },

  // Group C
  { code: 'BRA', name: 'Brazil',           group: 'C', flag: '🇧🇷' },
  { code: 'MAR', name: 'Morocco',          group: 'C', flag: '🇲🇦' },
  { code: 'HAI', name: 'Haiti',            group: 'C', flag: '🇭🇹' },
  { code: 'SCO', name: 'Scotland',         group: 'C', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },

  // Group D
  { code: 'USA', name: 'United States',    group: 'D', flag: '🇺🇸' },
  { code: 'AUS', name: 'Australia',        group: 'D', flag: '🇦🇺' },
  { code: 'TUR', name: 'Türkiye',          group: 'D', flag: '🇹🇷' },
  { code: 'PAR', name: 'Paraguay',         group: 'D', flag: '🇵🇾' },

  // Group E
  { code: 'GER', name: 'Germany',          group: 'E', flag: '🇩🇪' },
  { code: 'CIV', name: 'Ivory Coast',      group: 'E', flag: '🇨🇮' },
  { code: 'CUW', name: 'Curaçao',          group: 'E', flag: '🇨🇼' },
  { code: 'ECU', name: 'Ecuador',          group: 'E', flag: '🇪🇨' },

  // Group F
  { code: 'NED', name: 'Netherlands',      group: 'F', flag: '🇳🇱' },
  { code: 'JPN', name: 'Japan',            group: 'F', flag: '🇯🇵' },
  { code: 'SWE', name: 'Sweden',           group: 'F', flag: '🇸🇪' },
  { code: 'TUN', name: 'Tunisia',          group: 'F', flag: '🇹🇳' },

  // Group G
  { code: 'BEL', name: 'Belgium',          group: 'G', flag: '🇧🇪' },
  { code: 'IRN', name: 'Iran',             group: 'G', flag: '🇮🇷' },
  { code: 'EGY', name: 'Egypt',            group: 'G', flag: '🇪🇬' },
  { code: 'NZL', name: 'New Zealand',      group: 'G', flag: '🇳🇿' },

  // Group H
  { code: 'ESP', name: 'Spain',            group: 'H', flag: '🇪🇸' },
  { code: 'URU', name: 'Uruguay',          group: 'H', flag: '🇺🇾' },
  { code: 'CPV', name: 'Cape Verde',       group: 'H', flag: '🇨🇻' },
  { code: 'KSA', name: 'Saudi Arabia',     group: 'H', flag: '🇸🇦' },

  // Group I
  { code: 'FRA', name: 'France',           group: 'I', flag: '🇫🇷' },
  { code: 'SEN', name: 'Senegal',          group: 'I', flag: '🇸🇳' },
  { code: 'IRQ', name: 'Iraq',             group: 'I', flag: '🇮🇶' },
  { code: 'NOR', name: 'Norway',           group: 'I', flag: '🇳🇴' },

  // Group J
  { code: 'ARG', name: 'Argentina',        group: 'J', flag: '🇦🇷' },
  { code: 'AUT', name: 'Austria',          group: 'J', flag: '🇦🇹' },
  { code: 'ALG', name: 'Algeria',          group: 'J', flag: '🇩🇿' },
  { code: 'JOR', name: 'Jordan',           group: 'J', flag: '🇯🇴' },

  // Group K
  { code: 'POR', name: 'Portugal',         group: 'K', flag: '🇵🇹' },
  { code: 'COL', name: 'Colombia',         group: 'K', flag: '🇨🇴' },
  { code: 'UZB', name: 'Uzbekistan',       group: 'K', flag: '🇺🇿' },
  { code: 'COD', name: 'DR Congo',         group: 'K', flag: '🇨🇩' },

  // Group L
  { code: 'ENG', name: 'England',          group: 'L', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'CRO', name: 'Croatia',          group: 'L', flag: '🇭🇷' },
  { code: 'GHA', name: 'Ghana',            group: 'L', flag: '🇬🇭' },
  { code: 'PAN', name: 'Panama',           group: 'L', flag: '🇵🇦' },
]

export const TEAMS_BY_CODE: Record<string, Team> = Object.fromEntries(
  TEAMS.map(t => [t.code, t]),
)

export const GROUPS: Group[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export function teamsInGroup(g: Group): Team[] {
  return TEAMS.filter(t => t.group === g)
}
