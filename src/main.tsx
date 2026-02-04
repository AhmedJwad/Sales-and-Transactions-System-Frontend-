import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { CustomThemeProvider } from './ThemeContext'
import './i18n'
import { CurrencyProvider } from './context/CurrencyContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomThemeProvider>
    <CurrencyProvider>   
    <App />
    </CurrencyProvider>   
    </CustomThemeProvider>
  </StrictMode>,
)
