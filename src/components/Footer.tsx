import { Link } from 'react-router-dom';
import { Send, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-red-500 via-purple-600 to-pink-500 text-white py-8 shadow-lg animate-fade-in flex-shrink-0">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-2xl font-bold mb-4 md:mb-0">Vaultory</div>
        <div className="flex space-x-6">
          <a href="/about" className="hover:underline text-lg font-semibold transition-colors duration-200">О нас</a>
          <a href="/support" className="hover:underline text-lg font-semibold transition-colors duration-200">Поддержка</a>
          <a href="https://t.me/Vaultory_manager" target="_blank" rel="noopener noreferrer" className="hover:underline text-lg font-semibold transition-colors duration-200">Telegram</a>
        </div>
        <div className="text-sm mt-4 md:mt-0">© 2024 Vaultory. Все права защищены.</div>
      </div>
    </footer>
  );
};

export default Footer;
