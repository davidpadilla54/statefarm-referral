import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useStaffRole() {
  const { user, loading: authLoading } = useAuth()
  const [role, setRole] = useState(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }

    supabase
      .from('staff')
      .select('role, name')
      .eq('email', user.email)
      .single()
      .then(({ data }) => {
        setRole(data?.role ?? 'staff')
        setName(data?.name ?? '')
        setLoading(false)
      })
  }, [user, authLoading])

  return { role, name, loading }
}
