import { useAuth } from '../../hooks/useAuth'

const TABS = [
  { id: 'customers',   label: 'Customers',         icon: '👤' },
  { id: 'referrals',   label: 'Referral Tracker',  icon: '📋' },
  { id: 'leaderboard', label: 'Leaderboard',        icon: '🏆' },
  { id: 'giftcards',   label: 'Gift Cards',          icon: '🎁' },
  { id: 'staff',       label: 'Staff Performance',  icon: '👥' },
  { id: 'outreach',    label: 'Outreach Tools',     icon: '📣' },
  { id: 'alerts',      label: 'Alert Settings',     icon: '🔔' },
]

export default function DashboardSidebar({ activeTab, onTabChange, mobileOpen, onMobileClose }) {
  const { signOut, user } = useAuth()

  const nav = (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <HouseIcon />
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">David Padilla</p>
            <p className="text-xs text-brand-red font-medium">State Farm Agency</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { onTabChange(tab.id); onMobileClose?.() }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
              ${activeTab === tab.id
                ? 'bg-red-50 text-brand-red'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 truncate mb-2">{user?.email}</p>
        <button
          onClick={signOut}
          className="w-full text-left text-xs text-gray-500 hover:text-brand-red transition-colors font-medium"
        >
          Sign out
        </button>
      </div>
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-gray-200 min-h-screen">
        {nav}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <aside className="relative z-50 w-64 bg-white h-full shadow-xl flex flex-col">
            {nav}
          </aside>
        </div>
      )}
    </>
  )
}

function HouseIcon() {
  return (
    <svg className="w-8 h-8 text-brand-red shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  )
}
