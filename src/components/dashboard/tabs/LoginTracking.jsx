import { useState } from 'react'
import { useLoginActivity } from '../../../hooks/useLoginActivity'
import Card from '../../ui/Card'
import Avatar from '../../ui/Avatar'
import Skeleton from '../../ui/Skeleton'
import Tooltip from '../../ui/Tooltip'

const DAVID_EMAIL = 'david.padilla.vaf43r@statefarm.com'

function startOfWeek() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d
}

function startOfMonth() {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function formatRelative(iso) {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function LoginTracking() {
  const { logs, staff, loading } = useLoginActivity()
  const [filterEmail, setFilterEmail] = useState('all')

  if (loading) return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Login Activity</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-36" />)}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )

  const weekStart = startOfWeek()
  const monthStart = startOfMonth()

  // Index logs by email for fast lookup
  const logsByEmail = {}
  for (const log of logs) {
    if (!logsByEmail[log.staff_email]) logsByEmail[log.staff_email] = []
    logsByEmail[log.staff_email].push(log)
  }

  // Build one summary per active staff member — always show everyone
  const summaries = staff
    .map(s => {
      const entries = logsByEmail[s.email] ?? []
      const total     = entries.length
      const thisMonth = entries.filter(l => new Date(l.logged_in_at) >= monthStart).length
      const thisWeek  = entries.filter(l => new Date(l.logged_in_at) >= weekStart).length
      const lastSeen  = entries[0]?.logged_in_at ?? null  // logs are newest-first
      return { ...s, total, thisMonth, thisWeek, lastSeen }
    })
    .sort((a, b) => {
      if (a.email === DAVID_EMAIL) return -1
      if (b.email === DAVID_EMAIL) return 1
      return b.total - a.total
    })

  const filteredLogs = filterEmail === 'all'
    ? logs
    : logs.filter(l => l.staff_email === filterEmail)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1">
        <h2 className="text-xl font-bold text-gray-900">Login Activity</h2>
        <Tooltip
          text="Tracks every time a staff member logs into the dashboard. All active staff appear here — logins are recorded going forward from when this feature was added."
          position="right"
        />
      </div>

      {/* Per-staff summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaries.map(s => (
          <Card key={s.id} className={s.email === DAVID_EMAIL ? 'ring-2 ring-brand-red' : ''}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Avatar name={s.name} size="sm" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-gray-900">{s.name}</p>
                    {s.email === DAVID_EMAIL && (
                      <span className="text-xs bg-brand-red text-white px-1.5 py-0.5 rounded font-medium">Agent</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate max-w-[160px]">{s.email}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="bg-gray-50 rounded-lg py-2">
                <p className="text-lg font-bold text-gray-900">{s.thisWeek}</p>
                <p className="text-xs text-gray-500">This week</p>
              </div>
              <div className="bg-gray-50 rounded-lg py-2">
                <p className="text-lg font-bold text-gray-900">{s.thisMonth}</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <div className="bg-gray-50 rounded-lg py-2">
                <p className="text-lg font-bold text-gray-900">{s.total}</p>
                <p className="text-xs text-gray-500">All-time</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Last seen:{' '}
              <span className={`font-medium ${s.lastSeen ? 'text-gray-600' : 'text-gray-400 italic'}`}>
                {formatRelative(s.lastSeen)}
              </span>
            </p>
          </Card>
        ))}
      </div>

      {/* Detailed log table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Login Log</h3>
          <select
            value={filterEmail}
            onChange={e => setFilterEmail(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-red/30"
          >
            <option value="all">All staff</option>
            {staff.map(s => (
              <option key={s.email} value={s.email}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Logged In At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">
                    {filterEmail === 'all'
                      ? 'No logins recorded yet. Logins are tracked going forward.'
                      : `No logins recorded for ${staff.find(s => s.email === filterEmail)?.name ?? filterEmail}.`}
                  </td>
                </tr>
              ) : filteredLogs.map(log => (
                <tr key={log.id} className={`hover:bg-gray-50 transition-colors ${log.staff_email === DAVID_EMAIL ? 'bg-red-50/20' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={log.staff_name ?? log.staff_email} size="sm" />
                      <span className="text-sm font-medium text-gray-900">
                        {log.staff_name ?? log.staff_email}
                        {log.staff_email === DAVID_EMAIL && (
                          <span className="ml-1.5 text-xs text-brand-red font-semibold">(Agent)</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{log.staff_email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDateTime(log.logged_in_at)}
                    <span className="ml-2 text-xs text-gray-400">({formatRelative(log.logged_in_at)})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length > 0 && (
          <p className="text-xs text-gray-400 text-right">
            Showing {filteredLogs.length} login{filteredLogs.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}
