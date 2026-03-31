import { useState } from 'react'
import { useDashboardReferrals } from '../../../hooks/useDashboardReferrals'
import { useSortable } from '../../../hooks/useSortable'
import ReferralRow from '../ReferralRow'
import Skeleton from '../../ui/Skeleton'
import SortableHeader from '../../ui/SortableHeader'
import Tooltip from '../../ui/Tooltip'

const STATUS_FILTER_OPTIONS = ['All', 'New', 'Contacted', 'Quoted', 'Won', 'Lost']

export default function ReferralTracker() {
  const { referrals, loading, newRowIds, refetch } = useDashboardReferrals()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = referrals.filter(r => {
    const matchSearch =
      r.referred_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.customers?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.referred_email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const flatForSort = filtered.map(r => ({
    ...r,
    _customer_name: r.customers?.name ?? '',
    _sent_by:       r.customers?.created_by ?? '',
    _date:          r.submitted_at ?? '',
  }))

  const { sorted, sortKey, sortDir, handleSort } = useSortable(flatForSort, '_date', 'desc')

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-1">
          <h2 className="text-xl font-bold text-gray-900">Referral Tracker</h2>
          <Tooltip text="All referrals submitted by customers. 'Sent By' shows which staff member invited that customer. Status can be updated inline." position="right" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            type="search"
            placeholder="Search name, email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red w-52"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-red"
          >
            {STATUS_FILTER_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">{search || statusFilter !== 'All' ? 'No matching referrals' : 'No referrals yet'}</p>
          </div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <SortableHeader label="Referral Name"  colKey="referred_name"  activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Phone"          colKey="referred_phone" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Email"          colKey="referred_email" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Referred By"    colKey="_customer_name" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Sent By"        colKey="_sent_by"       activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Tier"           colKey="tier"           activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Date"           colKey="_date"          activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Status"         colKey="status"         activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map(r => (
                <ReferralRow
                  key={r.id}
                  referral={r}
                  isNew={newRowIds.has(r.id)}
                  onUpdated={refetch}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400">{filtered.length} referral{filtered.length !== 1 ? 's' : ''} shown</p>
    </div>
  )
}
