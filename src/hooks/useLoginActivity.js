import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useLoginActivity() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('login_activity')
      .select('*')
      .order('logged_in_at', { ascending: false })
      .limit(1000)
      .then(({ data }) => {
        setLogs(data ?? [])
        setLoading(false)
      })
  }, [])

  return { logs, loading }
}
