import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Skeleton from '../ui/Skeleton'

export default function ReferralHistoryTable({ referrals, giftCards, loading, tr }) {
  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto space-y-3">
        <Skeleton className="h-5 w-40" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
      </Card>
    )
  }

  if (referrals.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-8">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-500 font-medium">{tr.noReferrals}</p>
        <p className="text-gray-400 text-sm mt-1">{tr.noReferralsSub}</p>
      </Card>
    )
  }

  return (
    <Card padding={false} className="max-w-2xl mx-auto overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">{tr.yourReferrals}</h2>
      </div>
      <div className="overflow-x-auto">
        <ul className="divide-y divide-gray-100">
          {referrals.map(r => {
            const gc = giftCards?.find(g => g.referral_id === r.id)
            const isQuoted = r.status === 'Quoted' || r.status === 'Won'
            return (
              <li key={r.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.referred_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(r.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isQuoted && gc ? (
                    gc.status === 'Sent' ? (
                      <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                        ✓ ${Number(gc.amount).toFixed(0)} {tr.earned}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-blue-600">
                        🎁 ${Number(gc.amount).toFixed(0)} {tr.earned}
                      </span>
                    )
                  ) : isQuoted ? (
                    <span className="text-sm font-semibold text-gray-600">
                      {tr.quoted.charAt(0).toUpperCase() + tr.quoted.slice(1)}
                    </span>
                  ) : (
                    <Badge label={tr.pendingQuote} />
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </Card>
  )
}
