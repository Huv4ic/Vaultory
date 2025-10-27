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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#181818] border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 hover:scale-105"
      >
        <span className="text-sm text-[#a31212] font-bold">{currentLang.flag}</span>
        <ChevronDown 
          className={`w-3 h-3 text-[#f0f0f0] transition-all duration-300 ${isOpen ? 'rotate-180 text-[#f0f0f0]' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-24 bg-[#181818] rounded-2xl border border-[#1c1c1c] z-50">
          <div className="py-3">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full flex items-center justify-center px-4 py-3 hover:bg-[#1c1c1c] transition-all duration-200 rounded-xl mx-1 ${
                  language.code === activeLanguage 
                    ? 'text-[#a31212] bg-[#1c1c1c] border border-[#a31212]' 
                    : 'text-[#a0a0a0] hover:text-[#a31212]'
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
