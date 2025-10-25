import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, Package, Crown, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';
import BalanceDisplay from './BalanceDisplay';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { telegramUser, signOutTelegram, balance, profile } = useAuth();
  const { items } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOutTelegram();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0e0e0e]/95 backdrop-blur-xl border-b border-[#1c1c1c]' 
        : 'bg-[#0e0e0e]'
    }`}>
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Логотип с анимацией */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform group-hover:scale-105 transition-all duration-300">
              {/* Иконка с буквой V */}
              <div className="absolute inset-0 bg-[#181818] backdrop-blur-xl rounded-xl flex items-center justify-center border border-[#1c1c1c] group-hover:border-[#a31212] transition-all duration-300">
                <div className="relative">
                  {/* Основная буква V */}
                  <div className="text-[#a31212] font-black text-xl sm:text-2xl tracking-wider group-hover:text-[#8a0f0f] transition-all duration-300">
                    V
                  </div>
                </div>
              </div>
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl font-black text-[#f0f0f0] group-hover:text-[#a31212] transition-all duration-300">
              Vaultory
            </span>
          </Link>

          {/* Десктопное меню */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-all duration-300 hover:scale-105 font-bold relative group text-base"
            >
              {t('Главная')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a31212] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/cases" 
              className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-all duration-300 hover:scale-105 font-bold relative group text-base"
            >
              {t('Кейсы')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a31212] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-all duration-300 hover:scale-105 font-bold relative group text-base"
            >
              {t('О нас')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a31212] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/support" 
              className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-all duration-300 hover:scale-105 font-bold relative group text-base"
            >
              {t('Поддержка')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#a31212] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Правая часть */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* Переключатель языка */}
            <LanguageSwitcher />

            {/* Корзина с улучшенным дизайном */}
            <Link 
              to="/cart" 
              className="relative group"
            >
              <div className="relative bg-[#181818] backdrop-blur-xl rounded-xl p-3 border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 hover:scale-105">
                {/* Иконка корзины */}
                <div className="relative z-10">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#a31212] group-hover:text-[#8a0f0f] transition-all duration-300 group-hover:scale-105" />
                </div>
                
                {/* Счетчик товаров */}
                {items.length > 0 && (
                  <div className="absolute -top-2 -right-2">
                    <div className="relative">
                      <span className="bg-[#a31212] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#0e0e0e]">
                        {items.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Link>

            {/* Профиль пользователя */}
            {telegramUser ? (
              <div className="hidden md:flex items-center space-x-3">
                <BalanceDisplay balance={balance} />
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-xl bg-[#181818] backdrop-blur-xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 hover:scale-105">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-[#a31212]" />
                    )}
                    <span className="text-[#a31212] font-bold hidden lg:block text-sm">
                      {telegramUser.first_name}
                    </span>
                  </button>
                  
                  {/* Выпадающее меню профиля */}
                  <div className="absolute right-0 mt-2 w-48 bg-[#181818] backdrop-blur-xl border border-[#1c1c1c] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#1c1c1c] transition-colors duration-200 group/item"
                      >
                        <Settings className="w-4 h-4 text-[#a31212] group-hover/item:text-[#8a0f0f]" />
                        <span className="text-[#a0a0a0] group-hover/item:text-[#f0f0f0] text-sm">{t('Профиль')}</span>
                      </Link>
                      <Link 
                        to="/inventory" 
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#1c1c1c] transition-colors duration-200 group/item"
                      >
                        <Package className="w-4 h-4 text-[#a31212] group-hover/item:text-[#8a0f0f]" />
                        <span className="text-[#a0a0a0] group-hover/item:text-[#f0f0f0] text-sm">Инвентарь</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#1c1c1c] transition-colors duration-200 group/item"
                      >
                        <LogOut className="w-4 h-4 text-[#a31212] group-hover/item:text-[#8a0f0f]" />
                        <span className="text-[#a31212] group-hover/item:text-[#8a0f0f] text-sm">{t('Выйти')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="px-6 py-2 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
              >
                {t('Войти')}
              </Link>
            )}

            {/* Мобильное меню */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#181818] backdrop-blur-xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-[#a31212]" />
              ) : (
                <Menu className="w-6 h-6 text-[#a31212]" />
              )}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#1c1c1c]">
            {/* Мобильный профиль и баланс (только для авторизованных пользователей) */}
            {telegramUser && (
              <div className="mb-4 pb-4 border-b border-[#1c1c1c]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-[#181818] backdrop-blur-xl rounded-full flex items-center justify-center border border-[#1c1c1c]">
                        <User className="w-4 h-4 text-[#a31212]" />
                      </div>
                    )}
                    <span className="text-[#f0f0f0] font-bold">{telegramUser.first_name}</span>
                  </div>
                </div>
                <div className="mb-2">
                  <BalanceDisplay balance={balance} />
                </div>
              </div>
            )}
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-[#1c1c1c]"
              >
                {t('Главная')}
              </Link>
              <Link 
                to="/cases" 
                onClick={() => setIsMenuOpen(false)}
                className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-[#1c1c1c]"
              >
                {t('Кейсы')}
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-[#1c1c1c]"
              >
                {t('О нас')}
              </Link>
              <Link 
                to="/support" 
                onClick={() => setIsMenuOpen(false)}
                className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-[#1c1c1c]"
              >
                {t('Поддержка')}
              </Link>
              {telegramUser && (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-[#1c1c1c] flex items-center space-x-3"
                  >
                    <Settings className="w-5 h-5" />
                    <span>{t('Профиль')}</span>
                  </Link>
                  <Link 
                    to="/inventory" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-[#1c1c1c] flex items-center space-x-3"
                  >
                    <Package className="w-5 h-5" />
                    <span>Инвентарь</span>
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-[#a31212] hover:text-[#8a0f0f] transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-[#1c1c1c] flex items-center space-x-3 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('Выйти')}</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
