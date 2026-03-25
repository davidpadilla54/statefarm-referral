import { useLeaderboard } from '../../../hooks/useLeaderboard'
import Badge from '../../ui/Badge'
import Skeleton from '../../ui/Skeleton'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { rows, loading } = useLeaderboard()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🏆</div>
            <p className="font-medium">No customers yet</p>
          </div>
        ) : (
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                {['Rank', 'Customer', 'Tier', 'Submitted', 'Quoted', 'Total Earned'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, i) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-lg text-center">
                    {i < 3 ? MEDALS[i] : <span className="text-sm text-gray-500 font-medium">#{i + 1}</span>}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{row.name}</td>
                  <td className="px-4 py-3"><Badge label={row.tier} type="tier" /></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.submitted}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.quoted}</td>
                  <td className="px-4 py-3 text-sm font-bold text-green-700">${row.earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
