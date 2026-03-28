const COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-violet-500', 'bg-orange-500', 'bg-teal-500',
  'bg-pink-500', 'bg-indigo-500',
]

function pickColor(name = '') {
  let n = 0
  for (const c of name) n += c.charCodeAt(0)
  return COLORS[n % COLORS.length]
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Avatar({ name = '', size = 'md' }) {
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-11 h-11 text-base' : 'w-9 h-9 text-sm'
  return (
    <div className={`${pickColor(name)} ${sz} rounded-full flex items-center justify-center text-white font-bold shrink-0 select-none`}>
      {initials(name)}
    </div>
  )
}
