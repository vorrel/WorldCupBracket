// Plain row types for our public schema. We rely on these instead of
// generating Supabase types — small surface, easier to maintain.

export type Round = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final'

export type TeamRow = {
  code: string
  name: string
  group_letter: string
  flag: string
}

export type MatchRow = {
  match_number: number
  round: Round
  group_letter: string | null
  kickoff_at: string
  team_a_code: string | null
  team_b_code: string | null
  slot_a_label: string | null
  slot_b_label: string | null
  feeds_from_a: number | null
  feeds_from_b: number | null
  actual_team_a_code: string | null
  actual_team_b_code: string | null
  actual_winner_code: string | null
  actual_score_a: number | null
  actual_score_b: number | null
  updated_at: string
}

export type ProfileRow = {
  id: string
  display_name: string
  created_at: string
}

export type PickRow = {
  user_id: string
  match_number: number
  predicted_winner_code: string | null
  predicted_score_a: number | null
  predicted_score_b: number | null
  updated_at: string
}
