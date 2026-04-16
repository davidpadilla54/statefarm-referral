import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('customers')
      .select('*, referrals(id, deleted_at)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    setCustomers(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  async function addCustomer({ name, phone, email, createdBy }) {
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const { error } = await supabase.from('customers').insert({
      name: name.trim(),
      slug,
      phone: phone.trim(),
      email: email.trim(),
      created_by: createdBy ?? null,
    })
    if (error) throw error
    await fetch()
    return slug
  }

  async function updateCustomer(id, updates) {
    const { error } = await supabase.from('customers').update(updates).eq('id', id)
    if (error) throw error
    await fetch()
  }

  async function deleteCustomer(id, deletedBy) {
    const { error } = await supabase
      .from('customers')
      .update({ deleted_at: new Date().toISOString(), deleted_by: deletedBy ?? 'Unknown' })
      .eq('id', id)
    if (error) throw error
    await fetch()
  }

  async function markNudged(id) {
    const { error } = await supabase
      .from('customers')
      .update({ last_nudged_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
    await fetch()
  }

  return { customers, loading, addCustomer, updateCustomer, deleteCustomer, markNudged, refetch: fetch }
}
