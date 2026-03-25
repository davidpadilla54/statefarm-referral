export default function ProgressBar({ percent, color = 'bg-brand-red', className = '' }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 overflow-hidden ${className}`}>
      <div
        className={`${color} h-3 rounded-full transition-all duration-700`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  )
}
