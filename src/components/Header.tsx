
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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

            {/* Профиль */}
            <Link to="/profile" className="p-2 text-gray-400 hover:text-red-400 transition-colors">
              <User className="w-5 h-5" />
            </Link>

            {/* Кнопка входа */}
            <Button className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none">
              Войти через Telegram
            </Button>

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
