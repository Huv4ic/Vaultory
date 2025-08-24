import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const { t } = useLanguage();

  // Функция для открытия Gmail
  const openGmail = () => {
    const subject = encodeURIComponent('Вопрос в поддержку Vaultory');
    const body = encodeURIComponent('Здравствуйте! У меня есть вопрос:\n\n');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=vaultorypoderjka@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <footer className="bg-gradient-to-r from-black via-gray-900 to-black border-t border-amber-500/30 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-amber-500/5 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-emerald-500/5 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 group">
              {/* Новая 3D буква V с неоновым свечением */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative transform group-hover:scale-110 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-2xl shadow-amber-500/50 group-hover:shadow-amber-500/70 transition-all duration-500">
                  <div className="relative">
                    {/* Основная буква V */}
                    <div className="text-black font-bold text-lg sm:text-xl tracking-wider transform rotate-12 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] group-hover:drop-shadow-[0_0_12px_rgba(255,215,0,1)] transition-all duration-500">
                      V
                    </div>
                    {/* Неоновое свечение - золотой верх */}
                    <div className="absolute inset-0 text-amber-300 font-bold text-lg sm:text-xl tracking-wider transform rotate-12 blur-[1px] opacity-70 group-hover:opacity-100 transition-all duration-500">
                      V
                    </div>
                    {/* Неоновое свечение - изумрудный низ */}
                    <div className="absolute inset-0 text-emerald-400 font-bold text-lg sm:text-xl tracking-wider transform rotate-12 blur-[2px] opacity-50 -bottom-0.5 group-hover:opacity-80 transition-all duration-500">
                      V
                    </div>
                  </div>
                </div>
                {/* Анимированное свечение вокруг */}
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-purple-600 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 animate-pulse"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-amber-400 group-hover:text-amber-300 transition-all duration-500">
                Vaultory
              </span>
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base">
              {t('Лучший игровой маркетплейс для покупки игровых товаров, открытия кейсов и пополнения баланса. Безопасные транзакции и мгновенная доставка.')}
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a 
                href="https://t.me/Vaultory_manager" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full flex items-center justify-center text-white hover:from-amber-600 hover:to-emerald-600 transition-all duration-300 hover:scale-110 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.48.33-.913.49-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.164.174.213.409.227.575-.001.187-.033.401-.096.614z"/>
                </svg>
              </a>
              <button 
                onClick={openGmail}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full flex items-center justify-center text-white hover:from-emerald-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
              {t('Быстрые ссылки')}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link 
                  to="/catalog" 
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Каталог товаров')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/cases" 
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Игровые кейсы')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('О нас')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Поддержка')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
              {t('Поддержка')}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Условия использования')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Политика конфиденциальности')}
                </Link>
              </li>
              <li>
                <a 
                  href="https://t.me/Vaultory_manager" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Telegram поддержка')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="border-t border-amber-500/20 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2025 Vaultory. {t('Все права защищены.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
