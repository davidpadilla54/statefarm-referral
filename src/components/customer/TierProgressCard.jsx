import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Skeleton from '../ui/Skeleton'
import { getTierForCount, getNextTier, tierProgress, referralsUntilNextTier, totalEarned } from '../../lib/tiers'

const TIER_ICONS = { Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎' }

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
  const icon = TIER_ICONS[tier.name] ?? '🎁'

  return (
    <Card className="max-w-2xl mx-auto">
      {/* Top row: tier + earned */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5">{tr.currentTier}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <Badge label={tr.tierNames[tier.name]} tierKey={tier.name} type="tier" className="text-sm px-3 py-1" />
            <span className="text-gray-600 text-sm font-medium">${tier.amount} {tr.perReferral}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{tr.totalEarned}</p>
          <p className="text-3xl font-bold text-gray-900">${earned.toFixed(0)}</p>
        </div>
      </div>

      {/* Progress bar */}
      {nextTier ? (
        <>
          <div className="mb-1">
            {/* Track */}
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-red to-red-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(progress, 4)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            <span className="font-semibold text-gray-700">{tr.quotesToNext(untilNext)}</span>{' '}
            <span className="font-semibold">{TIER_ICONS[nextTier.name]} {tr.tierNames[nextTier.name]}</span>{' '}
            <span className="text-gray-400">(${nextTier.amount}{tr.perReferral})</span>
          </p>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xl">💎</span>
          <p className="text-sm text-purple-700 font-semibold">{tr.platinumMsg}</p>
        </div>
      )}

      {/* Stats footer */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex gap-6 text-sm text-gray-600">
        <div>
          <span className="font-bold text-xl text-gray-900">{referrals.length}</span>
          <span className="ml-1.5">{tr.submitted}</span>
        </div>
        <div>
          <span className="font-bold text-xl text-gray-900">{quotedCount}</span>
          <span className="ml-1.5">{tr.quoted}</span>
        </div>
      </div>
    </Card>
  )
}
