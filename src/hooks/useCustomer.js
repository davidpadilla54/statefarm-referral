import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCustomer(slug) {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) { setLoading(false); return }
    setLoading(true)
    supabase
      .from('customers')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data, error }) => {
        setCustomer(data)
        setError(error)
        setLoading(false)
      })
  }, [slug])

  return { customer, loading, error }
}
