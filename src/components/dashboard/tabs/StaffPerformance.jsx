import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import Card from '../../ui/Card'
import Skeleton from '../../ui/Skeleton'

export default function StaffPerformance() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState({ key: 'quoted', dir: 'desc' })

  useEffect(() => {
    async function load() {
      const { data: staff } = await supabase.from('staff').select('id, name, email, active')
      const { data: referrals } = await supabase.from('referrals').select('assigned_to, status')

      if (!staff) { setLoading(false); return }

      const rows = staff.map(s => {
        const mine = (referrals ?? []).filter(r => r.assigned_to === s.id)
        const total = mine.length
        const quoted = mine.filter(r => r.status === 'Quoted' || r.status === 'Won').length
        const closeRate = total > 0 ? Math.round((quoted / total) * 100) : 0
        return { ...s, total, quoted, closeRate }
      })

      setStats(rows)
      setLoading(false)
    }
    load()
  }, [])

  const sorted = [...stats].sort((a, b) => {
    const v = sort.dir === 'asc' ? 1 : -1
    return a[sort.key] > b[sort.key] ? v : -v
  })

  function toggleSort(key) {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' })
  }

  function closeRateColor(rate) {
    if (rate >= 70) return 'bg-green-500'
    if (rate >= 40) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  if (loading) return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Staff Performance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Staff Performance</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => (
          <Card key={s.id}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-400">{s.email}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {s.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-4 text-sm text-gray-600 mb-3">
              <div><span className="font-bold text-gray-900">{s.total}</span> assigned</div>
              <div><span className="font-bold text-gray-900">{s.quoted}</span> quoted</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full ${closeRateColor(s.closeRate)} transition-all duration-700`} style={{ width: `${s.closeRate}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-10 text-right">{s.closeRate}%</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Sortable table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              {[['name','Name'],['total','Assigned'],['quoted','Quoted'],['closeRate','Close Rate %']].map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none"
                >
                  {label} {sort.key === key ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.total}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.quoted}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${s.closeRate >= 70 ? 'text-green-600' : s.closeRate >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {s.closeRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
