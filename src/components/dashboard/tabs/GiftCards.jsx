import { useGiftCards } from '../../../hooks/useGiftCards'
import { useSortable } from '../../../hooks/useSortable'
import { useStaffRole } from '../../../hooks/useStaffRole'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import Skeleton from '../../ui/Skeleton'
import SortableHeader from '../../ui/SortableHeader'
import Tooltip from '../../ui/Tooltip'
import { useToast } from '../../ui/ToastProvider'
import { sendEmail } from '../../../lib/resend'

const DAVID_EMAIL = 'david.padilla.vaf43r@statefarm.com'

export default function GiftCards() {
  const { giftCards, loading, markSent } = useGiftCards()
  const { role } = useStaffRole()
  const toast = useToast()
  const isAdmin = role === 'admin'

  async function handleMarkSent(id) {
    const gc = giftCards.find(g => g.id === id)
    await markSent(id)
    toast('Gift card marked as sent!', 'success')
    if (gc?.customers?.email) {
      sendEmail('gift_card_sent', {
        customerName:  gc.customers.name ?? 'there',
        customerEmail: gc.customers.email,
        referredName:  gc.referrals?.referred_name ?? 'your referral',
        amount:        Number(gc.amount).toFixed(0),
        tier:          gc.tier,
        agentEmail:    DAVID_EMAIL,
      }).catch(console.error)
    }
  }

  const pending = giftCards.filter(g => g.status === 'Pending')
  const sent    = giftCards.filter(g => g.status === 'Sent')

  const flatForSort = giftCards.map(gc => ({
    ...gc,
    _customer: gc.customers?.name ?? '',
    _referral: gc.referrals?.referred_name ?? '',
    _date:     gc.earned_at ?? '',
  }))
  const { sorted: sortedGC, sortKey, sortDir, handleSort } = useSortable(flatForSort, '_date', 'desc')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h2 className="text-xl font-bold text-gray-900">Gift Cards</h2>
          <Tooltip text="Gift cards are automatically created when a referral is marked Quoted. Only David can mark them as sent." position="right" />
        </div>
        <div className="flex gap-3 text-sm">
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
            {pending.length} Pending
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            {sent.length} Sent
          </span>
        </div>
      </div>

      {!isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
          Only David Padilla can mark gift cards as sent.
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : giftCards.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🎁</div>
            <p className="font-medium">No gift cards yet</p>
            <p className="text-sm mt-1">They'll appear here when a referral is marked Quoted.</p>
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <SortableHeader label="Customer"    colKey="_customer" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Referral"    colKey="_referral" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Tier"        colKey="tier"      activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Amount"      colKey="amount"    activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Date Earned" colKey="_date"     activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Status"      colKey="status"    activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                {isAdmin && <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedGC.map(gc => (
                <tr key={gc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{gc.customers?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{gc.referrals?.referred_name ?? '—'}</td>
                  <td className="px-4 py-3"><Badge label={gc.tier} type="tier" /></td>
                  <td className="px-4 py-3 text-sm font-bold text-green-700">${Number(gc.amount).toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(gc.earned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3"><Badge label={gc.status} /></td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      {gc.status === 'Pending' && (
                        <Button size="sm" variant="secondary" onClick={() => handleMarkSent(gc.id)}>
                          Mark Sent
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
