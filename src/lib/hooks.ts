import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'
import type { MatchRow, PickRow } from './types'

export function useMatches() {
  const [matches, setMatches] = useState<MatchRow[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    supabase
      .from('matches')
      .select('*')
      .order('match_number', { ascending: true })
      .then(({ data }) => {
        if (!active) return
        setMatches(data ?? [])
        setLoading(false)
      })
    return () => { active = false }
  }, [])
  return { matches, loading }
}

export function usePicks(userId: string | undefined) {
  const [picks, setPicks] = useState<PickRow[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!userId) { setPicks([]); setLoading(false); return }
    let active = true
    supabase
      .from('picks')
      .select('*')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (!active) return
        setPicks(data ?? [])
        setLoading(false)
      })
    return () => { active = false }
  }, [userId])
  return { picks, setPicks, loading }
}

// Shape of fields the saver writes for a single match.
export type PickWrite = {
  predicted_winner_code: string | null
  predicted_score_a: number | null
  predicted_score_b: number | null
}

// Debounced auto-save. Callers pass the FULL desired state of a row each
// time, so the upsert always carries every field — picking a winner won't
// clobber the score and vice versa.
export function usePickSaver(userId: string | undefined) {
  const pending = useRef<Map<number, PickWrite>>(new Map())
  const timer = useRef<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  function flush() {
    if (!userId) return
    const rows = [...pending.current.entries()].map(([matchNumber, row]) => ({
      user_id: userId,
      match_number: matchNumber,
      predicted_winner_code: row.predicted_winner_code,
      predicted_score_a: row.predicted_score_a,
      predicted_score_b: row.predicted_score_b,
    }))
    if (!rows.length) return
    pending.current = new Map()
    setStatus('saving')
    supabase
      .from('picks')
      .upsert(rows, { onConflict: 'user_id,match_number' })
      .then(({ error }) => {
        if (error) {
          console.error('pick save failed', error)
          setStatus('error')
        } else {
          setStatus('saved')
          window.setTimeout(() => setStatus('idle'), 1200)
        }
      })
  }

  function save(matchNumber: number, row: PickWrite) {
    if (!userId) return
    pending.current.set(matchNumber, row)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, 400)
  }

  return { save, status }
}
