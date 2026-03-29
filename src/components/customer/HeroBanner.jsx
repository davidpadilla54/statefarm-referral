import { t } from '../../lib/translations'

export default function HeroBanner({ fullName, onToggleLang, lang }) {
  const tr = t[lang ?? 'en']

  return (
    <div className="relative bg-gradient-to-br from-brand-red via-brand-red to-[#8B0000] text-white overflow-hidden">
      {/* Subtle diagonal pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 20px,
            rgba(255,255,255,0.3) 20px,
            rgba(255,255,255,0.3) 21px
          )`,
        }}
      />

      {/* Language toggle */}
      <button
        onClick={onToggleLang}
        className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors z-10"
        aria-label="Toggle language"
      >
        🌐 {lang === 'en' ? 'Español' : 'English'}
      </button>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-10 pb-14 text-center">
        <div className="flex justify-center mb-4">
          <img src="/statefarm-logo.png" alt="State Farm" className="h-16 brightness-0 invert drop-shadow-lg" />
        </div>
        <p className="text-red-200 text-sm font-semibold uppercase tracking-widest mb-2">
          {tr.agencyLine}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 drop-shadow-sm">
          {tr.heroTitle(fullName)}
        </h1>
        <p className="text-red-100 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          {tr.heroSubtitle}
        </p>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0 48L60 40C120 32 240 16 360 12C480 8 600 16 720 22C840 28 960 32 1080 30C1200 28 1320 20 1380 16L1440 12V48H1380C1320 48 1200 48 1080 48C960 48 840 48 720 48C600 48 480 48 360 48C240 48 120 48 60 48H0Z" fill="rgb(249 250 251)" />
        </svg>
      </div>
    </div>
  )
}
