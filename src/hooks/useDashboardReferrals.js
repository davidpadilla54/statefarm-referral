import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useDashboardReferrals() {
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [newRowIds, setNewRowIds] = useState(new Set())

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('referrals')
      .select(`*, customers(name, slug, tier, email, created_by), staff:assigned_to(name)`)
      .order('submitted_at', { ascending: false })
    setReferrals(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()

    const channel = supabase
      .channel('referrals-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'referrals' }, payload => {
        fetch()
        setNewRowIds(prev => new Set([...prev, payload.new.id]))
        setTimeout(() => setNewRowIds(prev => { const s = new Set(prev); s.delete(payload.new.id); return s }), 2500)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'referrals' }, () => fetch())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetch])

  return { referrals, loading, newRowIds, refetch: fetch }
}
