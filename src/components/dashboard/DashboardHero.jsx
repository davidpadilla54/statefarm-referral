import { AlertTriangle, TrendingDown } from 'lucide-react'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import Tooltip from '../ui/Tooltip'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function StatCard({ label, value, icon, sub, tooltip }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 lg:p-5 flex items-start gap-3">
      <div className="text-2xl mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value ?? '—'}</p>
        <div className="flex items-center mt-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
          {tooltip && <Tooltip text={tooltip} position="top" />}
        </div>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardHero({ onNavigate }) {
  const { stats, alerts } = useDashboardStats()
  const hasAlerts = alerts.customers.length > 0 || alerts.staff.length > 0

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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          label="Total Referrals"
          value={stats?.total}
          icon="📋"
          tooltip="Total number of referrals submitted by all customers across all time."
        />
        <StatCard
          label="Quoted This Month"
          value={stats?.quotedMonth}
          icon="✅"
          sub="Quoted or Won"
          tooltip="Referrals marked Quoted or Won during the current calendar month."
        />
        <StatCard
          label="Gift Cards Pending"
          value={stats?.pending}
          icon="🎁"
          tooltip="Gift cards that have been earned but not yet marked as sent to the customer."
        />
        <StatCard
          label="Conversion Rate"
          value={stats ? `${stats.rate}%` : null}
          icon="📈"
          sub="Quoted ÷ Total"
          tooltip="Percentage of all submitted referrals that have been Quoted or Won. Higher is better."
        />
        <StatCard
          label="Win Rate"
          value={stats ? `${stats.winRate}%` : null}
          icon="🏆"
          sub="Won ÷ Quoted"
          tooltip="Percentage of Quoted referrals that were converted to Won (closed policy). Higher is better."
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

      {/* Smart Alerts */}
      {hasAlerts && (
        <div className="space-y-2">
          {alerts.customers.map(c => (
            <div key={c.id} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold text-amber-800">{c.name}</span>
                <span className="text-amber-700"> has {c.total} referrals but only a {c.rate}% conversion rate — consider following up with this customer to improve engagement.</span>
              </div>
            </div>
          ))}
          {alerts.staff.map(s => (
            <div key={s.id} className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
              <TrendingDown size={16} className="text-orange-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold text-orange-800">{s.name}</span>
                <span className="text-orange-700"> has {s.quoted} quoted referrals but only a {s.winRate}% win rate — review assigned leads for coaching opportunities.</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200" />
    </div>
  )
}
