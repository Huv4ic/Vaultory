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
  const [selectedGameCategory, setSelectedGameCategory] = useState('all');
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

  // Получаем уникальные игры из товаров
  const getAvailableGames = () => {
    if (!products || products.length === 0) return [];
    
    const gameNames = products
      .map(product => product.game)
      .filter(game => game && game.trim() !== '')
      .map(game => game.toLowerCase().trim());
    
    const uniqueGames = [...new Set(gameNames)];
    return uniqueGames;
  };

  // Словарь всех возможных игр с их настройками
  const allGameCategories = {
    'tiktok': {
      name: 'TikTok',
      color: 'from-pink-500 to-purple-600',
      icon: '📱'
    },
    'standoff2': {
      name: 'Standoff 2',
      color: 'from-blue-500 to-cyan-600',
      icon: '🔫'
    },
    'mobile_legends': {
      name: 'Mobile Legends',
      color: 'from-orange-500 to-red-600',
      icon: '⚔️'
    },
    'pubg': {
      name: 'PUBG Mobile',
      color: 'from-green-500 to-teal-600',
      icon: '🎯'
    },
    'free_fire': {
      name: 'Free Fire',
      color: 'from-red-500 to-pink-600',
      icon: '🔥'
    },
    'steam': {
      name: 'Steam',
      color: 'from-gray-500 to-blue-600',
      icon: '🎮'
    },
    'roblox': {
      name: 'Roblox',
      color: 'from-purple-500 to-indigo-600',
      icon: '🧱'
    },
    'genshin': {
      name: 'Genshin Impact',
      color: 'from-yellow-500 to-orange-600',
      icon: '⭐'
    },
    'honkai': {
      name: 'Honkai Star Rail',
      color: 'from-pink-500 to-purple-600',
      icon: '🚀'
    },
    'zenless': {
      name: 'Zenless Zone Zero',
      color: 'from-cyan-500 to-blue-600',
      icon: '⚡'
    },
    'identity_v': {
      name: 'Identity V',
      color: 'from-gray-600 to-purple-600',
      icon: '🎭'
    },
    'arena_breakout': {
      name: 'Arena Breakout',
      color: 'from-green-600 to-blue-600',
      icon: '🛡️'
    },
    'epic_games': {
      name: 'Epic Games',
      color: 'from-indigo-500 to-purple-600',
      icon: '🎯'
    },
    'brawl_stars': {
      name: 'Brawl Stars',
      color: 'from-yellow-500 to-orange-600',
      icon: '⭐'
    },
    'gta': {
      name: 'GTA',
      color: 'from-green-500 to-blue-600',
      icon: '🚗'
    },
    'rocket_league': {
      name: 'Rocket League',
      color: 'from-blue-500 to-cyan-600',
      icon: '🚀'
    },
    'spotify': {
      name: 'Spotify',
      color: 'from-green-500 to-emerald-600',
      icon: '🎵'
    },
    'world_of_tanks': {
      name: 'World of Tanks Blitz',
      color: 'from-gray-600 to-yellow-600',
      icon: '🚗'
    },
    'telegram_stars': {
      name: 'Звезды Telegram',
      color: 'from-blue-500 to-cyan-600',
      icon: '⭐'
    }
  };

  // Функция для сопоставления названия игры с категорией
  const matchGameToCategory = (gameName: string) => {
    const lowerGameName = gameName.toLowerCase();
    
    if (lowerGameName.includes('tiktok')) return 'tiktok';
    if (lowerGameName.includes('standoff')) return 'standoff2';
    if (lowerGameName.includes('mobile legends') || lowerGameName.includes('mobilelegends')) return 'mobile_legends';
    if (lowerGameName.includes('pubg')) return 'pubg';
    if (lowerGameName.includes('free fire') || lowerGameName.includes('freefire')) return 'free_fire';
    if (lowerGameName.includes('steam')) return 'steam';
    if (lowerGameName.includes('roblox')) return 'roblox';
    if (lowerGameName.includes('genshin')) return 'genshin';
    if (lowerGameName.includes('honkai')) return 'honkai';
    if (lowerGameName.includes('zenless')) return 'zenless';
    if (lowerGameName.includes('identity')) return 'identity_v';
    if (lowerGameName.includes('arena')) return 'arena_breakout';
    if (lowerGameName.includes('epic games') || lowerGameName.includes('epicgames')) return 'epic_games';
    if (lowerGameName.includes('brawl stars') || lowerGameName.includes('brawlstars')) return 'brawl_stars';
    if (lowerGameName.includes('gta') || lowerGameName.includes('grand theft auto')) return 'gta';
    if (lowerGameName.includes('rocket league') || lowerGameName.includes('rocketleague')) return 'rocket_league';
    if (lowerGameName.includes('spotify')) return 'spotify';
    if (lowerGameName.includes('world of tanks') || lowerGameName.includes('worldoftanks') || lowerGameName.includes('wot')) return 'world_of_tanks';
    if (lowerGameName.includes('telegram') || lowerGameName.includes('звезды') || (lowerGameName.includes('stars') && !lowerGameName.includes('brawl'))) return 'telegram_stars';
    
    return null;
  };

  // Создаем карточки только для игр, которые есть на сайте
  const gameCategoriesCards = (() => {
    const availableGames = getAvailableGames();
    const usedCategories = new Set();
    
    const cards = [];
    
    availableGames.forEach(gameName => {
      const categoryId = matchGameToCategory(gameName);
      if (categoryId && allGameCategories[categoryId] && !usedCategories.has(categoryId)) {
        usedCategories.add(categoryId);
        cards.push({
          id: categoryId,
          name: allGameCategories[categoryId].name,
          image: '/api/placeholder/300/200',
          color: allGameCategories[categoryId].color,
          icon: allGameCategories[categoryId].icon
        });
      }
    });
    
    return cards;
  })();

  // Фильтрация и поиск товаров
  let filteredProducts = products;

  // Фильтр по игровой категории
  if (selectedGameCategory !== 'all') {
    filteredProducts = filteredProducts.filter(product => {
      const gameName = product.game?.toLowerCase() || '';
      const categoryName = selectedGameCategory.toLowerCase();
      
      // Проверяем соответствие по названию игры
      if (categoryName === 'tiktok') return gameName.includes('tiktok');
      if (categoryName === 'standoff2') return gameName.includes('standoff') || gameName.includes('standoff2');
      if (categoryName === 'mobile_legends') return gameName.includes('mobile legends') || gameName.includes('mobilelegends');
      if (categoryName === 'pubg') return gameName.includes('pubg');
      if (categoryName === 'free_fire') return gameName.includes('free fire') || gameName.includes('freefire');
      if (categoryName === 'steam') return gameName.includes('steam');
      if (categoryName === 'roblox') return gameName.includes('roblox');
      if (categoryName === 'genshin') return gameName.includes('genshin');
      if (categoryName === 'honkai') return gameName.includes('honkai');
      if (categoryName === 'zenless') return gameName.includes('zenless');
      if (categoryName === 'identity_v') return gameName.includes('identity');
      if (categoryName === 'arena_breakout') return gameName.includes('arena');
      if (categoryName === 'epic_games') return gameName.includes('epic games') || gameName.includes('epicgames');
      if (categoryName === 'brawl_stars') return gameName.includes('brawl stars') || gameName.includes('brawlstars');
      if (categoryName === 'gta') return gameName.includes('gta') || gameName.includes('grand theft auto');
      if (categoryName === 'rocket_league') return gameName.includes('rocket league') || gameName.includes('rocketleague');
      if (categoryName === 'spotify') return gameName.includes('spotify');
      if (categoryName === 'world_of_tanks') return gameName.includes('world of tanks') || gameName.includes('worldoftanks') || gameName.includes('wot');
      if (categoryName === 'telegram_stars') return gameName.includes('telegram') || gameName.includes('звезды') || (gameName.includes('stars') && !gameName.includes('brawl'));
      
      return false;
    });
  }

  // Фильтр по категории товара
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
          
          {/* Крупные карточки категорий игр */}
          <div className="mb-16 sm:mb-20">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {gameCategoriesCards.map((category, index) => (
                <div
                key={category.id}
                  onClick={() => setSelectedGameCategory(selectedGameCategory === category.id ? 'all' : category.id)}
                  className={`group relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                    selectedGameCategory === category.id ? 'scale-105 -translate-y-2' : ''
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                  {/* Карточка категории */}
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.color} p-4 sm:p-6 h-32 sm:h-40 border-2 transition-all duration-300 ${
                    selectedGameCategory === category.id 
                      ? 'border-[#a31212] shadow-2xl shadow-[#a31212]/30' 
                      : 'border-transparent hover:border-[#a31212]/50'
                  }`}>
                    {/* Молния в углу */}
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                        selectedGameCategory === category.id 
                          ? 'bg-[#a31212] text-white' 
                          : 'bg-white/20 text-white'
                      }`}>
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Заглушка изображения */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="text-4xl sm:text-5xl opacity-80">
                        {category.icon}
                      </div>
                    </div>
                    
                    {/* Градиентный оверлей */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Название категории */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white font-bold text-sm sm:text-base truncate">
                        {category.name}
                      </h3>
                    </div>
                    
                    {/* Эффект при наведении */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
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


          {/* Товары по играм - показываем только если выбрана категория */}
          {selectedGameCategory !== 'all' && (
          <div className="space-y-16 sm:space-y-20">
            {Object.keys(groupedProducts).length === 0 ? (
              /* Сообщение о том, что товаров нет в наличии */
              <div className="text-center py-16 sm:py-20">
                <div className="max-w-2xl mx-auto">
                  <div className="relative mb-8">
                    {/* Анимированная иконка */}
                    <div className="w-24 h-24 mx-auto mb-6 bg-[#a31212]/20 rounded-3xl flex items-center justify-center border border-[#a31212]/30 animate-pulse">
                      <div className="relative">
                        <div className="w-12 h-12 bg-[#a31212] rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                        {/* Светящийся эффект */}
                        <div className="absolute inset-0 bg-[#a31212]/30 rounded-2xl blur-xl animate-ping"></div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#f0f0f0] mb-4">
                    Товары скоро появятся!
                  </h3>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-lg sm:text-xl text-[#a0a0a0] leading-relaxed">
                      В данной категории пока нет товаров, но мы активно работаем над пополнением ассортимента.
                    </p>
                    <p className="text-base sm:text-lg text-[#a0a0a0]">
                      Следите за обновлениями - новые товары появляются регулярно!
                    </p>
                  </div>
                  
                  {/* Декоративные элементы */}
                  <div className="flex justify-center items-center space-x-4 mb-8">
                    <div className="h-px bg-[#1c1c1c] w-16"></div>
                    <div className="w-2 h-2 bg-[#a31212] rounded-full animate-pulse"></div>
                    <div className="h-px bg-[#1c1c1c] w-16"></div>
                  </div>
                  
                  {/* Кнопка для возврата к поиску */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedGameCategory('all');
                        setSearchQuery('');
                        setSortBy('popular');
                      }}
                      className="px-8 py-4 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-xl shadow-[#a31212]/20"
                    >
                      <span className="flex items-center justify-center">
                        🔍 Посмотреть все товары
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              Object.entries(groupedProducts).map(([gameName, gameProducts], gameIndex) => (
              <div key={gameName} className="animate-fade-in" style={{animationDelay: `${gameIndex * 0.2}s`}}>
                {/* Заголовок игры */}
                <div className="mb-8 sm:mb-12 relative">
                  <div className="flex items-center justify-center md:justify-start mb-6 sm:mb-8">
                    <div className="relative group">
                      <Star className="w-6 h-6 sm:w-8 sm:h-8 text-[#a31212] absolute -left-8 sm:-left-10 top-1/2 transform -translate-y-1/2" />
                      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#f0f0f0] tracking-wide text-center md:text-left px-2">
                        {(() => {
                          const matchedCategory = Object.values(allGameCategories).find(category => 
                            matchGameToCategory(gameName) === category.id
                          );
                          return matchedCategory ? matchedCategory.name.toUpperCase() : gameName.toUpperCase();
                        })()}
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
            ))
            )}
          </div>
          )}
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
