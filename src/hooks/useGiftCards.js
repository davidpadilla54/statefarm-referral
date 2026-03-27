import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useGiftCards() {
  const [giftCards, setGiftCards] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('gift_cards')
      .select(`*, customers(name, email), referrals(referred_name)`)
      .order('earned_at', { ascending: false })
    setGiftCards(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  async function markSent(id) {
    await supabase.from('gift_cards').update({ status: 'Sent', sent_at: new Date().toISOString() }).eq('id', id)
    fetch()
  }

  return { giftCards, loading, markSent, refetch: fetch }
}
