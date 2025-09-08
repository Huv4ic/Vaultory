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
    <div className="relative group">
      <div className="absolute inset-0 bg-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center space-x-2 px-4 py-3 rounded-2xl bg-black/90 backdrop-blur-xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105 shadow-lg shadow-pink-500/20"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <ChevronDown 
          className={`w-4 h-4 text-pink-400 transition-all duration-300 ${isOpen ? 'rotate-180 text-pink-300' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-24 bg-black/95 backdrop-blur-xl rounded-2xl border border-pink-500/30 shadow-2xl shadow-pink-500/25 z-50">
          <div className="py-3">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full flex items-center justify-center px-4 py-3 hover:bg-pink-500/10 transition-all duration-200 rounded-xl mx-1 ${
                  language.code === activeLanguage 
                    ? 'text-pink-400 bg-pink-500/20 border border-pink-500/30' 
                    : 'text-gray-300 hover:text-pink-400'
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
