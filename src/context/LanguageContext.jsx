import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'cmp-lang'

function detectInitialLang() {
  if (typeof window === 'undefined') return 'en'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'es') return stored

  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectInitialLang)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => setLang((l) => (l === 'en' ? 'es' : 'en'))

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
