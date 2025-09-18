import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ChevronDown, Crown, Sparkles, Zap, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/ui/Notification';
import { useTranslations } from '@/hooks/useTranslations';
import TelegramStats from '@/components/TelegramStats';

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        {/* Плавающие частицы */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1000 opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-2000 opacity-50"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-3000 opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping delay-4000 opacity-40"></div>
        
        {/* Светящиеся линии */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-pulse delay-1000"></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-pink-500/20 to-transparent animate-pulse delay-2000"></div>
      </div>
      {/* Telegram канал - современное окно с анимированным фоном */}

      {/* Категории игр с контрастным фоном */}
      <section className="py-16 px-4 relative overflow-hidden bg-black">
        {/* Контрастный анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-500/10 rounded-full animate-spin" style={{animationDuration: '40s'}}></div>
          
          {/* Дополнительные светящиеся элементы */}
          <div className="absolute top-1/3 right-1/5 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-1/3 left-1/5 w-48 h-48 bg-yellow-500/5 rounded-full blur-2xl animate-pulse delay-3000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          {/* Hero секция */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Crown className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 animate-spin-slow" />
                <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-2 border-yellow-400/30 rounded-full animate-ping"></div>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent px-2">
              {t('Популярные игры')}
            </h2>
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-24"></div>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-24"></div>
            </div>
          </div>
          
          {/* Фильтры категорий */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`group relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500 text-black shadow-2xl shadow-cyan-500/25 border-2 border-cyan-400'
                  : 'bg-gray-800/50 backdrop-blur-sm text-white hover:bg-gray-700/50 border border-gray-600/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
              }`}
            >
              <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedCategory === 'all' ? 'text-black' : 'text-cyan-400 group-hover:animate-pulse'}`} />
              <span>{t('Все игры')}</span>
              {selectedCategory === 'all' && (
                <div className="absolute inset-0 bg-cyan-400/20 rounded-xl sm:rounded-2xl animate-pulse"></div>
              )}
            </button>
            {gameCategories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`group relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base animate-fade-in ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white shadow-2xl shadow-purple-500/25 border-2 border-purple-400'
                    : 'bg-gray-800/50 backdrop-blur-sm text-white hover:bg-gray-700/50 border border-gray-600/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10'
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <span className="text-sm sm:text-lg group-hover:scale-110 transition-transform duration-300">{getCategoryIcon(category.name)}</span>
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <div className="absolute inset-0 bg-purple-400/20 rounded-xl sm:rounded-2xl animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Товары по играм */}
          <div className="space-y-16 sm:space-y-20">
            {Object.entries(groupedProducts).map(([gameName, gameProducts], gameIndex) => (
              <div key={gameName} className="animate-fade-in" style={{animationDelay: `${gameIndex * 0.2}s`}}>
                {/* Заголовок игры */}
                <div className="mb-8 sm:mb-12 relative">
                  <div className="flex items-center justify-center md:justify-start mb-6 sm:mb-8">
                    <div className="relative group">
                      <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 absolute -left-8 sm:-left-10 top-1/2 transform -translate-y-1/2 animate-pulse" />
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-wide text-center md:text-left px-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {gameName.toUpperCase()}
                      </h3>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-pink-400/10 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    </div>
                  </div>
                  {/* Декоративная линия */}
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="h-1 bg-gradient-to-r from-cyan-500 to-transparent w-16 sm:w-24 rounded-full"></div>
                    <div className="h-px bg-gradient-to-r from-purple-500/50 to-pink-500/50 w-20 sm:w-32 ml-4 rounded-full"></div>
                    <div className="h-1 bg-gradient-to-l from-pink-500 to-transparent w-16 sm:w-24 ml-4 rounded-full"></div>
                  </div>
                </div>
                
                {/* Товары этой игры */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                  {gameProducts.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="animate-fade-in group"
                      style={{animationDelay: `${(gameIndex * 5 + index) * 0.1}s`}}
                    >
                      <div className="relative">
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
                        {/* Светящийся эффект вокруг карточки */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ с новым дизайном */}
      <section className="py-16 px-4 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 animate-spin-slow" />
                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-2 border-yellow-400/30 rounded-full animate-ping"></div>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('Частые вопросы')}
            </h2>
            <div className="flex justify-center items-center space-x-4">
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-24"></div>
              <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
              <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-24"></div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="space-y-6">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-600/30 px-6 sm:px-8 animate-fade-in hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <AccordionTrigger className="text-lg sm:text-xl font-bold text-white hover:text-cyan-400 transition-colors py-6 sm:py-8 hover:no-underline group-hover:scale-[1.02]">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-cyan-500 mr-4 group-hover:animate-pulse" />
                    {item.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-6 sm:pb-8 text-base sm:text-lg leading-relaxed animate-fade-in">
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
