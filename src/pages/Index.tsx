import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/ui/Notification';
import { useTranslations } from '@/hooks/useTranslations';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { telegramUser } = useAuth();
  const { t } = useLanguage();
  const { products, categories, loading, error } = useProducts();
  const { items, addItem } = useCart();
  const { showError, notification, hideNotification } = useNotification();
  const { getCategoryTranslation } = useTranslations();

  // Убираем автоматическое обновление профиля - баланс не должен обновляться просто при просмотре страницы
  // useEffect(() => {
  //   if (telegramUser) {
  //     refreshTelegramProfile();
  //   }
  // }, [telegramUser, refreshTelegramProfile]);

  // Функция для получения эмодзи иконки по названию
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'currency': '💰',
      'accounts': '👤',
      'keys': '🔑',
      'subscriptions': '📱',
      'skins': '🎨',
      'weapons': '🔫',
      'characters': '👤',
      'vehicles': '🚗',
      'default': '📦'
    };
    
    // Проверяем точное совпадение
    if (iconMap[categoryName.toLowerCase()]) {
      return iconMap[categoryName.toLowerCase()];
    }
    
    // Проверяем частичное совпадение
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('аккаунт') || lowerName.includes('account')) return '👤';
    if (lowerName.includes('валюта') || lowerName.includes('currency')) return '💰';
    if (lowerName.includes('ключ') || lowerName.includes('key')) return '🔑';
    if (lowerName.includes('подписк') || lowerName.includes('subscription')) return '📱';
    if (lowerName.includes('скин') || lowerName.includes('skin')) return '🎨';
    
    return iconMap['default'];
  };

  // Создаем gameCategories из данных БД с переводами
  const gameCategories = categories.map(cat => ({
    id: cat.id,
    name: getCategoryTranslation(cat.id, cat.name),
    image: cat.image
  }));

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => {
        const productCategory = categories.find(cat => cat.id === product.category_id);
        return productCategory && productCategory.id === selectedCategory;
      });

  // Группируем товары по играм - показываем все сразу
  const groupedProducts = filteredProducts.reduce((groups, product) => {
    const game = product.game || 'Товары'; // Если нет игры, относим к "Товары"
    if (!groups[game]) {
      groups[game] = [];
    }
    groups[game].push(product);
    return groups;
  }, {} as Record<string, Product[]>);

  const faqItems = [
    { 
      question: t('Как быстро приходят товары?'), 
      answer: 'Товары после оплаты выдаются вручную, поэтому время на выдачу товара может варьироваться от 5 минут до пары часов.' 
    },
    { 
      question: t('Какие способы оплаты доступны?'), 
      answer: 'Доступны оплаты через Monobank, PrivatBank, PUMB, а также криптовалютой (USDT TRC20/ERC20, Litecoin)' 
    },
    { 
      question: t('Безопасно ли покупать у вас?'), 
      answer: 'Да, мы работаем с 2025 года и имеем уже большое количество реальных отзывов. Все платежи проходят через защищенные каналы.' 
    },
    { 
      question: t('Что делать если товар не пришел?'), 
      answer: t('Обратитесь в нашу поддержку через Telegram или Email с номером заказа. Мы решим проблему в течение часа или вернем деньги.') 
    }
  ];

  const handleProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    if (!telegramUser) {
              showError(t('Войдите через Telegram, чтобы добавить в корзину!'));
      return;
    }
    addItem(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-xl">{t('Загрузка товаров...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-500">{t('Ошибка загрузки')}</h1>
          <p className="text-xl mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-red-500 to-purple-600">
            {t('Попробовать снова')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Telegram канал - современное окно с анимированным фоном */}
      <section className="relative py-12 sm:py-16 md:py-24 px-4 overflow-hidden">
        {/* Анимированный фон как на главной странице */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] border border-red-500/20 rounded-full animate-spin" style={{animationDuration: '30s'}}></div>
        </div>
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            {/* Основное окно */}
            <div className="relative group">
              {/* Главная карточка */}
              <div className="bg-gradient-to-br from-gray-900/95 via-slate-900/95 to-black/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-gray-700/50 shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
                {/* Световые эффекты */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl sm:rounded-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl sm:rounded-t-3xl"></div>
                
                <div className="relative z-10">
                  {/* Заголовок */}
                  <div className="text-center mb-6 sm:mb-8 md:mb-10">
                    <div className="inline-flex items-center space-x-2 mb-3 sm:mb-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full animate-pulse delay-200"></div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight px-2">
                      ПРИСОЕДИНЯЙСЯ К СООБЩЕСТВУ
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium px-2">
                      Эксклюзивные предложения, розыгрыши и первыми узнавай о новинках
                    </p>
                  </div>

                  {/* Статистика канала */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
                    <div className="group/stat relative">
                      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-400 mb-1 sm:mb-2 group-hover/stat:scale-110 transition-transform duration-300">3,101</div>
                          <div className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">подписчиков</div>
                        </div>
                      </div>
                    </div>
                    <div className="group/stat relative">
                      <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-pink-500/20 hover:border-pink-400/40 transition-all duration-300 hover:scale-105">
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-pink-400 mb-1 sm:mb-2 group-hover/stat:scale-110 transition-transform duration-300">24/7</div>
                          <div className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">поддержка</div>
                        </div>
                      </div>
                    </div>
                    <div className="group/stat relative">
                      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-400 mb-1 sm:mb-2 group-hover/stat:scale-110 transition-transform duration-300">100%</div>
                          <div className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">гарантия</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Кнопка перехода */}
                  <div className="text-center mb-6 sm:mb-8">
                    <a
                      href="https://t.me/vaultorysell"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center space-x-2 sm:space-x-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 transform relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      <span className="text-sm sm:text-base md:text-lg relative z-10">Перейти в Telegram</span>
                    </a>
                  </div>

                  {/* Дополнительная информация */}
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 mb-4 sm:mb-6">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                      <span className="text-yellow-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">Эксклюзивные скидки только для подписчиков</span>
                      <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                        <span>Проверенные товары</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                        <span>Мгновенная доставка</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                        <span>Гарантия качества</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Категории игр с контрастным фоном */}
      <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900">
        {/* Контрастный анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-red-500/15 rounded-full animate-spin" style={{animationDuration: '40s'}}></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12 text-white animate-fade-in px-2">
            {t('Популярные игры')}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base ${
                selectedCategory === 'all'
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 hover:border-white/30'
              }`}
            >
              <span className="text-sm sm:text-lg">🎮</span>
              <span>{t('Все игры')}</span>
            </button>
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base ${
                  selectedCategory === category.id
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20 hover:border-white/30'
                }`}
              >
                <span className="text-sm sm:text-lg">{getCategoryIcon(category.name)}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Товары по играм */}
          <div className="space-y-12">
            {Object.entries(groupedProducts).map(([gameName, gameProducts], gameIndex) => (
              <div key={gameName} className="animate-fade-in" style={{animationDelay: `${gameIndex * 0.2}s`}}>
                {/* Заголовок игры */}
                <div className="mb-6 sm:mb-8 relative">
                  <div className="flex items-center justify-center md:justify-start mb-3 sm:mb-4">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wide text-center md:text-left px-2">
                      {gameName.toUpperCase()}
                    </h3>
                  </div>
                  {/* Декоративная линия */}
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="h-px bg-white/30 w-12 sm:w-16"></div>
                    <div className="h-px bg-white/10 w-16 sm:w-24 ml-2"></div>
                  </div>
                </div>
                
                {/* Товары этой игры */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {gameProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="animate-fade-in"
                      style={{animationDelay: `${(gameIndex * 5 + index) * 0.1}s`}}
                    >
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        original_price={product.original_price}
                        images={product.images}
                        image_url={product.image_url}
                        category_id={product.category_id}
                        game={product.game}
                        rating={product.rating}
                        sales={product.sales}
                        description={product.description}
                        isInCart={items.some((item) => item.id === product.id)}
                        onAddToCart={() => handleAddToCart(product)}
                        onDetails={() => handleProductDetails(product.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ с новым дизайном */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-800/30 to-gray-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-purple-900/10"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-red-400 via-purple-400 to-slate-300 bg-clip-text text-transparent animate-fade-in">
            {t('Частые вопросы')}
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-red-500/20 px-6 animate-fade-in hover:border-red-500/40 transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <AccordionTrigger className="text-lg font-semibold text-white hover:text-red-400 transition-colors py-6 hover:no-underline">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-red-500 mr-3" />
                    {item.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-6 animate-fade-in">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      
      {/* Красивые уведомления */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        autoHide={notification.autoHide}
        duration={notification.duration}
      />
    </div>
  );
};

export default Index;
