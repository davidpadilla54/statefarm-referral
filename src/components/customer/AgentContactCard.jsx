export default function AgentContactCard() {
  return (
    <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-4">
        {/* Photo placeholder */}
        <div className="w-16 h-16 rounded-full bg-brand-red/10 border-2 border-brand-red/20 flex items-center justify-center shrink-0">
          <svg className="w-8 h-8 text-brand-red/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>

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
