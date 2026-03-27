import { TIERS } from '../../lib/tiers'
import Badge from '../ui/Badge'

export default function TierBreakdownGrid({ currentTierName, tr }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-6">{tr.rewardTiers}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TIERS.map((tier, i) => (
          <div
            key={tier.name}
            className={`rounded-xl border p-4 text-center transition-all ${
              tier.name === currentTierName
                ? 'border-brand-red ring-2 ring-brand-red bg-red-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <Badge label={tier.name} type="tier" className="mb-2" />
            <p className={`text-2xl font-bold mt-2 ${tier.color}`}>${tier.amount}</p>
            <p className="text-xs text-gray-400 mt-0.5">{tr.perReferralShort}</p>
            <p className="text-xs text-gray-500 mt-2">{tr.tierRanges[i]}</p>
            {tier.name === currentTierName && (
              <p className="text-xs font-semibold text-brand-red mt-2">{tr.youAreHere}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
