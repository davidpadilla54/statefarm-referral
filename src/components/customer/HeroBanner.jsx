export default function HeroBanner({ firstName }) {
  return (
    <div className="bg-brand-red text-white">
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        {/* House logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-white/15 rounded-full p-3">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
        </div>

        <p className="text-red-200 text-sm font-medium uppercase tracking-wider mb-1">
          David Padilla — State Farm
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          {firstName ? `Hi ${firstName}! 👋` : 'Referral Rewards'}
        </h1>

        <p className="text-red-100 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Refer friends and family to get insurance quotes — and earn <strong className="text-white">gift cards</strong> for every completed quote!
        </p>
      </div>
    </div>
  )
}
