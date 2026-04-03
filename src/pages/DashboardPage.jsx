import { useState, useEffect, lazy, Suspense } from 'react'
import DashboardShell from '../components/layout/DashboardShell'
import DashboardHero from '../components/dashboard/DashboardHero'
import Skeleton from '../components/ui/Skeleton'
import { useStaffRole } from '../hooks/useStaffRole'

const Customers        = lazy(() => import('../components/dashboard/tabs/Customers'))
const ReferralTracker  = lazy(() => import('../components/dashboard/tabs/ReferralTracker'))
const Leaderboard      = lazy(() => import('../components/dashboard/tabs/Leaderboard'))
const GiftCards        = lazy(() => import('../components/dashboard/tabs/GiftCards'))
const StaffPerformance = lazy(() => import('../components/dashboard/tabs/StaffPerformance'))
const AlertSettings    = lazy(() => import('../components/dashboard/tabs/AlertSettings'))

const AGENT_ONLY_TABS = new Set([])

const TAB_COMPONENTS = {
  customers:    <Customers />,
  referrals:    <ReferralTracker />,
  leaderboard:  <Leaderboard />,
  giftcards:    <GiftCards />,
  staff:        <StaffPerformance />,
  alerts:       <AlertSettings />,
}

const TabFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
  </div>
)

export default function DashboardPage() {
  const { role, loading } = useStaffRole()
  const [activeTab, setActiveTab] = useState(null)

  useEffect(() => {
    if (!loading && activeTab === null) {
      setActiveTab('customers')
    }
  }, [role, loading])

  function handleTabChange(tab) {
    if (AGENT_ONLY_TABS.has(tab) && role !== 'agent') return
    setActiveTab(tab)
  }

  if (loading || !activeTab) return <TabFallback />

  const allowed = !AGENT_ONLY_TABS.has(activeTab) || role === 'agent'

  return (
    <DashboardShell activeTab={activeTab} onTabChange={handleTabChange} contentBg={activeTab === 'customers' ? 'bg-red-50' : 'bg-gray-50'} showMoneyPattern={activeTab === 'referrals'}>
      <DashboardHero onNavigate={handleTabChange} />
      <Suspense fallback={<TabFallback />}>
        {allowed ? TAB_COMPONENTS[activeTab] : TAB_COMPONENTS['customers']}
      </Suspense>
    </DashboardShell>
  )
}
