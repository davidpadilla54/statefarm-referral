import { useState } from 'react'
import { useDashboardReferrals } from '../../../hooks/useDashboardReferrals'
import ReferralRow from '../ReferralRow'
import Skeleton from '../../ui/Skeleton'

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Referral Tracker</h2>
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
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                {['Referral Name', 'Phone', 'Email', 'Referred By', 'Assigned To', 'Tier', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
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
