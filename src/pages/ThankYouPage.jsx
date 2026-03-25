import { useLocation, Link } from 'react-router-dom'
import AgentContactCard from '../components/customer/AgentContactCard'

export default function ThankYouPage() {
  const { state } = useLocation()
  const firstName = state?.firstName ?? 'there'
  const slug = state?.slug

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-brand-red text-white">
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/15 rounded-full p-3">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Thanks, {firstName}! 🎉</h1>
          <p className="text-red-100 text-lg">Your referral has been submitted successfully.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Confirmation card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Referral Received!</h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
            We'll reach out to your friend soon to schedule a free insurance quote.
            Once the quote is completed, a gift card will be on its way to you!
          </p>

          <div className="mt-6 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-500">
            Questions? Call David at{' '}
            <a href="tel:9043980401" className="text-brand-red font-semibold">904-398-0401</a>
          </div>
        </div>

        {/* CTA */}
        {slug ? (
          <div className="text-center">
            <Link
              to={`/refer?c=${slug}`}
              className="inline-flex items-center gap-2 bg-brand-red text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-red-dark transition-colors"
            >
              Refer Another Friend
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <a
              href="javascript:history.back()"
              className="inline-flex items-center gap-2 bg-brand-red text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-red-dark transition-colors"
            >
              Refer Another Friend
            </a>
          </div>
        )}

        <AgentContactCard />
      </div>
    </div>
  )
}
