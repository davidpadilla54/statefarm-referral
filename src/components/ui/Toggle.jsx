/** A pill-style toggle button (used for insurance interest selection). */
export default function Toggle({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors
        ${active
          ? 'bg-brand-red text-white border-brand-red'
          : 'bg-white text-gray-600 border-gray-300 hover:border-brand-red hover:text-brand-red'
        }`}
    >
      {label}
    </button>
  )
}
