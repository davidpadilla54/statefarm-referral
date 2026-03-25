import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getTierForCount } from '../lib/tiers'

export function useLeaderboard() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: customers } = await supabase.from('customers').select('id, name, tier')
      const { data: referrals } = await supabase
        .from('referrals')
        .select('customer_id, status')

      if (!customers) { setLoading(false); return }

      const board = customers.map(c => {
        const mine = (referrals ?? []).filter(r => r.customer_id === c.id)
        const submitted = mine.length
        const quoted = mine.filter(r => r.status === 'Quoted' || r.status === 'Won').length
        const tier = getTierForCount(quoted)
        return { ...c, submitted, quoted, tier: tier.name, amount: tier.amount, earned: quoted * tier.amount }
      })

      board.sort((a, b) => b.quoted - a.quoted || b.submitted - a.submitted)
      setRows(board)
      setLoading(false)
    }
    load()
  }, [])

  return { rows, loading }
}
