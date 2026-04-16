import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useGiftCards() {
  const [giftCards, setGiftCards] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('gift_cards')
      .select(`*, customers(name, email), referrals(referred_name, gift_card_preference)`)
      .order('earned_at', { ascending: false })
    setGiftCards(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  async function markSent(id) {
    await supabase.from('gift_cards').update({ status: 'Sent', sent_at: new Date().toISOString() }).eq('id', id)
    fetch()
  }

  async function deleteGiftCard(id) {
    const { error } = await supabase.from('gift_cards').delete().eq('id', id)
    if (error) throw error
    fetch()
  }

  async function editGiftCard(id, updates) {
    const { error } = await supabase.from('gift_cards').update(updates).eq('id', id)
    if (error) throw error
    fetch()
  }

  return { giftCards, loading, markSent, deleteGiftCard, editGiftCard, refetch: fetch }
}
