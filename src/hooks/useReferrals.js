import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useReferrals(customerId) {
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!customerId) { setLoading(false); return }
    setLoading(true)
    supabase
      .from('referrals')
      .select('*')
      .eq('customer_id', customerId)
      .order('submitted_at', { ascending: false })
      .then(({ data, error }) => {
        setReferrals(data ?? [])
        setError(error)
        setLoading(false)
      })
  }, [customerId])

  return { referrals, loading, error }
}
