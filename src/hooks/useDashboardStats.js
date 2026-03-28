import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDashboardStats() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function load() {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const [
        { count: total },
        { count: quotedMonth },
        { count: pending },
        { count: totalQuoted },
      ] = await Promise.all([
        supabase.from('referrals').select('*', { count: 'exact', head: true }),
        supabase.from('referrals').select('*', { count: 'exact', head: true })
          .in('status', ['Quoted', 'Won'])
          .gte('updated_at', monthStart),
        supabase.from('gift_cards').select('*', { count: 'exact', head: true })
          .eq('status', 'Pending'),
        supabase.from('referrals').select('*', { count: 'exact', head: true })
          .in('status', ['Quoted', 'Won']),
      ])

      setStats({
        total: total ?? 0,
        quotedMonth: quotedMonth ?? 0,
        pending: pending ?? 0,
        rate: total > 0 ? Math.round(((totalQuoted ?? 0) / total) * 100) : 0,
      })
    }
    load()
  }, [])

  return { stats }
}
