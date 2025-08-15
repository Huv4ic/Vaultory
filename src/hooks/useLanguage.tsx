import { useState, useEffect } from 'react';
import { translations } from '@/locales/translations';

export type Language = 'ru' | 'en' | 'uk';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Получаем язык из localStorage или используем русский по умолчанию
    const saved = localStorage.getItem('vaultory-language');
    return (saved as Language) || 'ru';
  });

  useEffect(() => {
    // Сохраняем язык в localStorage при изменении
    localStorage.setItem('vaultory-language', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  // Функция для перевода текста
  const t = (key: string): string => {
    return translations[currentLanguage][key] || key;
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
  };
};
