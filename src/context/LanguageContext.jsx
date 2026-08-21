import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'cmp-lang'

function detectInitialLang() {
  if (typeof window === 'undefined') return 'en'

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'es') return stored
  } catch {
    // localStorage can throw when disabled (private browsing, browser privacy settings) — fall
    // through to browser-language detection without persistence.
  }

  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('es')
    ? 'es'
    : 'en'
}

// Computed once at module load (before React renders) so <html lang> matches the initial
// language from the very first paint — index.html hardcodes lang="es" as a static fallback.
const initialLang = detectInitialLang()
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // localStorage can throw when disabled — the toggle still works for the session,
      // it just won't persist across reloads.
    }
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
