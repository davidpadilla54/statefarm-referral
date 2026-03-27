export default function HowItWorks({ tr }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-6">{tr.howItWorksTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tr.steps.map((step, i) => (
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
