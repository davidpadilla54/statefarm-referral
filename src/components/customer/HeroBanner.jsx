import { t } from '../../lib/translations'

export default function HeroBanner({ fullName, onToggleLang, lang }) {
  const tr = t[lang ?? 'en']

  return (
    <div className="bg-brand-red text-white relative">
      {/* Language toggle */}
      <button
        onClick={onToggleLang}
        className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
        aria-label="Toggle language"
      >
        🌐 {lang === 'en' ? 'Español' : 'English'}
      </button>

      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <div className="flex justify-center mb-4">
          <img src="/statefarm-logo.png" alt="State Farm" className="h-16 brightness-0 invert" />
        </div>
        <p className="text-red-200 text-sm font-medium uppercase tracking-wider mb-1">
          {tr.agencyLine}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          {tr.heroTitle(fullName)}
        </h1>
        <p className="text-red-100 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          {tr.heroSubtitle}
        </p>
      </div>
    </div>
  )
}
