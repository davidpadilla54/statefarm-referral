export default function HeroBanner({ fullName }) {
  return (
    <div className="bg-brand-red text-white">
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        {/* State Farm logo */}
        <div className="flex justify-center mb-4">
          <img src="/statefarm-logo.png" alt="State Farm" className="h-16 brightness-0 invert" />
        </div>

        <p className="text-red-200 text-sm font-medium uppercase tracking-wider mb-1">
          David Padilla — State Farm
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          {fullName ? `Hi ${fullName}! 👋` : 'Referral Rewards'}
        </h1>

        <p className="text-red-100 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Refer friends and family to get insurance quotes — and earn <strong className="text-white">gift cards</strong> for every completed quote!
        </p>
      </div>
    </div>
  )
}
