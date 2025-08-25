import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, Package } from 'lucide-react';
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-xl border-b border-amber-500/30 shadow-2xl shadow-amber-500/20' 
        : 'bg-gradient-to-r from-black via-gray-900 to-black'
    }`}>
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Логотип с анимацией */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 relative transform group-hover:scale-110 transition-all duration-500">
              {/* Темная премиальная иконка с буквой V */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-900 to-black rounded-lg sm:rounded-xl flex items-center justify-center shadow-2xl shadow-purple-900/50 group-hover:shadow-red-900/70 border border-gray-700 group-hover:border-red-500/50 transition-all duration-500">
                <div className="relative">
                  {/* Основная буква V */}
                  <div className="text-red-500 font-bold text-lg sm:text-xl tracking-wider drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] group-hover:drop-shadow-[0_0_12px_rgba(220,38,38,1)] transition-all duration-500">
                    V
                  </div>
                  {/* Темное свечение - красный верх */}
                  <div className="absolute inset-0 text-red-400 font-bold text-lg sm:text-xl tracking-wider blur-[1px] opacity-70 group-hover:opacity-100 transition-all duration-500">
                    V
                  </div>
                  {/* Темное свечение - фиолетовый низ */}
                  <div className="absolute inset-0 text-purple-500 font-bold text-lg sm:text-xl tracking-wider blur-[2px] opacity-50 -bottom-0.5 group-hover:opacity-80 transition-all duration-500">
                    V
                  </div>
                </div>
              </div>
              {/* Темное анимированное свечение вокруг */}
              <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-red-600 via-purple-700 to-slate-800 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700 animate-pulse"></div>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-red-500 via-purple-400 to-slate-300 bg-clip-text text-transparent group-hover:from-red-400 group-hover:via-purple-300 group-hover:to-white transition-all duration-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]">
              Vaultory
            </span>
          </Link>

          {/* Десктопное меню */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-105 font-medium relative group text-sm lg:text-base"
            >
              {t('Главная')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/catalog" 
              className="text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-105 font-medium relative group text-sm lg:text-base"
            >
              {t('Каталог')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/cases" 
              className="text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-105 font-medium relative group text-sm lg:text-base"
            >
              {t('Кейсы')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-105 font-medium relative group text-sm lg:text-base"
            >
              {t('О нас')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/support" 
              className="text-gray-300 hover:text-amber-400 transition-all duration-300 hover:scale-105 font-medium relative group text-sm lg:text-base"
            >
              {t('Поддержка')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Правая часть */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* Переключатель языка */}
            <LanguageSwitcher />

            {/* Корзина с анимацией */}
            <Link 
              to="/cart" 
              className="relative group p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 hover:scale-110"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" />
              {items.length > 0 && (
                <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-gradient-to-r from-emerald-500 to-purple-600 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/50">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Профиль пользователя */}
            {telegramUser ? (
              <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
                <BalanceDisplay balance={balance} />
                <div className="relative group">
                  <button className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                    )}
                    <span className="text-amber-400 font-medium hidden lg:block text-sm">
                      {telegramUser.first_name}
                    </span>
                  </button>
                  
                  {/* Выпадающее меню профиля */}
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-black/95 backdrop-blur-xl border border-amber-500/30 rounded-xl shadow-2xl shadow-amber-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-2 sm:space-x-3 w-full p-2 sm:p-3 rounded-lg hover:bg-amber-500/10 transition-colors duration-200 group/item"
                      >
                        <Settings className="w-4 h-4 text-amber-400 group-hover/item:text-amber-300" />
                        <span className="text-gray-300 group-hover/item:text-amber-300 text-sm">{t('Профиль')}</span>
                      </Link>
                      <Link 
                        to="/inventory" 
                        className="flex items-center space-x-2 sm:space-x-3 w-full p-2 sm:p-3 rounded-lg hover:bg-amber-500/10 transition-colors duration-200 group/item"
                      >
                        <Package className="w-4 h-4 text-amber-400 group-hover/item:text-amber-300" />
                        <span className="text-gray-300 group-hover/item:text-amber-300 text-sm">Инвентарь</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-2 sm:space-x-3 w-full p-2 sm:p-3 rounded-lg hover:bg-red-500/10 transition-colors duration-200 group/item"
                      >
                        <LogOut className="w-4 h-4 text-red-400 group-hover/item:text-red-300" />
                        <span className="text-red-400 group-hover/item:text-red-300 text-sm">{t('Выйти')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-black font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                {t('Войти')}
              </Link>
            )}

            {/* Мобильное меню */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-red-500/30 animate-slide-down">
            {/* Мобильный профиль и баланс (только для авторизованных пользователей) */}
            {telegramUser && (
              <div className="mb-4 pb-4 border-b border-red-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-800 via-gray-900 to-black rounded-full flex items-center justify-center border border-gray-700">
                        <User className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                    <span className="text-white font-medium">{telegramUser.first_name}</span>
                  </div>
                </div>
                <div className="mb-2">
                  <BalanceDisplay balance={balance} />
                </div>
              </div>
            )}
            <nav className="flex flex-col space-y-3 sm:space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium text-sm sm:text-base px-2 py-1 rounded-lg hover:bg-red-500/10"
              >
                {t('Главная')}
              </Link>
              <Link 
                to="/catalog" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium text-sm sm:text-base px-2 py-1 rounded-lg hover:bg-red-500/10"
              >
                {t('Каталог')}
              </Link>
              <Link 
                to="/cases" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium text-sm sm:text-base px-2 py-1 rounded-lg hover:bg-red-500/10"
              >
                {t('Кейсы')}
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium text-sm sm:text-base px-2 py-1 rounded-lg hover:bg-red-500/10"
              >
                {t('О нас')}
              </Link>
              <Link 
                to="/support" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium text-sm sm:text-base px-2 py-1 rounded-lg hover:bg-red-500/10"
              >
                {t('Поддержка')}
              </Link>
              {telegramUser && (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium text-sm sm:text-base px-2 py-1 rounded-lg hover:bg-red-500/10 flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{t('Профиль')}</span>
                  </Link>
                  <Link 
                    to="/inventory" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium text-sm sm:text-base px-2 py-1 rounded-lg hover:bg-red-500/10 flex items-center space-x-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>Инвентарь</span>
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200 font-medium text-sm sm:text-base px-2 py-1 rounded-lg hover:bg-red-500/10 flex items-center space-x-2 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
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
