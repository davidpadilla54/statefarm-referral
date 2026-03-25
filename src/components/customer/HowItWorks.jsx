const STEPS = [
  { icon: '📝', title: 'Submit a Referral', desc: 'Fill out the form below with your friend\'s name and contact info.' },
  { icon: '📞', title: 'We Reach Out', desc: 'Our team contacts your friend to schedule a free insurance quote.' },
  { icon: '🎁', title: 'Earn a Gift Card', desc: 'Once the quote is completed, a gift card is on its way to you!' },
]

export default function HowItWorks() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-6">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STEPS.map((step, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
            <div className="text-3xl mb-3">{step.icon}</div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="bg-brand-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <h3 className="font-semibold text-gray-800 text-sm">{step.title}</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
