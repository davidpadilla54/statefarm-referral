import { useState } from 'react'
import { useDashboardReferrals } from '../../../hooks/useDashboardReferrals'
import { useStaffRole } from '../../../hooks/useStaffRole'
import { useSortable } from '../../../hooks/useSortable'
import ReferralRow from '../ReferralRow'
import Skeleton from '../../ui/Skeleton'
import SortableHeader from '../../ui/SortableHeader'
import Tooltip from '../../ui/Tooltip'
import { useToast } from '../../ui/ToastProvider'
import { ChevronDown, ChevronRight } from 'lucide-react'

const STATUS_FILTER_OPTIONS = ['All', 'New', 'Contacted', 'Lost']

export default function ReferralTracker() {
  const { referrals, loading, newRowIds, refetch, deleteReferral } = useDashboardReferrals()
  const { name: staffName } = useStaffRole()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [closedOpen, setClosedOpen] = useState(false)
  const toast = useToast()

  async function handleDeleteReferral() {
    try {
      await deleteReferral(confirmDelete.id, staffName)
      toast(`Referral for ${confirmDelete.referred_name} moved to Deleted.`, 'success')
    } catch (err) {
      toast(err?.message ?? 'Delete failed', 'error')
    } finally {
      setConfirmDelete(null)
    }
  }

  const CLOSED_STATUSES = ['Quoted', 'Won']

  const matchSearch = r =>
    r.referred_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.customers?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.referred_email?.toLowerCase().includes(search.toLowerCase())

  const activeReferrals = referrals.filter(r =>
    !CLOSED_STATUSES.includes(r.status) &&
    matchSearch(r) &&
    (statusFilter === 'All' || r.status === statusFilter)
  )

  const closedReferrals = referrals.filter(r =>
    CLOSED_STATUSES.includes(r.status) && matchSearch(r)
  )

  const toFlat = list => list.map(r => ({
    ...r,
    _customer_name: r.customers?.name ?? '',
    _sent_by:       r.customers?.created_by ?? '',
    _date:          r.submitted_at ?? '',
  }))

  const { sorted: sortedActive, sortKey, sortDir, handleSort } = useSortable(toFlat(activeReferrals), '_date', 'desc')
  const { sorted: sortedClosed } = useSortable(toFlat(closedReferrals), '_date', 'desc')

  const tableHeaders = (
    <tr className="border-b border-gray-100 bg-gray-50 text-left">
      <SortableHeader label="Referral Name"  colKey="referred_name"  activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
      <SortableHeader label="Phone"          colKey="referred_phone" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
      <SortableHeader label="Email"          colKey="referred_email" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
      <SortableHeader label="Referred By"    colKey="_customer_name" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
      <SortableHeader label="Sent By"        colKey="_sent_by"       activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
      <SortableHeader label="Tier"           colKey="tier"           activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
      <SortableHeader label="Date"           colKey="_date"          activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
      <SortableHeader label="Status"         colKey="status"         activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
    </tr>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-1">
          <h2 className="text-xl font-bold text-gray-900">Referrals/Prospects</h2>
          <Tooltip text="Active referrals (New, Contacted, Lost). Quoted and Won deals are collapsed below." position="right" />
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

      {/* Active referrals table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : sortedActive.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">{search || statusFilter !== 'All' ? 'No matching referrals' : 'No active referrals'}</p>
          </div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead>{tableHeaders}</thead>
            <tbody className="divide-y divide-gray-100">
              {sortedActive.map(r => (
                <ReferralRow key={r.id} referral={r} isNew={newRowIds.has(r.id)} onUpdated={refetch} onDelete={() => setConfirmDelete(r)} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs font-medium text-gray-700">{sortedActive.length} active referral{sortedActive.length !== 1 ? 's' : ''}</p>

      {/* Closed deals collapsible */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setClosedOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-green-50 hover:bg-green-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            {closedOpen ? <ChevronDown size={16} className="text-green-700" /> : <ChevronRight size={16} className="text-green-700" />}
            <span className="text-sm font-bold text-green-800">Closed Deals — Quoted &amp; Won</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-semibold">{closedReferrals.length}</span>
          </div>
          <span className="text-xs text-green-600">{closedOpen ? 'Collapse' : 'Expand'}</span>
        </button>

        {closedOpen && (
          <div className="overflow-x-auto bg-white">
            {sortedClosed.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">No closed deals yet.</p>
            ) : (
              <table className="w-full min-w-[900px]">
                <thead>{tableHeaders}</thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedClosed.map(r => (
                    <ReferralRow key={r.id} referral={r} isNew={false} onUpdated={refetch} onDelete={() => setConfirmDelete(r)} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete(null)} />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-2">Delete Referral?</h3>
            <p className="text-sm text-gray-500 mb-5">
              <strong>{confirmDelete.referred_name}</strong> will be moved to the Deleted tab. You can restore them at any time.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReferral}
                className="flex-1 px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
