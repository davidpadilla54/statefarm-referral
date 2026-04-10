// Named colors keyed on first name (lowercase) — hex avoids Tailwind purging
const STAFF_COLORS = {
  david:   '#CC0000',  // red (brand)
  shay:    '#ec4899',  // pink-500
  stanley: '#16a34a',  // green-600
  javett:  '#9333ea',  // purple-600
  santos:  '#3b82f6',  // blue-500
  yohance: '#7f1d1d',  // red-900 / burgundy
  brooke:  '#f59e0b',  // amber-500 (yellow, readable with white)
}

const FALLBACK_COLORS = [
  '#10b981', '#14b8a6', '#6366f1',
  '#f97316', '#06b6d4', '#8b5cf6',
]

function pickColor(name = '') {
  const first = (name ?? '').trim().split(/\s+/)[0]?.toLowerCase() ?? ''
  if (STAFF_COLORS[first]) return STAFF_COLORS[first]
  let n = 0
  for (const c of name) n += c.charCodeAt(0)
  return FALLBACK_COLORS[n % FALLBACK_COLORS.length]
}

function initials(name = '') {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Avatar({ name = '', colorName, size = 'md' }) {
  const sz = size === 'sm' ? 'w-7 h-7 text-xs'
           : size === 'xs' ? 'w-6 h-6 text-xs'
           : size === 'lg' ? 'w-11 h-11 text-base'
           : 'w-9 h-9 text-sm'
  return (
    <div
      style={{ backgroundColor: pickColor(colorName ?? name) }}
      className={`${sz} rounded-full flex items-center justify-center text-white font-bold shrink-0 select-none`}
    >
      {initials(name)}
    </div>
  )
}
