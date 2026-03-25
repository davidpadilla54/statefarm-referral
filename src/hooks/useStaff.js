import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useStaff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('staff')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setStaff(data ?? [])
        setLoading(false)
      })
  }, [])

  return { staff, loading }
}
