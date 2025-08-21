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

  // Убираем автоматическое обновление профиля - баланс не должен обновляться просто при просмотре каталога
  // useEffect(() => {
  //   if (telegramUser) {
  //     refreshTelegramProfile();
  //   }
  // }, [telegramUser, refreshTelegramProfile]);

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
    case 'rating':
      filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    default:
      // По умолчанию сортируем по популярности (количеству продаж)
      filteredProducts = [...filteredProducts].sort((a, b) => (b.sales || 0) - (a.sales || 0));
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
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">{t('Загрузка товаров...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-500">{t('Ошибка загрузки')}</h1>
          <Button onClick={() => window.location.reload()}>
            {t('Попробовать снова')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            {t('Каталог товаров')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('Найдите все необходимые товары для ваших любимых игр')}
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Поиск и фильтры */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 mb-12 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Поиск */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={t('Поиск товаров...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/30 border-amber-500/30 text-white placeholder:text-amber-300/70 focus:border-amber-500 focus:ring-amber-500/20"
              />
            </div>

            {/* Сортировка */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-black/30 border-amber-500/30 text-white rounded-md px-3 py-2 focus:border-amber-500 focus:ring-amber-500/20"
              >
                <option value="popular">{t('Популярные')}</option>
                <option value="price-low">{t('По цене (дешевле)')}</option>
                <option value="price-high">{t('По цене (дороже)')}</option>
                <option value="rating">{t('По рейтингу')}</option>
              </select>
            </div>

            {/* Фильтр по категории */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-black/30 border-amber-500/30 text-white rounded-md px-3 py-2 focus:border-amber-500 focus:ring-amber-500/20"
              >
                <option value="all">{t('Все игры')}</option>
                {gameCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Категории */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent">
            {t('Популярные игры')}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-500 transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-2xl shadow-amber-500/30'
                  : 'bg-black/30 backdrop-blur-sm text-amber-300 hover:bg-amber-500/20 hover:text-white border border-amber-500/30 hover:border-amber-500'
              }`}
            >
              {t('Все игры')}
            </button>
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-500 transform hover:scale-105 flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-2xl shadow-amber-500/30'
                    : 'bg-black/30 backdrop-blur-sm text-amber-300 hover:bg-amber-500/20 hover:text-white border border-amber-500/30 hover:border-amber-500'
                }`}
              >
                <span>{getCategoryIcon(category.icon)}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Товары */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
          {filteredProducts.slice(0, visibleProducts).map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.original_price}
                image={product.image_url}
                category={categories.find(cat => cat.id === product.category_id)?.name}
                rating={product.rating}
                sales={product.sales}
                isInCart={items.some(item => item.id === product.id)}
                onAddToCart={() => handleAddToCart(product)}
                onDetails={() => navigate(`/product/${product.id}`)}
              />
            </div>
          ))}
        </div>

        {/* Кнопка "Показать еще" */}
        {visibleProducts < filteredProducts.length && (
          <div className="text-center">
            <Button
              onClick={() => setVisibleProducts(prev => prev + 15)}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50"
            >
              {t('Показать еще')}
            </Button>
          </div>
        )}

        {/* Сообщение если товаров нет */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-white mb-2">Товары не найдены</h3>
            <p className="text-white/70 mb-6">Попробуйте изменить параметры поиска или фильтры</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSortBy('popular');
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
