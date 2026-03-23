import tr from './tr';
import en from './en';
import type {Language} from '@/types/user';

export type TranslationKeys = typeof tr;

const translations: Record<Language, TranslationKeys> = {tr, en};

export const getTranslations = (language: Language): TranslationKeys =>
  translations[language];

export {tr, en};
