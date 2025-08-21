import { Link } from 'react-router-dom';
import { Send, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-red-500 via-purple-600 to-pink-500 text-white py-8 shadow-lg animate-fade-in flex-shrink-0">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          {/* Новая 3D буква V с неоновым свечением */}
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 bg-black rounded-lg flex items-center justify-center">
              <div className="relative">
                {/* Основная буква V */}
                <div className="text-white font-bold text-lg tracking-wider transform rotate-12 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
                  V
                </div>
                {/* Неоновое свечение - синий верх */}
                <div className="absolute inset-0 text-blue-400 font-bold text-lg tracking-wider transform rotate-12 blur-[1px] opacity-70">
                  V
                </div>
                {/* Неоновое свечение - фиолетовый низ */}
                <div className="absolute inset-0 text-purple-500 font-bold text-lg tracking-wider transform rotate-12 blur-[2px] opacity-50 -bottom-0.5">
                  V
                </div>
              </div>
            </div>
          </div>
          <span className="text-2xl font-bold">Vaultory</span>
        </div>
        <div className="flex space-x-6">
          <Link to="/about" className="hover:underline text-lg font-semibold transition-colors duration-200">О нас</Link>
          <Link to="/support" className="hover:underline text-lg font-semibold transition-colors duration-200">Поддержка</Link>
          <a href="https://t.me/Vaultory_manager" target="_blank" rel="noopener noreferrer" className="hover:underline text-lg font-semibold transition-colors duration-200">Telegram</a>
        </div>
        <div className="text-sm mt-4 md:mt-0">© 2024 Vaultory. Все права защищены.</div>
      </div>
    </footer>
  );
};

export default Footer;
