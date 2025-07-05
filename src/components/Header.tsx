import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const TELEGRAM_BOT = 'vaultory_notify_bot';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { telegramUser, balance, signOutTelegram, setTelegramUser } = useAuth();
  const tgWidgetRef = useRef(null);

  const isActive = (path: string) => location.pathname === path;

  // Автоматическая обработка Telegram Login Widget
  useEffect(() => {
    function handleTgAuth(e) {
      setTelegramUser(e.detail);
    }
    window.addEventListener('tg-auth', handleTgAuth);
    return () => window.removeEventListener('tg-auth', handleTgAuth);
  }, [setTelegramUser]);

  // Вставка Telegram Login Widget
  useEffect(() => {
    if (telegramUser) return; // Не показывать виджет, если уже авторизован
    if (tgWidgetRef.current) {
      tgWidgetRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?7';
      script.setAttribute('data-telegram-login', TELEGRAM_BOT);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-userpic', 'true');
      script.setAttribute('data-radius', '10');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.async = true;
      tgWidgetRef.current.appendChild(script);
    }
    // Глобальный обработчик для Telegram
    (window as any).onTelegramAuth = function(user: any) {
      window.dispatchEvent(new CustomEvent('tg-auth', { detail: user }));
    };
  }, [telegramUser]);

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
              href="https://t.me/Vaultory_manager"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold shadow-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-200"
            >
              Telegram
            </a>

            {/* Корзина */}
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-red-400 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-xs rounded-full flex items-center justify-center text-white">
                0
              </span>
            </Link>

            {/* Telegram Login Widget или профиль */}
            {!telegramUser ? (
              <div ref={tgWidgetRef} />
            ) : (
              <>
                {/* Профиль: аватар, ник, баланс, кнопка выйти */}
                <Link to="/profile" className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-800 transition-all">
                  {telegramUser.photo_url ? (
                    <img
                      src={telegramUser.photo_url}
                      alt={telegramUser.username || telegramUser.first_name}
                      className="w-8 h-8 rounded-full border-2 border-purple-500"
                    />
                  ) : (
                    <User className="w-7 h-7 text-gray-300" />
                  )}
                  <span className="text-white font-semibold text-sm">{telegramUser.username ? `@${telegramUser.username}` : telegramUser.first_name}</span>
                  <span className="ml-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-4 py-1 rounded-lg shadow border border-green-500 text-base flex items-center gap-1">
                    Баланс&nbsp;{balance}₽
                  </span>
                </Link>
                <Button
                  size="sm"
                  className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold border-none shadow hover:from-red-600 hover:to-purple-700 transition-all duration-200"
                  onClick={signOutTelegram}
                >
                  Выйти
                </Button>
              </>
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
