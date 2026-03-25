import { useState, lazy, Suspense } from 'react'
import DashboardShell from '../components/layout/DashboardShell'
import Skeleton from '../components/ui/Skeleton'

const Customers       = lazy(() => import('../components/dashboard/tabs/Customers'))
const ReferralTracker = lazy(() => import('../components/dashboard/tabs/ReferralTracker'))
const Leaderboard     = lazy(() => import('../components/dashboard/tabs/Leaderboard'))
const GiftCards       = lazy(() => import('../components/dashboard/tabs/GiftCards'))
const StaffPerformance = lazy(() => import('../components/dashboard/tabs/StaffPerformance'))
const OutreachTools   = lazy(() => import('../components/dashboard/tabs/OutreachTools'))
const AlertSettings   = lazy(() => import('../components/dashboard/tabs/AlertSettings'))

const TAB_COMPONENTS = {
  customers:    <Customers />,
  referrals:    <ReferralTracker />,
  leaderboard:  <Leaderboard />,
  giftcards:    <GiftCards />,
  staff:        <StaffPerformance />,
  outreach:     <OutreachTools />,
  alerts:       <AlertSettings />,
}

const TabFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
  </div>
)

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('customers')

  return (
    <DashboardShell activeTab={activeTab} onTabChange={setActiveTab}>
      <Suspense fallback={<TabFallback />}>
        {TAB_COMPONENTS[activeTab]}
      </Suspense>
    </DashboardShell>
  )
}
