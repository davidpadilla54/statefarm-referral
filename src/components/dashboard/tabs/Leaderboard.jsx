import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useLeaderboard } from '../../../hooks/useLeaderboard'
import { useSortable } from '../../../hooks/useSortable'
import { supabase } from '../../../lib/supabase'
import Avatar from '../../ui/Avatar'
import Badge from '../../ui/Badge'
import Skeleton from '../../ui/Skeleton'
import SortableHeader from '../../ui/SortableHeader'
import Tooltip from '../../ui/Tooltip'

const MEDALS = ['🥇', '🥈', '🥉']
const TOP_N = 10

function LeaderRow({ row, rank }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-lg text-center">
        {rank < 3 ? MEDALS[rank] : <span className="text-sm text-gray-500 font-medium">#{rank + 1}</span>}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <span className="text-sm font-semibold text-gray-900">{row.name}</span>
        </div>
      </td>
      <td className="px-4 py-3"><Badge label={row.tier} type="tier" /></td>
      <td className="px-4 py-3 text-sm text-gray-600">{row.submitted}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{row.quoted}</td>
      <td className="px-4 py-3 text-sm font-bold text-green-700">${row.earned}</td>
    </tr>
  )
}

export default function Leaderboard() {
  const { rows, loading } = useLeaderboard()
  const { sorted, sortKey, sortDir, handleSort } = useSortable(rows, 'submitted', 'desc')
  const [restOpen, setRestOpen] = useState(false)

  // Staff leaderboard: customers invited per staff member
  const [staffRows, setStaffRows] = useState([])
  const [staffLoading, setStaffLoading] = useState(true)

  useEffect(() => {
    async function loadStaff() {
      const { data: customers } = await supabase.from('customers').select('created_by').is('deleted_at', null)
      const { data: referrals } = await supabase.from('referrals').select('customer_id, status, assigned_to').is('deleted_at', null)
      const { data: staff }     = await supabase.from('staff').select('id, name').eq('active', true)

      if (!staff) { setStaffLoading(false); return }

      const rows = staff.map(s => {
        // customers invited = customers where created_by matches this staff name
        const invited = (customers ?? []).filter(c => c.created_by === s.name).length
        // quotes & wins via assigned_to
        const mine   = (referrals ?? []).filter(r => r.assigned_to === s.id)
        const quoted = mine.filter(r => r.status === 'Quoted' || r.status === 'Won').length
        const won    = mine.filter(r => r.status === 'Won').length
        return { ...s, invited, quoted, won }
      }).sort((a, b) => b.invited - a.invited || b.quoted - a.quoted)

      setStaffRows(rows)
      setStaffLoading(false)
    }
    loadStaff()
  }, [])

  return (
    <div className="space-y-8">

      {/* ── Customer Leaderboard ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-1">
          <h2 className="text-xl font-bold text-gray-900">Customer Leaderboard</h2>
          <Tooltip text="Customers ranked by most referrals submitted. Quoted = referrals that were quoted or won." position="right" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">🏆</div>
              <p className="font-medium">No customers yet</p>
            </div>
          ) : (
            <>
            <table className="w-full min-w-[540px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                  <SortableHeader label="Customer"     colKey="name"      activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Tier"         colKey="tier"      activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Submitted"    colKey="submitted" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Quoted"       colKey="quoted"    activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortableHeader label="Total Earned" colKey="earned"    activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.slice(0, TOP_N).map((row, i) => (
                  <LeaderRow key={row.id} row={row} rank={i} />
                ))}
              </tbody>
            </table>

            {sorted.length > TOP_N && (
              <div className="border-t border-gray-100">
                <button
                  onClick={() => setRestOpen(o => !o)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
                >
                  <div className="flex items-center gap-2">
                    {restOpen
                      ? <ChevronDown size={15} className="text-gray-400" />
                      : <ChevronRight size={15} className="text-gray-400" />}
                    <span className="font-medium text-gray-600">
                      {restOpen ? 'Hide' : `Show ${sorted.length - TOP_N} more`}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">#{TOP_N + 1}–#{sorted.length}</span>
                </button>

                {restOpen && (
                  <table className="w-full min-w-[540px]">
                    <tbody className="divide-y divide-gray-100">
                      {sorted.slice(TOP_N).map((row, i) => (
                        <LeaderRow key={row.id} row={row} rank={TOP_N + i} />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            </>
          )}
        </div>
      </div>

      {/* ── Staff Leaderboard ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-1">
          <h2 className="text-xl font-bold text-gray-900">Staff Leaderboard</h2>
          <Tooltip text="Staff ranked by number of customers they personally invited to the program. Quoted and Won reflect their assigned referrals." position="right" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          {staffLoading ? (
            <div className="p-4 space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : staffRows.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">👥</div>
              <p className="font-medium">No staff data yet</p>
            </div>
          ) : (
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Member</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customers Invited</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quoted</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Won</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffRows.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-lg text-center">
                      {i < 3 ? MEDALS[i] : <span className="text-sm text-gray-500 font-medium">#{i + 1}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name} size="sm" />
                        <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">{s.invited}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.quoted}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-700">{s.won}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  )
}
