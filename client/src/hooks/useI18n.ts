import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, SupportedLanguage } from "@/i18n/translations";

interface I18nContextType {
  currentLanguage: string;
  t: (key: string) => string;
  setLanguage: (language: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    // Load saved language or detect browser language
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage in translations) {
      setCurrentLanguage(savedLanguage as SupportedLanguage);
    } else {
      const browserLanguage = navigator.language.split('-')[0] as SupportedLanguage;
      if (browserLanguage in translations) {
        setCurrentLanguage(browserLanguage);
      }
    }
  }, []);

  const setLanguage = (language: string) => {
    if (language in translations) {
      setCurrentLanguage(language as SupportedLanguage);
      localStorage.setItem('preferred-language', language);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ currentLanguage, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
