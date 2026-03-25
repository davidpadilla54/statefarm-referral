import { useSearchParams } from 'react-router-dom'
import { useCustomer } from '../hooks/useCustomer'
import { useReferrals } from '../hooks/useReferrals'
import HeroBanner from '../components/customer/HeroBanner'
import TierProgressCard from '../components/customer/TierProgressCard'
import ReferralHistoryTable from '../components/customer/ReferralHistoryTable'
import HowItWorks from '../components/customer/HowItWorks'
import TierBreakdownGrid from '../components/customer/TierBreakdownGrid'
import ReferralForm from '../components/customer/ReferralForm'
import AgentContactCard from '../components/customer/AgentContactCard'
import { getTierForCount } from '../lib/tiers'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DEMO_CUSTOMER = { id: 'demo', name: 'Sarah Johnson', slug: 'sarah-johnson', tier: 'Silver' }
const DEMO_REFERRALS = [
  { id: '1', referred_name: 'Mike Torres',    status: 'Quoted', submitted_at: '2024-11-01' },
  { id: '2', referred_name: 'Priya Nair',     status: 'Quoted', submitted_at: '2024-11-15' },
  { id: '3', referred_name: 'James Carter',   status: 'Quoted', submitted_at: '2024-12-03' },
  { id: '4', referred_name: 'Lisa Freeman',   status: 'Quoted', submitted_at: '2024-12-20' },
  { id: '5', referred_name: 'Carlos Mendes',  status: 'New',    submitted_at: '2025-01-08' },
]
const DEMO_GIFT_CARDS = [
  { id: 'gc1', referral_id: '1', customer_id: 'demo', tier: 'Bronze', amount: 10 },
  { id: 'gc2', referral_id: '2', customer_id: 'demo', tier: 'Bronze', amount: 10 },
  { id: 'gc3', referral_id: '3', customer_id: 'demo', tier: 'Bronze', amount: 10 },
  { id: 'gc4', referral_id: '4', customer_id: 'demo', tier: 'Silver', amount: 20 },
]

export default function ReferPage() {
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('c')
  const isDemo = slug === 'demo'

  const { customer: realCustomer, loading: custLoading } = useCustomer(isDemo ? null : slug)
  const { referrals: realReferrals, loading: refLoading } = useReferrals(isDemo ? null : realCustomer?.id)
  const [giftCards, setGiftCards] = useState([])

  useEffect(() => {
    if (isDemo || !realCustomer?.id) return
    supabase
      .from('gift_cards')
      .select('*')
      .eq('customer_id', realCustomer.id)
      .then(({ data }) => setGiftCards(data ?? []))
  }, [isDemo, realCustomer?.id])

  const customer  = isDemo ? DEMO_CUSTOMER  : realCustomer
  const referrals = isDemo ? DEMO_REFERRALS : realReferrals
  const gcData    = isDemo ? DEMO_GIFT_CARDS : giftCards
  const loading   = isDemo ? false : (custLoading || refLoading)

  const firstName   = customer?.name?.split(' ')[0]
  const quotedCount = referrals.filter(r => r.status === 'Quoted' || r.status === 'Won').length
  const tier        = getTierForCount(quotedCount)

  if (!slug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center px-4">
        <div>
          <div className="text-5xl mb-4">🔗</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Invalid referral link</h1>
          <p className="text-gray-500">Please use the personalized link your agent sent you.</p>
          <p className="text-sm text-gray-400 mt-4">Questions? Call <a href="tel:9043980401" className="text-brand-red font-medium">904-398-0401</a></p>
        </div>
      </div>
    )
  }

  if (!loading && !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center px-4">
        <div>
          <div className="text-5xl mb-4">🤔</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Customer not found</h1>
          <p className="text-gray-500">We couldn't find your account. Please contact David directly.</p>
          <p className="text-sm text-gray-400 mt-4">Call <a href="tel:9043980401" className="text-brand-red font-medium">904-398-0401</a></p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner firstName={loading ? null : firstName} />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <TierProgressCard
          customer={customer}
          referrals={referrals}
          giftCards={gcData}
          loading={loading}
        />

        <ReferralHistoryTable
          referrals={referrals}
          giftCards={gcData}
          loading={loading}
        />

        <HowItWorks />
        <TierBreakdownGrid currentTierName={loading ? null : tier.name} />

        {!loading && customer && (
          <ReferralForm customer={customer} quotedCount={quotedCount} />
        )}

        <AgentContactCard />

        <p className="text-center text-xs text-gray-400 pb-4">
          David Padilla — State Farm Agency · 904-398-0401
        </p>
      </div>
    </div>
  )
}
