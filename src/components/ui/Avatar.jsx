// Named color assignments — keyed on first name (lowercase)
const STAFF_COLORS = {
  david:   'bg-red-600',
  shay:    'bg-pink-500',
  stanley: 'bg-green-600',
  javett:  'bg-purple-600',
  santos:  'bg-blue-500',
  yohance: 'bg-red-900',
  brooke:  'bg-yellow-400',
}

const FALLBACK_COLORS = [
  'bg-emerald-500', 'bg-teal-500', 'bg-indigo-500',
  'bg-orange-500',  'bg-cyan-500', 'bg-violet-500',
]

function pickColor(name = '') {
  const first = name.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
  if (STAFF_COLORS[first]) return STAFF_COLORS[first]
  let n = 0
  for (const c of name) n += c.charCodeAt(0)
  return FALLBACK_COLORS[n % FALLBACK_COLORS.length]
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Avatar({ name = '', colorName, size = 'md' }) {
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-11 h-11 text-base' : 'w-9 h-9 text-sm'
  return (
    <div className={`${pickColor(colorName ?? name)} ${sz} rounded-full flex items-center justify-center text-white font-bold shrink-0 select-none`}>
      {initials(name)}
    </div>
  )
}
