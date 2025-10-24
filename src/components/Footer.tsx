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
    <footer className="bg-[#0e0e0e] border-t border-[#1c1c1c] relative">

      <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 group">
              {/* Иконка с буквой V */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative transform group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-[#181818] rounded-lg sm:rounded-xl flex items-center justify-center border border-[#1c1c1c] group-hover:border-[#a31212] transition-all duration-300">
                  <div className="text-[#a31212] font-bold text-lg sm:text-xl tracking-wider">
                    V
                  </div>
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-[#f0f0f0] group-hover:text-[#a31212] transition-all duration-300">
                Vaultory
              </span>
            </div>
            <p className="text-[#a0a0a0] mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base hover:text-[#f0f0f0] transition-colors duration-300">
              {t('Лучший игровой маркетплейс для покупки игровых товаров, открытия кейсов и пополнения баланса. Безопасные транзакции и мгновенная доставка.')}
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a 
                href="https://t.me/Vaultory_manager" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-[#181818] rounded-full flex items-center justify-center text-[#f0f0f0] hover:bg-[#1c1c1c] transition-all duration-300 hover:scale-105 border border-[#1c1c1c] hover:border-[#a31212]"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.48.33-.913.49-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.164.174.213.409.227.575-.001.187-.033.401-.096.614z"/>
                </svg>
              </a>
              <button 
                onClick={openGmail}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-[#181818] rounded-full flex items-center justify-center text-[#f0f0f0] hover:bg-[#1c1c1c] transition-all duration-300 hover:scale-105 border border-[#1c1c1c] hover:border-[#a31212]"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#f0f0f0] mb-3 sm:mb-4 hover:text-[#a31212] transition-colors duration-300">
              {t('Быстрые ссылки')}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link 
                  to="/catalog" 
                  className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Каталог товаров')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/cases" 
                  className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Игровые кейсы')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('О нас')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Поддержка')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#f0f0f0] mb-3 sm:mb-4 hover:text-[#a31212] transition-colors duration-300">
              {t('Поддержка')}
            </h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link 
                  to="/terms" 
                  className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Условия использования')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Политика конфиденциальности')}
                </Link>
              </li>
              <li>
                <a 
                  href="https://t.me/Vaultory_manager" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors duration-300 hover:translate-x-1 transform inline-block text-sm sm:text-base"
                >
                  {t('Telegram поддержка')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="border-t border-[#1c1c1c] mt-6 sm:mt-8 pt-6 sm:pt-8 text-center relative">
          <p className="text-[#a0a0a0] text-xs sm:text-sm hover:text-[#f0f0f0] transition-colors duration-300">
            © 2025 Vaultory. {t('Все права защищены.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
