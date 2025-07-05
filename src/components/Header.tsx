import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

const TELEGRAM_BOT = 'vaultory_notify_bot';

declare global {
  interface Window {
    TelegramLoginWidget: any;
    onTelegramAuth: (user: any) => void;
  }
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const {
    telegramUser,
    balance,
    signInWithTelegram,
    signOutTelegram
  } = useAuth();
  const { items: cartItems } = useCart();
  const [showTelegramWidget, setShowTelegramWidget] = useState(false);
  const widgetRef = useRef(null);

  const isActive = (path: string) => location.pathname === path;

  // Telegram Login Widget встроенный
  const handleTelegramAuth = useCallback(() => {
    setShowTelegramWidget(true);
    setTimeout(() => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?7';
        script.async = true;
        script.setAttribute('data-telegram-login', TELEGRAM_BOT);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-userpic', 'true');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
        widgetRef.current.appendChild(script);
      }
    }, 0);
  }, []);

  // Callback для Telegram Login Widget
  useEffect(() => {
    window.TelegramLoginWidget = {
      dataOnauth: (user) => {
        signInWithTelegram(user);
        setShowTelegramWidget(false);
      }
    };
  }, [signInWithTelegram]);

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-red-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
              Vaultory
            </span>
          </Link>

          {/* Навигация десктоп */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/catalog"
              className={`transition-colors hover:text-red-400 ${
                isActive('/catalog') ? 'text-red-500' : 'text-gray-300'
              }`}
            >
              Каталог
            </Link>
            <Link
              to="/cases"
              className={`transition-colors hover:text-red-400 ${
                isActive('/cases') ? 'text-red-500' : 'text-gray-300'
              }`}
            >
              Кейсы
            </Link>
            <Link
              to="/support"
              className={`transition-colors hover:text-red-400 ${
                isActive('/support') ? 'text-red-500' : 'text-gray-300'
              }`}
            >
              Поддержка
            </Link>
            <Link
              to="/about"
              className={`transition-colors hover:text-red-400 ${
                isActive('/about') ? 'text-red-500' : 'text-gray-300'
              }`}
            >
              О нас
            </Link>
          </nav>

          {/* Действия */}
          <div className="flex items-center space-x-4">
            {/* Телеграм */}
            <a
              href="https://t.me/vaultorysell"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-md border border-blue-400/60 transition-all duration-200 hover:from-blue-600 hover:to-purple-700"
            >
              <Send className="w-5 h-5" />
            </a>

            {/* Корзина */}
            <Link to="/cart" className="relative p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-md border border-red-400/60 transition-all duration-200 hover:from-red-600 hover:to-pink-600">
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-red-500 text-xs rounded-full flex items-center justify-center font-bold border border-red-400">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Профиль */}
            <Link to="/profile" className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-md border border-purple-400/60 transition-all duration-200 hover:from-purple-600 hover:to-indigo-700">
              <User className="w-5 h-5" />
            </Link>

            {/* Telegram Auth/Avatar+Balance */}
            {!telegramUser ? (
              <>
                <Button
                  className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none"
                  onClick={handleTelegramAuth}
                >
                  Войти через Telegram
                </Button>
                {showTelegramWidget && (
                  <div className="absolute z-50 top-20 right-4 bg-gray-900 p-4 rounded-xl shadow-xl border border-gray-700">
                    <div ref={widgetRef}></div>
                    <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => setShowTelegramWidget(false)}>Отмена</Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {telegramUser.photo_url && (
                  <img
                    src={telegramUser.photo_url}
                    alt={telegramUser.username || telegramUser.first_name}
                    className="w-9 h-9 rounded-full border-2 border-purple-500 shadow"
                  />
                )}
                <span className="font-semibold text-white">{telegramUser.username || telegramUser.first_name}</span>
                <span className="bg-gradient-to-r from-green-400 to-green-600 px-3 py-1 rounded-lg text-white font-bold shadow-md border border-green-500/60 transition-all duration-200 hover:from-green-500 hover:to-green-700">
                  Баланс: {balance}₽
                </span>
                <Button size="sm" variant="outline" onClick={signOutTelegram}>Выйти</Button>
              </div>
            )}

            {/* Мобильное меню */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Мобильная навигация */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/catalog"
                className="text-gray-300 hover:text-red-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Каталог
              </Link>
              <Link
                to="/cases"
                className="text-gray-300 hover:text-red-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Кейсы
              </Link>
              <Link
                to="/support"
                className="text-gray-300 hover:text-red-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Поддержка
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-red-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                О нас
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
