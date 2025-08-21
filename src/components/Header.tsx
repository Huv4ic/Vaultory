import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';
import BalanceDisplay from './BalanceDisplay';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { telegramUser, signOutTelegram, balance } = useAuth();
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-xl border-b border-amber-500/30 shadow-2xl shadow-amber-500/20' 
        : 'bg-gradient-to-r from-black via-gray-900 to-black'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип с анимацией */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 relative transform group-hover:scale-110 transition-all duration-500">
              {/* Новая 3D буква V с неоновым свечением */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-2xl shadow-amber-500/50 group-hover:shadow-amber-500/70 transition-all duration-500">
                <div className="relative">
                  {/* Основная буква V */}
                  <div className="text-black font-bold text-xl tracking-wider transform rotate-12 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] group-hover:drop-shadow-[0_0_12px_rgba(255,215,0,1)] transition-all duration-500">
                    V
                  </div>
                  {/* Неоновое свечение - золотой верх */}
                  <div className="absolute inset-0 text-amber-300 font-bold text-xl tracking-wider transform rotate-12 blur-[1px] opacity-70 group-hover:opacity-100 transition-all duration-500">
                    V
                  </div>
                  {/* Неоновое свечение - изумрудный низ */}
                  <div className="absolute inset-0 text-emerald-400 font-bold text-xl tracking-wider transform rotate-12 blur-[2px] opacity-50 -bottom-0.5 group-hover:opacity-80 transition-all duration-500">
                    V
                  </div>
                </div>
              </div>
              {/* Анимированное свечение вокруг */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold text-amber-400 group-hover:text-amber-300 transition-all duration-500">
              Vaultory
            </span>
          </Link>

          {/* Десктопное меню */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-105 font-medium relative group"
            >
              {t('Главная')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/catalog" 
              className="text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-105 font-medium relative group"
            >
              {t('Каталог')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/cases" 
              className="text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-105 font-medium relative group"
            >
              {t('Кейсы')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-105 font-medium relative group"
            >
              {t('О нас')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/support" 
              className="text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-105 font-medium relative group"
            >
              {t('Поддержка')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Правая часть */}
          <div className="flex items-center space-x-4">
            {/* Переключатель языка */}
            <LanguageSwitcher />

            {/* Корзина с анимацией */}
            <Link 
              to="/cart" 
              className="relative group p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 hover:scale-110"
            >
              <ShoppingCart className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/50">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Профиль пользователя */}
            {telegramUser ? (
              <div className="flex items-center space-x-3">
                <BalanceDisplay balance={balance} />
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
                    <User className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 font-medium hidden sm:block">
                      {telegramUser.first_name}
                    </span>
                  </button>
                  
                  {/* Выпадающее меню профиля */}
                  <div className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-amber-500/30 rounded-xl shadow-2xl shadow-amber-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-amber-500/10 transition-colors duration-200 group/item"
                      >
                        <Settings className="w-4 h-4 text-amber-400 group-hover/item:text-amber-300" />
                        <span className="text-gray-300 group-hover/item:text-amber-300">{t('Профиль')}</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-500/10 transition-colors duration-200 group/item"
                      >
                        <LogOut className="w-4 h-4 text-red-400 group-hover/item:text-red-300" />
                        <span className="text-red-400 group-hover/item:text-red-300">{t('Выйти')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-black font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5"
              >
                {t('Войти')}
              </Link>
            )}

            {/* Мобильное меню */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-amber-400" />
              ) : (
                <Menu className="w-6 h-6 text-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-500/30 animate-slide-down">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-amber-400 transition-colors duration-200 font-medium"
              >
                {t('Главная')}
              </Link>
              <Link 
                to="/catalog" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-amber-400 transition-colors duration-200 font-medium"
              >
                {t('Каталог')}
              </Link>
              <Link 
                to="/cases" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-amber-400 transition-colors duration-200 font-medium"
              >
                {t('Кейсы')}
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-amber-400 transition-colors duration-200 font-medium"
              >
                {t('О нас')}
              </Link>
              <Link 
                to="/support" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-amber-400 transition-colors duration-200 font-medium"
              >
                {t('Поддержка')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
