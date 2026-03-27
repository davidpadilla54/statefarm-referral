export default function SortableHeader({ label, colKey, activeSortKey, dir, onSort, className = '' }) {
  const isActive = colKey === activeSortKey
  return (
    <th
      onClick={() => onSort(colKey)}
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap transition-colors hover:text-gray-800 ${isActive ? 'text-brand-red' : 'text-gray-500'} ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-30'}`}>
          {isActive && dir === 'desc' ? '↓' : '↑'}
        </span>
      </span>
    </th>
  )
}
