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

// Debounced auto-save for a single pick row. Returns a `save` function
// the caller invokes on every change; the actual upsert is throttled.
export function usePickSaver(userId: string | undefined) {
  const pending = useRef<Map<number, Partial<PickRow>>>(new Map())
  const timer = useRef<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  function flush() {
    if (!userId) return
    const rows = [...pending.current.entries()].map(([matchNumber, partial]) => ({
      user_id: userId,
      match_number: matchNumber,
      predicted_winner_code: partial.predicted_winner_code ?? null,
      predicted_score_a: partial.predicted_score_a ?? null,
      predicted_score_b: partial.predicted_score_b ?? null,
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

  function save(matchNumber: number, patch: Partial<PickRow>) {
    if (!userId) return
    const prev = pending.current.get(matchNumber) ?? {}
    pending.current.set(matchNumber, { ...prev, ...patch })
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, 400)
  }

  return { save, status }
}
