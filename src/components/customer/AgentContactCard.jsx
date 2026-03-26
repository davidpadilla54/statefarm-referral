export default function AgentContactCard() {
  return (
    <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-4">
        {/* Agent photo */}
        <img
          src="/david-padilla.jpg"
          alt="David Padilla"
          className="w-16 h-16 rounded-full object-cover object-top shrink-0 border-2 border-brand-red/20"
        />

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900">David Padilla</p>
          <p className="text-sm text-brand-red font-medium">State Farm Insurance Agent</p>

          <div className="mt-2 space-y-1">
            <a
              href="tel:9043980401"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-red transition-colors"
            >
              <span>📞</span> 904-398-0401
            </a>
            <a
              href="mailto:david.padilla.vaf43r@statefarm.com"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-red transition-colors truncate"
            >
              <span>✉️</span> david.padilla.vaf43r@statefarm.com
            </a>
            <a
              href="https://www.davidinsuresflorida.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-red transition-colors"
            >
              <span>🌐</span> davidinsuresflorida.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
