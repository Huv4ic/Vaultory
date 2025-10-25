import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, ChevronDown, Crown, Sparkles, Zap, Star, Search, Target } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
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

  // Фильтрация и поиск товаров
  let filteredProducts = products;

  // Фильтр по категории
  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(product => {
      const productCategory = categories.find(cat => cat.id === product.category_id);
      return productCategory && productCategory.id === selectedCategory;
    });
  }

  // Поиск по названию
  if (searchQuery.trim()) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Сортировка
  switch (sortBy) {
    case 'price_asc':
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filteredProducts = filteredProducts.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      break;
    case 'popular':
    default:
      // Сортировка по рейтингу (если есть) или по популярности
      filteredProducts = filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
  }

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

  const handleBuyNow = (product) => {
    if (!telegramUser) {
      showError(t('Войдите через Telegram для покупки!'));
      return;
    }
    // Добавляем товар в корзину
    addItem(product);
    // Сразу переходим в корзину
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#a31212] mx-auto"></div>
          <p className="mt-4 text-xl">{t('Загрузка товаров...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#a31212]">{t('Ошибка загрузки')}</h1>
          <p className="text-xl mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#a31212] hover:bg-[#8a0f0f]">
            {t('Попробовать снова')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f0f0f0] relative">
      {/* Telegram канал - современное окно с анимированным фоном */}


      {/* Категории игр */}
      <section id="products" className="py-16 px-4 relative bg-[#0e0e0e]">
        
        <div className="container mx-auto relative z-10">
          {/* Hero секция */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Crown className="w-16 h-16 sm:w-20 sm:h-20 text-[#a31212]" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center mb-6 text-[#f0f0f0] px-2">
              {t('Популярные игры')}
            </h2>
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="h-px bg-[#1c1c1c] w-24"></div>
              <Sparkles className="w-6 h-6 text-[#a31212]" />
              <div className="h-px bg-[#1c1c1c] w-24"></div>
            </div>
          </div>
          
          {/* Поиск и фильтры */}
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="space-y-6">
              {/* Поиск */}
              <div className="group relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#a31212]" />
                  <Input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#181818] border border-[#1c1c1c] text-[#f0f0f0] placeholder-[#a0a0a0] rounded-2xl focus:border-[#a31212] focus:ring-2 focus:ring-[#a31212]/20 transition-all duration-300 text-lg hover:border-[#a31212]/50"
                  />
                </div>
              </div>

              {/* Фильтры */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Категории */}
                <div className="group relative">
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-4 bg-[#181818] border border-[#1c1c1c] text-[#f0f0f0] rounded-2xl focus:border-[#a31212] focus:ring-2 focus:ring-[#a31212]/20 transition-all duration-300 text-lg hover:border-[#a31212]/50"
                    >
                      <option value="all">Все категории</option>
                      {gameCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Сортировка */}
                <div className="group relative">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-4 bg-[#181818] border border-[#1c1c1c] text-[#f0f0f0] rounded-2xl focus:border-[#a31212] focus:ring-2 focus:ring-[#a31212]/20 transition-all duration-300 text-lg hover:border-[#a31212]/50"
                    >
                      <option value="popular">По популярности</option>
                      <option value="price_asc">По цене (возрастание)</option>
                      <option value="price_desc">По цене (убывание)</option>
                      <option value="newest">По дате</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Результаты поиска */}
          {searchQuery.trim() && (
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#181818] rounded-2xl border border-[#1c1c1c]">
                <Target className="w-5 h-5 text-[#a31212]" />
                <p className="text-[#f0f0f0] text-lg">
                  Найдено товаров: <span className="text-[#f0f0f0] font-black text-xl">{filteredProducts.length}</span>
                </p>
              </div>
            </div>
          )}


          {/* Товары по играм */}
          <div className="space-y-16 sm:space-y-20">
            {Object.entries(groupedProducts).map(([gameName, gameProducts], gameIndex) => (
              <div key={gameName} className="animate-fade-in" style={{animationDelay: `${gameIndex * 0.2}s`}}>
                {/* Заголовок игры */}
                <div className="mb-8 sm:mb-12 relative">
                  <div className="flex items-center justify-center md:justify-start mb-6 sm:mb-8">
                    <div className="relative group">
                      <Star className="w-6 h-6 sm:w-8 sm:h-8 text-[#a31212] absolute -left-8 sm:-left-10 top-1/2 transform -translate-y-1/2" />
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#f0f0f0] tracking-wide text-center md:text-left px-2">
                        {gameName.toUpperCase()}
                      </h3>
                    </div>
                  </div>
                  {/* Декоративная линия */}
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="h-1 bg-[#a31212] w-16 sm:w-24 rounded-full"></div>
                    <div className="h-px bg-[#1c1c1c] w-20 sm:w-32 ml-4 rounded-full"></div>
                    <div className="h-1 bg-[#a31212] w-16 sm:w-24 ml-4 rounded-full"></div>
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
                          description={product.description}
                          isInCart={items.some((item) => item.id === product.id)}
                          onAddToCart={() => handleAddToCart(product)}
                          onDetails={() => handleProductDetails(product.id)}
                          onBuyNow={() => handleBuyNow(product)}
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
      <section className="py-16 px-4 bg-transparent relative">
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-[#a31212]" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-6 text-[#f0f0f0]">
              {t('Частые вопросы')}
            </h2>
            <div className="flex justify-center items-center space-x-4">
              <div className="h-px bg-[#1c1c1c] w-24"></div>
              <Star className="w-6 h-6 text-[#a31212]" />
              <div className="h-px bg-[#1c1c1c] w-24"></div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="space-y-6">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="group bg-[#181818] rounded-2xl border border-[#1c1c1c] px-6 sm:px-8 hover:border-[#a31212] transition-all duration-300"
              >
                <AccordionTrigger className="text-lg sm:text-xl font-bold text-[#f0f0f0] hover:text-[#a31212] transition-colors py-6 sm:py-8 hover:no-underline">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-[#a31212] mr-4" />
                    {item.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-[#f0f0f0] pb-6 sm:pb-8 text-base sm:text-lg leading-relaxed">
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
