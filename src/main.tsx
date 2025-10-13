import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { CustomThemeProvider } from './ThemeContext'
import './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomThemeProvider>
    <App />
    </CustomThemeProvider>
  </StrictMode>,
)
