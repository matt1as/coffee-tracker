'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported languages
export type Language = 'en' | 'sv' | 'nl' | 'fr';

// Define the language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, any>;
}

// Create the language context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translations: {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Initialize language state from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Load translations for the current language
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Import the translation file dynamically
        const translationModule = await import(`../translations/${language}.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}`, error);
        // Fallback to English if loading fails
        if (language !== 'en') {
          const enTranslations = await import('../translations/en.json');
          setTranslations(enTranslations.default);
        }
      }
    };

    loadTranslations();
  }, [language]);

  // Update language and store in localStorage
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  // Initialize from localStorage on first render (client-side only)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language | null;
    if (savedLanguage && ['en', 'sv', 'nl', 'fr'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage: handleSetLanguage, 
        translations 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Helper function to get a translation by key
export const useTranslation = () => {
  const { translations } = useLanguage();
  
  const t = (key: string) => {
    // Split the key into parts (e.g., "common.save" -> ["common", "save"])
    const parts = key.split('.');
    
    // Navigate through the translations object
    let value = translations;
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        // Return the key if translation not found
        return key;
      }
    }
    
    return value;
  };
  
  return { t };
};