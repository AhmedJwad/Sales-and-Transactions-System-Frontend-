import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


import en from './locales/en/en';
import ar from './locales/ar/ar';

const resources = {
  en: { ...en() },
  ar: { ...ar() },
};

i18n
  .use(LanguageDetector) // يكتشف اللغة (localStorage, navigator,...)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false }, // لسهولة التعامل بدون Suspense
  });

// ضبط خاصية اللغة واتجاه النص في ملف الـ HTML عند التحميل أو تغيير اللغة
const setDocumentLangAndDir = (lng:any) => {
  const base = lng.startsWith('ar') ? 'ar' : 'en';
  const dir = base === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = base;
  document.documentElement.dir = dir;
  document.body.dir = dir;
};

setDocumentLangAndDir(i18n.language || localStorage.getItem('lang') || 'en');

// عند تغيّر اللغة (يحفظ في localStorage ويضبط dir)
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
  setDocumentLangAndDir(lng);
});

export default i18n;
