import { useGiftCards } from '../../../hooks/useGiftCards'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import Skeleton from '../../ui/Skeleton'
import { useToast } from '../../ui/ToastProvider'

export default function GiftCards() {
  const { giftCards, loading, markSent } = useGiftCards()
  const toast = useToast()

  async function handleMarkSent(id) {
    await markSent(id)
    toast('Gift card marked as sent!', 'success')
  }

  const pending = giftCards.filter(g => g.status === 'Pending')
  const sent = giftCards.filter(g => g.status === 'Sent')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Gift Cards</h2>
        <div className="flex gap-3 text-sm">
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
            {pending.length} Pending
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            {sent.length} Sent
          </span>
        </div>
      </div>

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
                {['Customer', 'Referral', 'Tier', 'Amount', 'Date Earned', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {giftCards.map(gc => (
                <tr key={gc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{gc.customers?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{gc.referrals?.referred_name ?? '—'}</td>
                  <td className="px-4 py-3"><Badge label={gc.tier} type="tier" /></td>
                  <td className="px-4 py-3 text-sm font-bold text-green-700">${Number(gc.amount).toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(gc.earned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3"><Badge label={gc.status} /></td>
                  <td className="px-4 py-3">
                    {gc.status === 'Pending' && (
                      <Button size="sm" variant="secondary" onClick={() => handleMarkSent(gc.id)}>
                        Mark Sent
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
