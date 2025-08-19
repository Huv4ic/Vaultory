import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProducts } from '@/hooks/useProducts';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

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
  const getCategoryIcon = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'user': '👤',
      'dollar': '💰',
      'key': '🔑',
      'calendar': '📅',
      'star': '⭐',
      'default': '📦'
    };
    return iconMap[iconName] || iconMap['default'];
  };

  // Создаем gameCategories из данных БД
  const gameCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon
  }));

  let filteredProducts = products;

  // Фильтр по категории
  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.game.toLowerCase().includes(selectedCategory)
    );
  }

  // Поиск
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (categories.find(cat => cat.id === product.category_id)?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Сортировка
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'popular':
    default:
      filteredProducts.sort((a, b) => b.sales - a.sales);
      break;
  }

  const displayedProducts = filteredProducts.slice(0, visibleProducts);

  const handleAddToCart = (product) => {
    if (!telegramUser) {
      alert(t('Войдите через Telegram, чтобы добавить в корзину!'));
      return;
    }
    addItem(product, 1);
  };

  const handleProductDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  const loadMore = () => {
    setVisibleProducts(prev => prev + 15);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {t('Каталог товаров')}
          </h1>
          <p className="text-gray-400">
            {t('Найдите все необходимые товары для ваших любимых игр')}
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Поиск */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder={t('Поиск товаров...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {/* Сортировка */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg"
              >
                <option value="popular">{t('Популярные')}</option>
                <option value="price-low">{t('По цене (дешевле)')}</option>
                <option value="price-high">{t('По цене (дороже)')}</option>
                <option value="rating">{t('По рейтингу')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Категории игр */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {t('Все игры')}
            </button>
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{getCategoryIcon(category.icon)}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Товары */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.original_price}
              image={product.image_url}
              category={categories.find(cat => cat.id === product.category_id)?.name || product.game}
              rating={product.rating}
              sales={product.sales}
              isInCart={items.some((item) => item.id === product.id)}
              onAddToCart={() => handleAddToCart(product)}
              onDetails={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>

        {/* Кнопка "Показать еще" */}
        {visibleProducts < filteredProducts.length && (
          <div className="text-center">
            <Button
              onClick={loadMore}
              className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none px-8 py-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/25"
            >
              {t('Показать еще')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
