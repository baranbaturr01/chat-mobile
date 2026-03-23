import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getTranslations, TranslationKeys} from '@/i18n';
import type {Language} from '@/types/user';

const LANGUAGE_STORAGE_KEY = '@chat_mobile:language';

interface LanguageContextValue {
  language: Language;
  t: TranslationKeys;
  setLanguage: (lang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLanguage = 'tr',
}) => {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = useCallback(async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // storage errors are non-fatal; language will still be updated in-memory
    }
    setLanguageState(lang);
  }, []);

  const t = useMemo(() => getTranslations(language), [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({language, t, setLanguage}),
    [language, t, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};

export const loadSavedLanguage = async (): Promise<Language> => {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'tr' || saved === 'en') {
      return saved;
    }
  } catch {
    // fall through to default
  }
  return 'tr';
};

export default LanguageContext;
