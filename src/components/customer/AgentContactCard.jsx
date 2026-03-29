import { Phone, Mail, Globe } from 'lucide-react'

export default function AgentContactCard({ tr }) {
  const agentTitle = tr?.agentTitle ?? 'State Farm Insurance Agent'
  return (
    <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      <div className="flex">
        {/* Red accent bar */}
        <div className="w-1.5 bg-brand-red shrink-0" />

        {/* Photo */}
        <div className="w-32 sm:w-36 shrink-0">
          <img
            src="/david-padilla.jpg"
            alt="David Padilla"
            className="w-full h-full object-cover object-top"
            style={{ minHeight: '160px' }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 p-5 flex flex-col justify-center">
          <p className="font-bold text-gray-900 text-lg leading-tight">David Padilla</p>
          <p className="text-sm text-brand-red font-semibold mb-4">{agentTitle}</p>

          <div className="space-y-2">
            <a
              href="tel:9043980401"
              className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-brand-red transition-colors group"
            >
              <span className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                <Phone size={13} className="text-brand-red" />
              </span>
              904-398-0401
            </a>
            <a
              href="mailto:david.padilla.vaf43r@statefarm.com"
              className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-brand-red transition-colors group truncate"
            >
              <span className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                <Mail size={13} className="text-brand-red" />
              </span>
              <span className="truncate">david.padilla.vaf43r@statefarm.com</span>
            </a>
            <a
              href="https://www.davidinsuresflorida.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-brand-red transition-colors group"
            >
              <span className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                <Globe size={13} className="text-brand-red" />
              </span>
              davidinsuresflorida.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
