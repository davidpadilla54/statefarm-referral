export const TIERS = [
  { name: 'Bronze',   min: 1,  max: 3,        amount: 10, color: 'text-amber-700',   bg: 'bg-amber-100',   border: 'border-amber-300' },
  { name: 'Silver',   min: 4,  max: 8,        amount: 20, color: 'text-slate-600',   bg: 'bg-slate-100',   border: 'border-slate-300' },
  { name: 'Gold',     min: 9,  max: 20,       amount: 25, color: 'text-yellow-600',  bg: 'bg-yellow-50',   border: 'border-yellow-300' },
  { name: 'Platinum', min: 21, max: Infinity,  amount: 30, color: 'text-purple-700',  bg: 'bg-purple-100',  border: 'border-purple-300' },
]

/** Returns the tier object for a given count of quoted/won referrals. */
export function getTierForCount(quotedCount) {
  return TIERS.find(t => quotedCount >= t.min && quotedCount <= t.max)
    ?? TIERS[0]
}

/** Returns the next tier above the current one, or null if already Platinum. */
export function getNextTier(tierName) {
  const idx = TIERS.findIndex(t => t.name === tierName)
  return idx >= 0 && idx < TIERS.length - 1 ? TIERS[idx + 1] : null
}

/** How many more quoted referrals until the next tier. Returns 0 if Platinum. */
export function referralsUntilNextTier(quotedCount) {
  const next = getNextTier(getTierForCount(quotedCount).name)
  if (!next) return 0
  return next.min - quotedCount
}

/** Progress percentage (0–100) toward the next tier. */
export function tierProgress(quotedCount) {
  const current = getTierForCount(quotedCount)
  const next = getNextTier(current.name)
  if (!next) return 100
  const range = next.min - current.min
  const progress = quotedCount - current.min + 1
  return Math.min(100, Math.round((progress / range) * 100))
}

/** Total earned across all gift cards based on tier history — used for display only. */
export function totalEarned(giftCards = []) {
  return giftCards.reduce((sum, gc) => sum + Number(gc.amount), 0)
}
