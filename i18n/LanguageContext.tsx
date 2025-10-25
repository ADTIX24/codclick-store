import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
// FIX: Added .ts extension to module import.
import type { Language, Direction, LanguageContextType } from '../types.ts';
// FIX: Added .ts extension to module import.
import { translations } from './translations.ts';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [dir, setDir] = useState<Direction>('rtl');

  useEffect(() => {
    const newDir = lang === 'ar' ? 'rtl' : 'ltr';
    setDir(newDir);
    document.documentElement.lang = lang;
    document.documentElement.dir = newDir;
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang((prevLang) => (prevLang === 'ar' ? 'en' : 'ar'));
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let result: any = translations[lang];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult: any = translations['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if (fallbackResult === undefined) return key;
        }
        return fallbackResult || key;
      }
    }
    return result || key;
  }, [lang]);

  const value = useMemo(() => ({ lang, dir, t, toggleLanguage }), [lang, dir, t, toggleLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};