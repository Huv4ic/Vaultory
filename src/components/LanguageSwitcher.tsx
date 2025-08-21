import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

type Language = 'ru' | 'en' | 'uk';

interface LanguageSwitcherProps {
  currentLanguage?: Language;
  onLanguageChange?: (language: Language) => void;
}

const languages: { code: Language; flag: string }[] = [
  { code: 'ru', flag: '🇷🇺' },
  { code: 'en', flag: '🇺🇸' },
  { code: 'uk', flag: '🇺🇦' }
];

const LanguageSwitcher = ({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage: hookLanguage, changeLanguage } = useLanguage();
  
  // Используем язык из пропсов или из хука
  const activeLanguage = currentLanguage || hookLanguage;
  const currentLang = languages.find(lang => lang.code === activeLanguage) || languages[0];

  const handleLanguageSelect = (language: Language) => {
    // Вызываем функцию из пропсов или из хука
    if (onLanguageChange) {
      onLanguageChange(language);
    } else {
      changeLanguage(language);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 text-emerald-400 hover:text-emerald-300 transition-all duration-200 border border-gray-700/50 hover:border-emerald-500/50"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-20 bg-gray-800/95 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl z-50">
          <div className="py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full flex items-center justify-center px-4 py-2 hover:bg-gray-700/50 transition-colors duration-150 ${
                  language.code === activeLanguage 
                    ? 'text-emerald-400 bg-emerald-500/10' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
