import { useLocation, Link } from 'react-router-dom'
import AgentContactCard from '../components/customer/AgentContactCard'
import { t } from '../lib/translations'

export default function ThankYouPage() {
  const { state } = useLocation()
  const firstName = state?.firstName ?? 'there'
  const slug = state?.slug
  const count = state?.count ?? 1
  const lang = state?.lang ?? localStorage.getItem('dp_lang') ?? 'en'
  const tr = t[lang] ?? t.en

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-red text-white">
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <div className="flex justify-center mb-4">
            <img src="/statefarm-logo.png" alt="State Farm" className="h-16 brightness-0 invert" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{tr.thanksTitle(firstName)}</h1>
          <p className="text-red-100 text-lg">{tr.thanksSub}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {count > 1 ? `${count} Referrals Received!` : tr.referralReceived}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
            {tr.referralReceivedMsg}
          </p>
          <div className="mt-6 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-500">
            {tr.questionsCall}{' '}
            <a href="tel:9043980401" className="text-brand-red font-semibold">904-398-0401</a>
          </div>
        </div>

        <div className="text-center">
          {slug ? (
            <Link
              to={`/refer?c=${slug}`}
              className="inline-flex items-center gap-2 bg-brand-red text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-red-dark transition-colors"
            >
              {tr.referAnother}
            </Link>
          ) : (
            <a
              href="javascript:history.back()"
              className="inline-flex items-center gap-2 bg-brand-red text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-red-dark transition-colors"
            >
              {tr.referAnother}
            </a>
          )}
        </div>

        <AgentContactCard tr={tr} />
      </div>
    </div>
  )
}
