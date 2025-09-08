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
    <footer className="bg-black/95 backdrop-blur-xl border-t border-cyan-500/30 relative overflow-hidden shadow-2xl shadow-cyan-500/20">
      {/* Анимированные световые эффекты */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-cyan-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 group">
              {/* Премиальная иконка с буквой V */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative transform group-hover:scale-110 transition-all duration-500">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xl rounded-lg sm:rounded-xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 group-hover:shadow-cyan-500/50 border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-500">
                  <div className="relative">
                    {/* Основная буква V */}
                    <div className="text-cyan-400 font-bold text-lg sm:text-xl tracking-wider drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,1)] transition-all duration-500">
                      V
                    </div>
                    {/* Свечение - cyan */}
                    <div className="absolute inset-0 text-cyan-300 font-bold text-lg sm:text-xl tracking-wider blur-[1px] opacity-70 group-hover:opacity-100 transition-all duration-500">
                      V
                    </div>
                    {/* Свечение - blue */}
                    <div className="absolute inset-0 text-blue-400 font-bold text-lg sm:text-xl tracking-wider blur-[2px] opacity-50 -bottom-0.5 group-hover:opacity-80 transition-all duration-500">
                      V
                    </div>
                  </div>
                </div>
                {/* Анимированное свечение вокруг */}
                <div className="absolute -inset-1 sm:-inset-2 bg-cyan-500/20 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700 animate-pulse"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-400 transition-all duration-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                Vaultory
              </span>
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base hover:text-gray-300 transition-colors duration-300">
              {t('Лучший игровой маркетплейс для покупки игровых товаров, открытия кейсов и пополнения баланса. Безопасные транзакции и мгновенная доставка.')}
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a 
                href="https://t.me/Vaultory_manager" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all duration-300 hover:scale-110 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 border border-cyan-500/30 hover:border-cyan-400/50"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.48.33-.913.49-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.164.174.213.409.227.575-.001.187-.033.401-.096.614z"/>
                </svg>
              </a>
              <button 
                onClick={openGmail}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all duration-300 hover:scale-110 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 border border-purple-500/30 hover:border-purple-400/50"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 hover:text-cyan-400 transition-colors duration-300">
              {t('Быстрые ссылки')}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link 
                  to="/catalog" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Каталог товаров')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/cases" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Игровые кейсы')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('О нас')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Поддержка')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 hover:text-cyan-400 transition-colors duration-300">
              {t('Поддержка')}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Условия использования')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Политика конфиденциальности')}
                </Link>
              </li>
              <li>
                <a 
                  href="https://t.me/Vaultory_manager" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Telegram поддержка')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="border-t border-cyan-500/20 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center relative">
          {/* Анимированная линия */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <p className="text-gray-500 text-xs sm:text-sm hover:text-gray-400 transition-colors duration-300">
            © 2025 Vaultory. {t('Все права защищены.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
