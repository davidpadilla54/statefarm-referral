import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useLoginActivity() {
  const [logs, setLogs] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase
        .from('login_activity')
        .select('*')
        .order('logged_in_at', { ascending: false })
        .limit(1000),
      supabase
        .from('staff')
        .select('id, name, email')
        .eq('active', true),
    ]).then(([{ data: logs }, { data: staff }]) => {
      setLogs(logs ?? [])
      setStaff(staff ?? [])
      setLoading(false)
    })
  }, [])

  return { logs, staff, loading }
}
