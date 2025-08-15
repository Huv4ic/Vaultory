import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Language = 'ru' | 'en' | 'uk';

interface LanguageSwitcherProps {
  currentLanguage?: Language;
  onLanguageChange?: (language: Language) => void;
}

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'ru', name: 'RU', flag: '🇷🇺' },
  { code: 'en', name: 'EN', flag: '🇺🇸' },
  { code: 'uk', name: 'UK', flag: '🇺🇦' },
];

const LanguageSwitcher = ({ currentLanguage = 'ru', onLanguageChange }: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange?.(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 text-blue-400 hover:text-blue-300 transition-all duration-200 border border-gray-700/50 hover:border-blue-500/50"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="font-medium">{currentLang.name}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-gray-800/95 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl z-50">
          <div className="py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700/50 transition-colors duration-150 ${
                  language.code === currentLanguage 
                    ? 'text-blue-400 bg-blue-500/10' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
