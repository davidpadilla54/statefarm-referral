import Card from '../ui/Card'
import ProgressBar from '../ui/ProgressBar'
import Badge from '../ui/Badge'
import Skeleton from '../ui/Skeleton'
import { getTierForCount, getNextTier, tierProgress, referralsUntilNextTier, totalEarned } from '../../lib/tiers'

export default function TierProgressCard({ customer, referrals, giftCards, loading, tr }) {
  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-full" />
        </div>
      </Card>
    )
  }

  const quotedCount = referrals.filter(r => r.status === 'Quoted' || r.status === 'Won').length
  const tier = getTierForCount(Math.max(quotedCount, 0))
  const nextTier = getNextTier(tier.name)
  const progress = tierProgress(quotedCount)
  const untilNext = referralsUntilNextTier(quotedCount)
  const earned = totalEarned(giftCards ?? [])

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{tr.currentTier}</p>
          <div className="flex items-center gap-2">
            <Badge label={tier.name} type="tier" className="text-sm px-3 py-1" />
            <span className="text-gray-700 font-semibold">${tier.amount} {tr.perReferral}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{tr.totalEarned}</p>
          <p className="text-2xl font-bold text-gray-900">${earned.toFixed(0)}</p>
        </div>
      </div>

      {nextTier ? (
        <>
          <div className="mb-2">
            <ProgressBar percent={progress} />
          </div>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{tr.quotesToNext(untilNext)}</span>{' '}
            <Badge label={nextTier.name} type="tier" /> (${nextTier.amount}{tr.perReferral})
          </p>
        </>
      ) : (
        <p className="text-sm text-purple-700 font-semibold">{tr.platinumMsg}</p>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-sm text-gray-600">
        <div><span className="font-bold text-gray-900">{referrals.length}</span> {tr.submitted}</div>
        <div><span className="font-bold text-gray-900">{quotedCount}</span> {tr.quoted}</div>
      </div>
    </Card>
  )
}
