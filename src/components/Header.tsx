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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-xl border-b border-cyan-500/30 shadow-2xl shadow-cyan-500/20' 
        : 'bg-black'
    }`}>
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Логотип с анимацией */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative transform group-hover:scale-110 transition-all duration-500">
              {/* Иконка с буквой V */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xl rounded-xl flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-500 shadow-lg shadow-cyan-500/20">
                <div className="relative">
                  {/* Основная буква V */}
                  <div className="text-cyan-400 font-black text-xl sm:text-2xl tracking-wider group-hover:text-cyan-300 transition-all duration-500">
                    V
                  </div>
                  {/* Свечение */}
                  <div className="absolute inset-0 text-cyan-400 font-black text-xl sm:text-2xl tracking-wider blur-sm opacity-50 group-hover:opacity-80 transition-all duration-500">
                    V
                  </div>
                </div>
              </div>
              {/* Анимированное свечение вокруг */}
              <div className="absolute -inset-2 bg-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl font-black text-white group-hover:text-cyan-300 transition-all duration-500">
              Vaultory
            </span>
          </Link>

          {/* Десктопное меню */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:scale-105 font-bold relative group text-base"
            >
              {t('Главная')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/catalog" 
              className="text-gray-300 hover:text-purple-400 transition-all duration-300 hover:scale-105 font-bold relative group text-base"
            >
              {t('Каталог')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/cases" 
              className="text-gray-300 hover:text-pink-400 transition-all duration-300 hover:scale-105 font-bold relative group text-base"
            >
              {t('Кейсы')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-yellow-400 transition-all duration-300 hover:scale-105 font-bold relative group text-base"
            >
              {t('О нас')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/support" 
              className="text-gray-300 hover:text-green-400 transition-all duration-300 hover:scale-105 font-bold relative group text-base"
            >
              {t('Поддержка')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
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
              <div className="relative bg-black/80 backdrop-blur-xl rounded-xl p-3 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:scale-110 shadow-lg shadow-cyan-500/20">
                {/* Анимированный фон при hover */}
                <div className="absolute inset-0 bg-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Иконка корзины */}
                <div className="relative z-10">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 group-hover:text-cyan-300 transition-all duration-300 group-hover:scale-110" />
                </div>
                
                {/* Счетчик товаров */}
                {items.length > 0 && (
                  <div className="absolute -top-2 -right-2">
                    <div className="relative">
                      <span className="bg-cyan-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-black">
                        {items.length}
                      </span>
                      {/* Светящееся кольцо */}
                      <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-30"></div>
                    </div>
                  </div>
                )}
                
                {/* Декоративные элементы */}
                <div className="absolute top-1 right-1 w-1 h-1 bg-cyan-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>

            {/* Профиль пользователя */}
            {telegramUser ? (
              <div className="hidden md:flex items-center space-x-3">
                <BalanceDisplay balance={balance} />
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-xl bg-black/80 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/20">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-purple-400" />
                    )}
                    <span className="text-purple-400 font-bold hidden lg:block text-sm">
                      {telegramUser.first_name}
                    </span>
                  </button>
                  
                  {/* Выпадающее меню профиля */}
                  <div className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-purple-500/10 transition-colors duration-200 group/item"
                      >
                        <Settings className="w-4 h-4 text-purple-400 group-hover/item:text-purple-300" />
                        <span className="text-gray-300 group-hover/item:text-purple-300 text-sm">{t('Профиль')}</span>
                      </Link>
                      <Link 
                        to="/inventory" 
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-purple-500/10 transition-colors duration-200 group/item"
                      >
                        <Package className="w-4 h-4 text-purple-400 group-hover/item:text-purple-300" />
                        <span className="text-gray-300 group-hover/item:text-purple-300 text-sm">Инвентарь</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-500/10 transition-colors duration-200 group/item"
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
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25"
              >
                {t('Войти')}
              </Link>
            )}

            {/* Мобильное меню */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-black/80 backdrop-blur-xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-pink-400" />
              ) : (
                <Menu className="w-6 h-6 text-pink-400" />
              )}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-cyan-500/30">
            {/* Мобильный профиль и баланс (только для авторизованных пользователей) */}
            {telegramUser && (
              <div className="mb-4 pb-4 border-b border-cyan-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center border border-cyan-500/30">
                        <User className="w-4 h-4 text-cyan-400" />
                      </div>
                    )}
                    <span className="text-white font-bold">{telegramUser.first_name}</span>
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
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-cyan-500/10"
              >
                {t('Главная')}
              </Link>
              <Link 
                to="/catalog" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-purple-500/10"
              >
                {t('Каталог')}
              </Link>
              <Link 
                to="/cases" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-pink-400 transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-pink-500/10"
              >
                {t('Кейсы')}
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-yellow-500/10"
              >
                {t('О нас')}
              </Link>
              <Link 
                to="/support" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-green-500/10"
              >
                {t('Поддержка')}
              </Link>
              {telegramUser && (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-purple-500/10 flex items-center space-x-3"
                  >
                    <Settings className="w-5 h-5" />
                    <span>{t('Профиль')}</span>
                  </Link>
                  <Link 
                    to="/inventory" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-purple-500/10 flex items-center space-x-3"
                  >
                    <Package className="w-5 h-5" />
                    <span>Инвентарь</span>
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200 font-bold text-base px-3 py-2 rounded-lg hover:bg-red-500/10 flex items-center space-x-3 w-full text-left"
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
