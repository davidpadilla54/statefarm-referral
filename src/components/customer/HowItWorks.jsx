import { UserPlus, Phone, Gift } from 'lucide-react'

const STEP_ICONS = [UserPlus, Phone, Gift]

export default function HowItWorks({ tr }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-6">{tr.howItWorksTitle}</h2>
      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Connector line (desktop only) */}
        <div className="hidden sm:block absolute top-10 left-[22%] right-[22%] h-px border-t-2 border-dashed border-gray-200 z-0" />

        {tr.steps.map((step, i) => {
          const Icon = STEP_ICONS[i]
          return (
            <div key={i} className="relative z-10 bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm hover:shadow-md transition-shadow">
              {/* Icon circle */}
              <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-4">
                <Icon size={24} className="text-brand-red" strokeWidth={1.75} />
              </div>

              {/* Step number badge */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="bg-brand-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-gray-800 text-sm">{step.title}</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
