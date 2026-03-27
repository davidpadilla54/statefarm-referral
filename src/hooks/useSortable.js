import { useState, useMemo } from 'react'

export function useSortable(data, defaultKey = null, defaultDir = 'asc') {
  const [sortKey, setSortKey] = useState(defaultKey)
  const [sortDir, setSortDir] = useState(defaultDir)

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey || !data?.length) return data ?? []
    return [...data].sort((a, b) => {
      let av = a[sortKey] ?? ''
      let bv = b[sortKey] ?? ''
      // numeric comparison for numbers
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av
      }
      av = String(av).toLowerCase()
      bv = String(bv).toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortDir])

  return { sorted, sortKey, sortDir, handleSort }
}
