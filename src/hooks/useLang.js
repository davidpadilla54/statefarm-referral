import { useState, useCallback } from 'react'
import { t } from '../lib/translations'

export function useLang() {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('dp_lang') === 'es' ? 'es' : 'en'
  })

  const toggleLang = useCallback(() => {
    setLangState(prev => {
      const next = prev === 'en' ? 'es' : 'en'
      localStorage.setItem('dp_lang', next)
      return next
    })
  }, [])

  return { lang, toggleLang, tr: t[lang] }
}
