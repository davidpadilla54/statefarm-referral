import { TIERS } from '../../lib/tiers'
import Badge from '../ui/Badge'

const TIER_RANGES = ['1–3 referrals', '4–8 referrals', '9–20 referrals', '21+ referrals']

export default function TierBreakdownGrid({ currentTierName }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-6">Reward Tiers</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TIERS.map((tier, i) => (
          <div
            key={tier.name}
            className={`rounded-xl border p-4 text-center transition-all
              ${tier.name === currentTierName
                ? 'border-brand-red ring-2 ring-brand-red bg-red-50'
                : `border-gray-200 bg-white ${tier.bg}`
              }`}
          >
            <Badge label={tier.name} type="tier" className="mb-2" />
            <p className={`text-2xl font-bold mt-2 ${tier.color}`}>${tier.amount}</p>
            <p className="text-xs text-gray-400 mt-0.5">per referral</p>
            <p className="text-xs text-gray-500 mt-2">{TIER_RANGES[i]}</p>
            {tier.name === currentTierName && (
              <p className="text-xs font-semibold text-brand-red mt-2">← You are here</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
