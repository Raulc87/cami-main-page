import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App'
import { LanguageProvider } from './context/LanguageContext'

// Apply the fonts stylesheet that index.html preloaded (no render-blocking request).
document.getElementById('fonts-css').rel = 'stylesheet'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
