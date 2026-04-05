import { useState } from 'react'
import { useDeletedRecords } from '../../../hooks/useDeletedRecords'
import { useToast } from '../../ui/ToastProvider'
import Skeleton from '../../ui/Skeleton'
import Button from '../../ui/Button'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DeletedRecords() {
  const { deletedCustomers, deletedReferrals, loading, restoreCustomer, restoreReferral } = useDeletedRecords()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('customers')

  async function handleRestoreCustomer(c) {
    try {
      await restoreCustomer(c.id)
      toast(`${c.name} restored.`, 'success')
    } catch (err) {
      toast(err?.message ?? 'Restore failed', 'error')
    }
  }

  async function handleRestoreReferral(r) {
    try {
      await restoreReferral(r.id)
      toast(`Referral for ${r.referred_name} restored.`, 'success')
    } catch (err) {
      toast(err?.message ?? 'Restore failed', 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Deleted Records</h2>
        <p className="text-sm text-gray-500 mt-0.5">Soft-deleted items. Nothing here is permanently gone — restore anytime.</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'customers'
              ? 'bg-brand-red text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Customers ({deletedCustomers.length})
        </button>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'referrals'
              ? 'bg-brand-red text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Referrals ({deletedReferrals.length})
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : activeTab === 'customers' ? (
          deletedCustomers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">🗑️</div>
              <p className="font-medium">No deleted customers</p>
            </div>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deleted By</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deleted On</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deletedCustomers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600">{c.phone || '—'}</p>
                      <p className="text-xs text-gray-400">{c.email || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.deleted_by ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(c.deleted_at)}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="secondary" onClick={() => handleRestoreCustomer(c)}>
                        Restore
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          deletedReferrals.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">🗑️</div>
              <p className="font-medium">No deleted referrals</p>
            </div>
          ) : (
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Referral</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Referred By</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deleted By</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deleted On</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deletedReferrals.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{r.referred_name}</p>
                      <p className="text-xs text-gray-400">{r.referred_phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.customers?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.status}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.deleted_by ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(r.deleted_at)}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="secondary" onClick={() => handleRestoreReferral(r)}>
                        Restore
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  )
}
