const STATUS_STYLES = {
  New:       'bg-gray-100 text-gray-700',
  Contacted: 'bg-blue-100 text-blue-700',
  Quoted:    'bg-green-100 text-green-700',
  Won:       'bg-emerald-100 text-emerald-700',
  Lost:      'bg-red-100 text-red-700',
  Pending:   'bg-yellow-100 text-yellow-700',
  Sent:      'bg-green-100 text-green-700',
}

const TIER_STYLES = {
  Bronze:   'bg-amber-100 text-amber-700 border border-amber-300',
  Silver:   'bg-slate-100 text-slate-600 border border-slate-300',
  Gold:     'bg-yellow-50 text-yellow-600 border border-yellow-300',
  Platinum: 'bg-purple-100 text-purple-700 border border-purple-300',
}

export default function Badge({ label, type = 'status', className = '' }) {
  const styles = type === 'tier' ? TIER_STYLES : STATUS_STYLES
  const style = styles[label] ?? 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${style} ${className}`}>
      {label}
    </span>
  )
}
