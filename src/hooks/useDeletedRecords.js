import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useDeletedRecords() {
  const [deletedCustomers, setDeletedCustomers] = useState([])
  const [deletedReferrals, setDeletedReferrals] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const [{ data: customers }, { data: referrals }] = await Promise.all([
      supabase
        .from('customers')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false }),
      supabase
        .from('referrals')
        .select('*, customers(name)')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false }),
    ])
    setDeletedCustomers(customers ?? [])
    setDeletedReferrals(referrals ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  async function restoreCustomer(id) {
    const { error } = await supabase
      .from('customers')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id)
    if (error) throw error
    await fetch()
  }

  async function restoreReferral(id) {
    const { error } = await supabase
      .from('referrals')
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id)
    if (error) throw error
    await fetch()
  }

  return { deletedCustomers, deletedReferrals, loading, restoreCustomer, restoreReferral, refetch: fetch }
}
