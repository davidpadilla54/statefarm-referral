import { describe, it, expect } from 'vitest'
import {
  TIERS,
  getTierForCount,
  getNextTier,
  referralsUntilNextTier,
  tierProgress,
  totalEarned,
} from './tiers'

// ── getTierForCount ────────────────────────────────────────────────────────────

describe('getTierForCount', () => {
  it('returns Bronze for 0 quoted referrals', () => {
    expect(getTierForCount(0).name).toBe('Bronze')
  })

  it('returns Bronze for 1 quoted referral', () => {
    expect(getTierForCount(1).name).toBe('Bronze')
  })

  it('returns Bronze for 3 quoted referrals (upper boundary)', () => {
    expect(getTierForCount(3).name).toBe('Bronze')
  })

  it('returns Silver for 4 quoted referrals (lower boundary)', () => {
    expect(getTierForCount(4).name).toBe('Silver')
  })

  it('returns Silver for 8 quoted referrals (upper boundary)', () => {
    expect(getTierForCount(8).name).toBe('Silver')
  })

  it('returns Gold for 9 quoted referrals (lower boundary)', () => {
    expect(getTierForCount(9).name).toBe('Gold')
  })

  it('returns Gold for 20 quoted referrals (upper boundary)', () => {
    expect(getTierForCount(20).name).toBe('Gold')
  })

  it('returns Platinum for 21 quoted referrals (lower boundary)', () => {
    expect(getTierForCount(21).name).toBe('Platinum')
  })

  it('returns Platinum for very large counts', () => {
    expect(getTierForCount(999).name).toBe('Platinum')
  })
})

// ── tier amounts ───────────────────────────────────────────────────────────────

describe('tier gift card amounts', () => {
  it('Bronze pays $10', () => expect(getTierForCount(1).amount).toBe(10))
  it('Silver pays $20', () => expect(getTierForCount(4).amount).toBe(20))
  it('Gold pays $25',   () => expect(getTierForCount(9).amount).toBe(25))
  it('Platinum pays $30', () => expect(getTierForCount(21).amount).toBe(30))
})

// ── getNextTier ───────────────────────────────────────────────────────────────

describe('getNextTier', () => {
  it('Bronze → Silver', () => expect(getNextTier('Bronze').name).toBe('Silver'))
  it('Silver → Gold',   () => expect(getNextTier('Silver').name).toBe('Gold'))
  it('Gold → Platinum', () => expect(getNextTier('Gold').name).toBe('Platinum'))
  it('Platinum → null (no next tier)', () => expect(getNextTier('Platinum')).toBeNull())
})

// ── referralsUntilNextTier ────────────────────────────────────────────────────

describe('referralsUntilNextTier', () => {
  it('needs 3 more at 1 quoted (Bronze, min=1)', () => {
    expect(referralsUntilNextTier(1)).toBe(3)
  })

  it('needs 1 more at 3 quoted (one away from Silver)', () => {
    expect(referralsUntilNextTier(3)).toBe(1)
  })

  it('needs 5 more at 4 quoted (just entered Silver)', () => {
    expect(referralsUntilNextTier(4)).toBe(5)
  })

  it('needs 1 more at 8 quoted (one away from Gold)', () => {
    expect(referralsUntilNextTier(8)).toBe(1)
  })

  it('needs 12 more at 9 quoted (just entered Gold)', () => {
    expect(referralsUntilNextTier(9)).toBe(12)
  })

  it('returns 0 for Platinum (no next tier)', () => {
    expect(referralsUntilNextTier(21)).toBe(0)
    expect(referralsUntilNextTier(100)).toBe(0)
  })
})

// ── tierProgress ──────────────────────────────────────────────────────────────

describe('tierProgress', () => {
  it('returns a number between 0 and 100', () => {
    for (let i = 0; i <= 25; i++) {
      const p = tierProgress(i)
      expect(p).toBeGreaterThanOrEqual(0)
      expect(p).toBeLessThanOrEqual(100)
    }
  })

  it('returns 100 for Platinum (already at max)', () => {
    expect(tierProgress(21)).toBe(100)
    expect(tierProgress(50)).toBe(100)
  })

  it('increases as count increases within a tier', () => {
    expect(tierProgress(4)).toBeLessThan(tierProgress(6))
    expect(tierProgress(6)).toBeLessThan(tierProgress(8))
  })
})

// ── totalEarned ───────────────────────────────────────────────────────────────

describe('totalEarned', () => {
  it('returns 0 for empty array', () => {
    expect(totalEarned([])).toBe(0)
  })

  it('returns 0 for undefined input', () => {
    expect(totalEarned()).toBe(0)
  })

  it('sums all gift card amounts', () => {
    const giftCards = [
      { amount: 10 },
      { amount: 10 },
      { amount: 20 },
    ]
    expect(totalEarned(giftCards)).toBe(40)
  })

  it('handles string amounts from DB (numeric column)', () => {
    const giftCards = [
      { amount: '10.00' },
      { amount: '20.00' },
      { amount: '25.00' },
    ]
    expect(totalEarned(giftCards)).toBe(55)
  })

  it('calculates correct total for a Silver-tier customer with 4 quotes', () => {
    // 3 Bronze quotes ($10 each) + 1 Silver quote ($20)
    const giftCards = [
      { amount: 10 }, { amount: 10 }, { amount: 10 },
      { amount: 20 },
    ]
    expect(totalEarned(giftCards)).toBe(50)
  })
})

// ── TIERS constant sanity checks ──────────────────────────────────────────────

describe('TIERS constant', () => {
  it('has exactly 4 tiers', () => expect(TIERS).toHaveLength(4))

  it('tiers are in ascending order', () => {
    for (let i = 1; i < TIERS.length; i++) {
      expect(TIERS[i].amount).toBeGreaterThan(TIERS[i - 1].amount)
      expect(TIERS[i].min).toBeGreaterThan(TIERS[i - 1].min)
    }
  })

  it('tier ranges are contiguous (no gaps)', () => {
    for (let i = 1; i < TIERS.length - 1; i++) {
      expect(TIERS[i].min).toBe(TIERS[i - 1].max + 1)
    }
  })
})
