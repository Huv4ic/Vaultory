import { Link } from 'react-router-dom';
import { Send, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                Vaultory
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Ведущая платформа для покупки игровых товаров. Безопасные покупки, 
              мгновенная доставка, лучшие цены на рынке.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://t.me/vaultorysell"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg text-blue-400 hover:bg-gray-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <div className="space-y-2">
              <Link to="/catalog" className="block text-gray-400 hover:text-red-400 transition-colors">
                Каталог
              </Link>
              <Link to="/cases" className="block text-gray-400 hover:text-red-400 transition-colors">
                Кейсы
              </Link>
              <Link to="/support" className="block text-gray-400 hover:text-red-400 transition-colors">
                Поддержка
              </Link>
              <Link to="/about" className="block text-gray-400 hover:text-red-400 transition-colors">
                О нас
              </Link>
            </div>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@vaultory.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+7 (999) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Send className="w-4 h-4" />
                <span>@Vaultory_manager</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Vaultory. Все права защищены.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-red-400 text-sm transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-red-400 text-sm transition-colors">
              Пользовательское соглашение
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
