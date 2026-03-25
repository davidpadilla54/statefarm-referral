import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++idCounter
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4">
        {toasts.map(t => (
          <div
            key={t.id}
            onClick={() => remove(t.id)}
            className={`flex items-start gap-3 p-4 rounded-xl shadow-lg cursor-pointer animate-slide-up
              ${t.type === 'success' ? 'bg-green-600 text-white' : ''}
              ${t.type === 'error'   ? 'bg-red-600 text-white'   : ''}
              ${t.type === 'info'    ? 'bg-gray-800 text-white'  : ''}
            `}
          >
            <span className="text-sm font-medium leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
