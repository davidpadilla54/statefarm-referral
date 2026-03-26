export default function AgentContactCard() {
  return (
    <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex">
        {/* Vertical photo */}
        <div className="w-36 shrink-0">
          <img
            src="/david-padilla.jpg"
            alt="David Padilla"
            className="w-full h-full object-cover object-top"
            style={{ minHeight: '180px' }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 p-5 flex flex-col justify-center">
          <p className="font-bold text-gray-900 text-lg">David Padilla</p>
          <p className="text-sm text-brand-red font-medium mb-3">State Farm Insurance Agent</p>

          <div className="space-y-1.5">
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
