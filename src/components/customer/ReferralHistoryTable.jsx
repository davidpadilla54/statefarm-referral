import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Skeleton from '../ui/Skeleton'
import { getTierForCount } from '../../lib/tiers'

function statusLabel(status, giftCards, referralId) {
  if (status === 'Quoted' || status === 'Won') {
    const gc = giftCards?.find(g => g.referral_id === referralId)
    return gc ? `$${Number(gc.amount).toFixed(0)} earned` : 'Quoted'
  }
  return 'Pending quote'
}

export default function ReferralHistoryTable({ referrals, giftCards, loading }) {
  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto space-y-3">
        <Skeleton className="h-5 w-40" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
      </Card>
    )
  }

  if (referrals.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-8">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-500 font-medium">No referrals yet</p>
        <p className="text-gray-400 text-sm mt-1">Submit your first referral below to start earning!</p>
      </Card>
    )
  }

  return (
    <Card padding={false} className="max-w-2xl mx-auto overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Your Referrals</h2>
      </div>
      <ul className="divide-y divide-gray-100">
        {referrals.map(r => (
          <li key={r.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-800">{r.referred_name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(r.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {(r.status === 'Quoted' || r.status === 'Won') ? (
                <span className="text-sm font-semibold text-green-600">
                  {statusLabel(r.status, giftCards, r.id)}
                </span>
              ) : (
                <Badge label="Pending quote" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
