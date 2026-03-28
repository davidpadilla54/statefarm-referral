import { useDashboardStats } from '../../hooks/useDashboardStats'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function StatCard({ label, value, icon, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-5 flex items-start gap-3">
      <div className="text-2xl mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value ?? '—'}</p>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardHero({ onNavigate }) {
  const { stats } = useDashboardStats()

  return (
    <div className="mb-6 space-y-4">
      {/* Greeting */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting()}, David.</h1>
          <p className="text-sm text-gray-400 mt-0.5">David Padilla — Referral Rewards Program</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Referrals"
          value={stats?.total}
          icon="📋"
        />
        <StatCard
          label="Quoted This Month"
          value={stats?.quotedMonth}
          icon="✅"
          sub="Quoted or Won"
        />
        <StatCard
          label="Gift Cards Pending"
          value={stats?.pending}
          icon="🎁"
        />
        <StatCard
          label="Conversion Rate"
          value={stats ? `${stats.rate}%` : null}
          icon="📈"
          sub="Quoted ÷ Total"
        />
      </div>

      {/* Dark red action card — only shown when gift cards need sending */}
      {stats?.pending > 0 && (
        <div className="bg-brand-red text-white rounded-xl px-5 py-4 flex items-center justify-between shadow-md">
          <div>
            <p className="font-bold text-sm">
              🎁 {stats.pending} Gift Card{stats.pending !== 1 ? 's' : ''} Ready to Send
            </p>
            <p className="text-red-100 text-xs mt-0.5">
              Review and mark sent in the Gift Cards tab.
            </p>
          </div>
          <button
            onClick={() => onNavigate?.('giftcards')}
            className="bg-white text-brand-red text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors shrink-0 ml-4 whitespace-nowrap"
          >
            View Gift Cards →
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200" />
    </div>
  )
}
