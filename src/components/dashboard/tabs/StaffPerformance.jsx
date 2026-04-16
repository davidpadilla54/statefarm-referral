import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import Card from '../../ui/Card'
import Skeleton from '../../ui/Skeleton'
import Tooltip from '../../ui/Tooltip'

const DAVID_EMAIL = 'david.padilla.vaf43r@statefarm.com'

export default function StaffPerformance() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState({ key: 'quoted', dir: 'desc' })

  useEffect(() => {
    async function load() {
      const { data: staff }     = await supabase.from('staff').select('id, name, email, active').eq('active', true)
      const { data: referrals } = await supabase.from('referrals').select('assigned_to, status, customers(created_by)').is('deleted_at', null)
      const { data: loginData } = await supabase.rpc('get_staff_last_login')

      if (!staff) { setLoading(false); return }

      // Build email → last_sign_in_at lookup
      const loginMap = {}
      ;(loginData ?? []).forEach(l => { loginMap[l.email] = l.last_sign_in_at })

      const rows = staff.map(s => {
        const mine    = (referrals ?? []).filter(r =>
          r.assigned_to === s.id || r.customers?.created_by === s.name
        )
        // Deduplicate in case both match the same referral
        const unique  = [...new Map(mine.map(r => [r.id ?? Math.random(), r])).values()]
        const total   = unique.length
        const quoted  = unique.filter(r => r.status === 'Quoted' || r.status === 'Won').length
        const won     = unique.filter(r => r.status === 'Won').length
        const convRate = total  > 0 ? Math.round((quoted / total) * 100) : 0
        const winRate  = quoted > 0 ? Math.round((won / quoted) * 100) : 0
        const lastLogin = loginMap[s.email] ?? null
        return { ...s, total, quoted, won, convRate, winRate, lastLogin }
      })

      setStats(rows)
      setLoading(false)
    }
    load()
  }, [])

  // David always first, then sort rest by selected metric
  const sorted = [...stats].sort((a, b) => {
    if (a.email === DAVID_EMAIL) return -1
    if (b.email === DAVID_EMAIL) return 1
    const v = sort.dir === 'asc' ? 1 : -1
    return a[sort.key] > b[sort.key] ? v : -v
  })

  function toggleSort(key) {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' })
  }

  function rateColor(rate) {
    if (rate >= 70) return 'bg-green-500'
    if (rate >= 40) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  function rateText(rate) {
    if (rate >= 70) return 'text-green-600'
    if (rate >= 40) return 'text-yellow-600'
    return 'text-red-500'
  }

  if (loading) return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Staff Performance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-36" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1">
        <h2 className="text-xl font-bold text-gray-900">Staff Performance</h2>
        <Tooltip text="Shows each staff member's assigned referrals, quoted count, wins, and win rate. David's card is always first. Others are sorted by the selected column." position="right" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map(s => (
          <Card key={s.id} className={s.email === DAVID_EMAIL ? 'ring-2 ring-brand-red' : ''}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{s.name}</p>
                  {s.email === DAVID_EMAIL && (
                    <span className="text-xs bg-brand-red text-white px-1.5 py-0.5 rounded font-medium">Agent</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{s.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Last login:{' '}
                  {s.lastLogin
                    ? new Date(s.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : <span className="text-amber-500 font-medium">Never</span>}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {s.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-3 text-sm text-gray-600 mb-3">
              <div><span className="font-bold text-gray-900">{s.total}</span> assigned</div>
              <div><span className="font-bold text-gray-900">{s.quoted}</span> quoted</div>
              <div><span className="font-bold text-gray-900">{s.won}</span> won</div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Conv. Rate</span>
                <span className="font-semibold">{s.convRate}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-1.5 rounded-full ${rateColor(s.convRate)} transition-all duration-700`} style={{ width: `${s.convRate}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Win Rate</span>
                <span className={`font-semibold ${rateText(s.winRate)}`}>{s.winRate}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-1.5 rounded-full ${rateColor(s.winRate)} transition-all duration-700`} style={{ width: `${s.winRate}%` }} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Sortable table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              {[
                ['name',      'Name'],
                ['total',     'Assigned'],
                ['quoted',    'Quoted'],
                ['won',       'Won'],
                ['convRate',  'Conv. Rate %'],
                ['winRate',   'Win Rate %'],
                ['lastLogin', 'Last Login'],
              ].map(([key, label]) => (
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
              <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${s.email === DAVID_EMAIL ? 'bg-red-50/30' : ''}`}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {s.name}
                  {s.email === DAVID_EMAIL && <span className="ml-1.5 text-xs text-brand-red font-semibold">(Agent)</span>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.total}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.quoted}</td>
                <td className="px-4 py-3 text-sm font-semibold text-green-700">{s.won}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${rateText(s.convRate)}`}>{s.convRate}%</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${rateText(s.winRate)}`}>{s.winRate}%</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {s.lastLogin
                    ? new Date(s.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : <span className="text-amber-500 font-medium">Never</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
