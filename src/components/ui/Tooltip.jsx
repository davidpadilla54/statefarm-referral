import { useState } from 'react'
import { HelpCircle } from 'lucide-react'

export default function Tooltip({ text, position = 'top' }) {
  const [show, setShow] = useState(false)

  const pos = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
  }[position] ?? 'bottom-full left-1/2 -translate-x-1/2 mb-2'

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <HelpCircle size={14} className="text-gray-400 hover:text-gray-500 cursor-help ml-1 shrink-0" />
      {show && (
        <span className={`absolute ${pos} z-50 w-64 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl leading-relaxed pointer-events-none whitespace-normal`}>
          {text}
        </span>
      )}
    </span>
  )
}
