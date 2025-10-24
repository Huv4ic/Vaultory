import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProducts, Product } from '@/hooks/useProducts';
import { Search, Filter, SlidersHorizontal, ArrowLeft, Package, Star, TrendingUp, Crown, Flame, Shield, Zap, Target, Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Catalog = () => {
  const navigate = useNavigate();
  const { telegramUser } = useAuth();
  const { addItem, items } = useCart();
  const { t } = useLanguage();
  const { products, categories, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Функция для получения эмодзи иконки по названию
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'currency': '💰',
      'accounts': '👤',
      'keys': '🔑',
      'subscriptions': '📱',
      'skins': '🎨',
      'weapons': '🔫',
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

  // Создаем gameCategories из данных БД
  const gameCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    image: cat.image
  }));

  let filteredProducts = products;

  // Фильтр по категории
  if (selectedCategory !== 'all') {
    filteredProducts = products.filter(product => product.category_id === selectedCategory);
  }

  // Фильтр по поиску
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Сортировка
  switch (sortBy) {
    case 'price_asc':
      filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filteredProducts = [...filteredProducts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'popular':
      filteredProducts = [...filteredProducts].sort((a, b) => (b.sales || 0) - (a.sales || 0));
      break;
    default:
      // По умолчанию сортируем по популярности
      filteredProducts = [...filteredProducts].sort((a, b) => (b.sales || 0) - (a.sales || 0));
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

  const handleAddToCart = (product: any) => {
    if (!telegramUser) {
      alert(t('Войдите через Telegram, чтобы добавить в корзину!'));
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      image: (product.images && product.images.length > 0) ? product.images[0] : product.image_url
    });
  };

  const handleBuyNow = (product: any) => {
    if (!telegramUser) {
      alert(t('Войдите через Telegram для покупки!'));
      return;
    }
    // Добавляем товар в корзину
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      image: (product.images && product.images.length > 0) ? product.images[0] : product.image_url
    });
    // Сразу переходим в корзину
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#a31212] mx-auto mb-4"></div>
          <p className="text-[#a0a0a0] text-xl">{t('Загрузка товаров...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-[#181818] rounded-full flex items-center justify-center mb-6 border border-[#1c1c1c]">
            <span className="text-[#a31212] text-3xl">⚠️</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-[#a31212]">{t('Ошибка загрузки')}</h1>
          <p className="text-xl mb-6 text-[#a0a0a0]">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            {t('Попробовать снова')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] relative">

      {/* Новинки Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <div className="w-6 h-6 bg-[#a31212] rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">🔥</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f0f0f0]">
              Новинки
            </h2>
          </div>
          
          {/* Новинки Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
            {gameCategories.slice(0, 8).map((category) => (
              <div 
                key={category.id}
                className="group bg-[#181818] rounded-xl p-4 text-center hover:bg-[#1c1c1c] transition-all duration-300 cursor-pointer border border-[#1c1c1c] hover:border-[#a31212]"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-[#1c1c1c] rounded-lg flex items-center justify-center">
                  <img 
                    src={category.image || '/placeholder.svg'} 
                    alt={category.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <p className="text-[#f0f0f0] text-sm font-medium truncate">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Главный заголовок */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-[#181818] rounded-full mb-6 border border-[#1c1c1c]">
              <Crown className="w-10 h-10 md:w-12 md:h-12 text-[#a31212]" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-[#f0f0f0]">
              КАТАЛОГ ТОВАРОВ
            </h1>
            <div className="w-32 h-1 bg-[#a31212] mx-auto rounded-full"></div>
          </div>
          
          {/* Описание */}
          <p className="text-lg md:text-xl lg:text-2xl text-[#a0a0a0] mb-12 max-w-4xl mx-auto leading-relaxed">
            Откройте для себя <span className="text-[#a31212] font-bold">огромный выбор</span> качественных игровых товаров. 
            От <span className="text-[#f0f0f0] font-bold">редких скинов</span> до <span className="text-[#a31212] font-bold">эксклюзивных предметов</span> - у нас есть все для настоящих геймеров.
          </p>
          
          {/* Статистика каталога */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl border border-[#1c1c1c] p-6 hover:border-[#a31212] transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-[#a31212] rounded-full mx-auto mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <p className="text-[#a0a0a0] text-sm mb-2">Всего товаров</p>
                <p className="text-3xl font-black text-[#a31212]">{products.length}</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl border border-[#1c1c1c] p-6 hover:border-[#a31212] transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-[#a31212] rounded-full mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <p className="text-[#a0a0a0] text-sm mb-2">Категорий</p>
                <p className="text-3xl font-black text-[#a31212]">{categories.length}</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl border border-[#1c1c1c] p-6 hover:border-[#a31212] transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-[#a31212] rounded-full mx-auto mb-4">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <p className="text-[#a0a0a0] text-sm mb-2">Средний рейтинг</p>
                <p className="text-3xl font-black text-[#a31212]">4.8</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-[#f0f0f0]">
            ПОИСК ТОВАРОВ
          </h2>
          <div className="w-24 h-1 bg-[#a31212] mx-auto rounded-full"></div>
        </div>

        {/* Поиск и фильтры с крутым дизайном */}
        <div className="max-w-4xl mx-auto mb-16">
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
                    {categories.map((category) => (
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

        {/* Результаты */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 border-b-2 border-[#a31212] mx-auto mb-4 sm:mb-6"></div>
              <p className="text-lg sm:text-xl text-[#a0a0a0]">Загрузка товаров...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-lg sm:text-xl text-[#a31212] mb-4 sm:mb-6">Ошибка загрузки товаров</p>
              <Button
                onClick={() => window.location.reload()}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
              >
                Попробовать снова
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <Package className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 text-[#a31212]" />
              <h3 className="text-lg sm:text-xl font-semibold text-[#a0a0a0] mb-2">Товары не найдены</h3>
              <p className="text-[#a0a0a0] text-sm sm:text-base mb-6">Попробуйте изменить параметры поиска</p>
            </div>
          ) : (
            <>
              {/* Счетчик результатов */}
              <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <p className="text-gray-300 text-lg">
                    Найдено товаров: <span className="text-cyan-400 font-black text-xl">{filteredProducts.length}</span>
                  </p>
                </div>
              </div>

              {/* Товары по играм */}
              <div className="space-y-12">
                {Object.entries(groupedProducts).map(([gameName, gameProducts], gameIndex) => (
                  <div key={gameName} className="animate-fade-in" style={{animationDelay: `${gameIndex * 0.2}s`}}>
                    {/* Заголовок игры */}
                    <div className="mb-12 relative">
                      <div className="text-center mb-6">
                        <div className="relative inline-block">
                          <h3 className="text-4xl md:text-5xl font-black text-white tracking-wider relative z-10 drop-shadow-lg">
                            {gameName.toUpperCase()}
                          </h3>
                          {/* Светящийся эффект */}
                          <div className="absolute inset-0 text-4xl md:text-5xl font-black text-cyan-400/40 tracking-wider blur-sm">
                            {gameName.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      {/* Декоративная линия */}
                      <div className="flex items-center justify-center">
                        <div className="h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full w-32 shadow-lg shadow-cyan-500/30"></div>
                        <div className="h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent rounded-full w-24 ml-2"></div>
                      </div>
                    </div>
                    
                    {/* Товары этой игры */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                      {gameProducts.map((product, index) => (
                        <div 
                          key={product.id} 
                          style={{ animationDelay: `${(gameIndex * 5 + index) * 0.05}s` }}
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
                            description={product.description}
                            isInCart={items.some(item => item.id === product.id)}
                            onAddToCart={() => handleAddToCart(product)}
                            onDetails={() => navigate(`/product/${product.id}`)}
                            onBuyNow={() => handleBuyNow(product)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Информационные блоки */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ИНФОРМАЦИЯ
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-8 hover:border-cyan-400/50 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-500">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Качество товаров</h3>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Все товары <span className="text-cyan-400 font-bold">официальные</span> и лицензированные</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Гарантия <span className="text-purple-400 font-bold">качества</span> и работоспособности</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p><span className="text-pink-400 font-bold">Мгновенная</span> доставка после оплаты</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Поддержка <span className="text-yellow-400 font-bold">24/7</span> по любым вопросам</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 hover:border-purple-400/50 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-500">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Популярные категории</h3>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Скины для <span className="text-green-400 font-bold">популярных игр</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p><span className="text-orange-400 font-bold">Эксклюзивные</span> предметы</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p><span className="text-red-400 font-bold">Коллекционные</span> вещи</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p><span className="text-blue-400 font-bold">Новинки</span> и редкие находки</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-16">
          <Button
            onClick={() => navigate('/')}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-cyan-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Вернуться на главную</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
