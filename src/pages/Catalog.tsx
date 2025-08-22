import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProducts } from '@/hooks/useProducts';
import { Search, Filter, SlidersHorizontal, ArrowLeft, Package, Star, TrendingUp } from 'lucide-react';
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
  const [visibleProducts, setVisibleProducts] = useState(15);

  // Функция для получения эмодзи иконки по названию
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'currency': '💰',
      'skins': '🎨',
      'weapons': '🔫',
      'characters': '👤',
      'vehicles': '🚗',
      'default': '📦'
    };
    return iconMap[categoryName.toLowerCase()] || iconMap['default'];
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
    case 'price-low':
      filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
      break;
    default:
      // По умолчанию сортируем по названию
      filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  const handleAddToCart = (product: any) => {
    if (!telegramUser) {
      alert(t('Войдите через Telegram, чтобы добавить в корзину!'));
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400/30 mx-auto mb-4"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-amber-400 mx-auto"></div>
          </div>
          <p className="text-gray-300 text-xl">{t('Загрузка товаров...')}</p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce animation-delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
            <span className="text-red-400 text-3xl">⚠️</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-red-400">{t('Ошибка загрузки')}</h1>
          <p className="text-xl mb-6 text-gray-300">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-red-500/30"
          >
            {t('Попробовать снова')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
            🛍️ {t('Каталог товаров')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Откройте для себя огромный выбор качественных игровых товаров. 
            От редких скинов до эксклюзивных предметов - у нас есть все для настоящих геймеров.
          </p>
          
          {/* Статистика каталога */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-gray-300 text-sm">Всего товаров</p>
              <p className="text-amber-400 font-bold text-lg">{products.length}</p>
            </div>
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">🏷️</div>
              <p className="text-gray-300 text-sm">Категорий</p>
              <p className="text-amber-400 font-bold text-lg">{categories.length}</p>
            </div>
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">⭐</div>
              <p className="text-gray-300 text-sm">Средний рейтинг</p>
              <p className="text-amber-400 font-bold text-lg">4.8</p>
            </div>
          </div>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Поиск и фильтры */}
        <div className="mb-12">
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Поиск */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
                  <Input
                    type="text"
                    placeholder={t('Поиск товаров...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 py-3 bg-black/70 backdrop-blur-sm border border-amber-500/40 text-amber-200 placeholder-amber-400/60 focus:border-amber-400 focus:ring-amber-400/20 focus:bg-black/80 transition-all duration-300 hover:border-amber-400 hover:bg-black/60 rounded-xl"
                  />
                </div>

                {/* Фильтр по категории */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/70 backdrop-blur-sm border border-amber-500/40 rounded-xl text-amber-200 focus:border-amber-400 focus:ring-amber-400/20 focus:bg-black/80 transition-all duration-300 hover:border-amber-400 hover:bg-black/60"
                  >
                    <option value="all" className="bg-black text-amber-200">Все категории</option>
                    {gameCategories.map((category) => (
                      <option key={category.id} value={category.id} className="bg-black text-amber-200">
                        {getCategoryIcon(category.name)} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Сортировка */}
                <div className="relative">
                  <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/70 backdrop-blur-sm border border-amber-500/40 rounded-xl text-amber-200 focus:border-amber-400 focus:ring-amber-400/20 focus:bg-black/80 transition-all duration-300 hover:border-amber-400 hover:bg-black/60"
                  >
                    <option value="popular" className="bg-black text-amber-200">По популярности</option>
                    <option value="price-low" className="bg-black text-amber-200">По цене (возрастание)</option>
                    <option value="price-high" className="bg-black text-amber-200">По цене (убывание)</option>
                    <option value="rating" className="bg-black text-amber-200">По рейтингу</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Результаты поиска */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 border border-amber-500/30">
              <Package className="w-12 h-12 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Товары не найдены</h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Попробуйте изменить параметры поиска или выбрать другую категорию
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSortBy('popular');
              }}
              variant="outline"
              className="px-8 py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
            >
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <>
            {/* Счетчик результатов */}
            <div className="mb-8 text-center">
              <p className="text-gray-300">
                Найдено товаров: <span className="text-amber-400 font-bold">{filteredProducts.length}</span>
              </p>
            </div>

            {/* Сетка товаров */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.slice(0, visibleProducts).map((product, index) => (
                <div key={product.id} style={{ animationDelay: `${index * 0.05}s` }}>
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
                    isInCart={items.some(item => item.id === product.id)}
                    onAddToCart={() => handleAddToCart(product)}
                    onDetails={() => navigate(`/product/${product.id}`)}
                  />
                </div>
              ))}
            </div>

            {/* Кнопка "Показать еще" */}
            {visibleProducts < filteredProducts.length && (
              <div className="text-center mt-12">
                <Button
                  onClick={() => setVisibleProducts(prev => prev + 15)}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
                >
                  Показать еще
                </Button>
              </div>
            )}
          </>
        )}

        {/* Информация о каталоге */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Star className="w-6 h-6 mr-3 text-amber-400" />
                Качество товаров
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>• Все товары официальные и лицензированные</p>
                <p>• Гарантия качества на каждый предмет</p>
                <p>• Мгновенная доставка после оплаты</p>
                <p>• Поддержка 24/7 по всем вопросам</p>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-amber-400" />
                Популярные категории
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>• Скины для популярных игр</p>
                <p>• Эксклюзивные предметы</p>
                <p>• Коллекционные вещи</p>
                <p>• Новинки и редкие находки</p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-16">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-8 py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
