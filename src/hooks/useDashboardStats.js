import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDashboardStats() {
  const [stats, setStats] = useState(null)
  const [alerts, setAlerts] = useState({ customers: [], staff: [] })

  useEffect(() => {
    async function load() {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const [
        { count: total },
        { count: quotedMonth },
        { count: pending },
        { count: totalQuoted },
        { count: totalWon },
      ] = await Promise.all([
        supabase.from('referrals').select('*', { count: 'exact', head: true }),
        supabase.from('referrals').select('*', { count: 'exact', head: true })
          .in('status', ['Quoted', 'Won'])
          .gte('updated_at', monthStart),
        supabase.from('gift_cards').select('*', { count: 'exact', head: true })
          .eq('status', 'Pending'),
        supabase.from('referrals').select('*', { count: 'exact', head: true })
          .in('status', ['Quoted', 'Won']),
        supabase.from('referrals').select('*', { count: 'exact', head: true })
          .eq('status', 'Won'),
      ])

      const quotedTotal = totalQuoted ?? 0
      const wonTotal    = totalWon ?? 0

      setStats({
        total:       total ?? 0,
        quotedMonth: quotedMonth ?? 0,
        pending:     pending ?? 0,
        rate:        (total ?? 0) > 0 ? Math.round((quotedTotal / (total ?? 1)) * 100) : 0,
        winRate:     quotedTotal > 0 ? Math.round((wonTotal / quotedTotal) * 100) : 0,
      })

      // ── Alert: customers with 5+ referrals and <40% conversion ──
      const { data: customers } = await supabase.from('customers').select('id, name')
      const { data: allReferrals } = await supabase.from('referrals').select('customer_id, status')

      const customerAlerts = (customers ?? []).reduce((acc, c) => {
        const mine   = (allReferrals ?? []).filter(r => r.customer_id === c.id)
        const tot    = mine.length
        const quoted = mine.filter(r => r.status === 'Quoted' || r.status === 'Won').length
        const rate   = tot > 0 ? Math.round((quoted / tot) * 100) : 0
        if (tot >= 5 && rate < 40) acc.push({ ...c, total: tot, quoted, rate })
        return acc
      }, [])

      // ── Alert: staff with 5+ quoted referrals and <20% win rate ──
      const { data: staffList } = await supabase.from('staff').select('id, name').eq('active', true)
      const { data: staffRefs } = await supabase.from('referrals').select('assigned_to, status')

      const staffAlerts = (staffList ?? []).reduce((acc, s) => {
        const mine    = (staffRefs ?? []).filter(r => r.assigned_to === s.id)
        const quoted  = mine.filter(r => r.status === 'Quoted' || r.status === 'Won').length
        const won     = mine.filter(r => r.status === 'Won').length
        const winRate = quoted > 0 ? Math.round((won / quoted) * 100) : 0
        if (quoted >= 5 && winRate < 20) acc.push({ ...s, quoted, won, winRate })
        return acc
      }, [])

      setAlerts({ customers: customerAlerts, staff: staffAlerts })
    }
    load()
  }, [])

  return { stats, alerts }
}
