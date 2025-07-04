import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Send, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

const TG_BOT = 'vaultory_notify_bot';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [tgUser, setTgUser] = useState<TelegramUser | null>(() => {
    const raw = localStorage.getItem('tgUser');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    // Функция для обработки данных из Telegram Widget
    (window as any).onTelegramAuth = (user: TelegramUser) => {
      setTgUser(user);
      localStorage.setItem('tgUser', JSON.stringify(user));
    };
  }, []);

  const handleLogout = () => {
    setTgUser(null);
    localStorage.removeItem('tgUser');
  };

  const isActive = (path: string) => location.pathname === path;

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
              href="https://t.me/vaultory"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Send className="w-5 h-5" />
            </a>

            {/* Корзина */}
            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-red-400 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-xs rounded-full flex items-center justify-center text-white">
                0
              </span>
            </Link>

            {/* Профиль или Telegram Login */}
            {tgUser ? (
              <div className="flex items-center space-x-2">
                {tgUser.photo_url && (
                  <img src={tgUser.photo_url} alt="avatar" className="w-8 h-8 rounded-full border-2 border-purple-500" />
                )}
                <span className="text-white font-semibold">{tgUser.first_name}</span>
                <Button onClick={handleLogout} size="icon" className="bg-gray-800 hover:bg-red-600 ml-2">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div>
                <div id="telegram-login-widget"></div>
                <Button
                  className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none"
                  onClick={() => {
                    if (!document.getElementById('telegram-login-script')) {
                      const script = document.createElement('script');
                      script.id = 'telegram-login-script';
                      script.src = `https://telegram.org/js/telegram-widget.js?7`;
                      script.setAttribute('data-telegram-login', TG_BOT);
                      script.setAttribute('data-size', 'large');
                      script.setAttribute('data-userpic', 'true');
                      script.setAttribute('data-radius', '8');
                      script.setAttribute('data-request-access', 'write');
                      script.setAttribute('data-userpic', 'true');
                      script.setAttribute('data-lang', 'ru');
                      script.setAttribute('data-auth-url', window.location.origin + '/tg-auth');
                      script.setAttribute('data-callback', 'onTelegramAuth');
                      document.getElementById('telegram-login-widget')?.appendChild(script);
                    }
                  }}
                >
                  Войти через Telegram
                </Button>
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
