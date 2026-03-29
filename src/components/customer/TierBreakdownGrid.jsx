import { TIERS } from '../../lib/tiers'
import Badge from '../ui/Badge'

const TIER_CONFIG = {
  Bronze:   { icon: '🥉', gradient: 'from-amber-50 to-orange-50',   accent: '#CD7F32', ring: 'ring-amber-300'   },
  Silver:   { icon: '🥈', gradient: 'from-slate-50 to-gray-100',    accent: '#A8A9AD', ring: 'ring-slate-300'   },
  Gold:     { icon: '🥇', gradient: 'from-yellow-50 to-amber-50',   accent: '#FFD700', ring: 'ring-yellow-300'  },
  Platinum: { icon: '💎', gradient: 'from-violet-50 to-purple-50',  accent: '#7C3AED', ring: 'ring-violet-300'  },
}

export default function TierBreakdownGrid({ currentTierName, tr }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-6">{tr.rewardTiers}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TIERS.map((tier, i) => {
          const cfg = TIER_CONFIG[tier.name]
          const isActive = tier.name === currentTierName
          return (
            <div
              key={tier.name}
              className={`rounded-2xl border p-4 text-center transition-all relative overflow-hidden ${
                isActive
                  ? `bg-gradient-to-b ${cfg.gradient} border-brand-red ring-2 ring-brand-red shadow-md`
                  : `bg-gradient-to-b ${cfg.gradient} border-gray-200 hover:shadow-sm`
              }`}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                style={{ backgroundColor: cfg.accent }}
              />

              {/* Tier icon */}
              <div className="text-2xl mt-1 mb-1">{cfg.icon}</div>

              <Badge label={tier.name} type="tier" className="mb-1" />
              <p className={`text-2xl font-bold mt-2 ${tier.color}`}>${tier.amount}</p>
              <p className="text-xs text-gray-400 mt-0.5">{tr.perReferralShort}</p>
              <p className="text-xs text-gray-500 mt-2">{tr.tierRanges[i]}</p>

              {isActive && (
                <div className="mt-2 bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-full inline-block">
                  {tr.youAreHere}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
