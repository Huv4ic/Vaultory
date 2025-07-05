import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { products, gameCategories } from '@/data/products';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const Catalog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem, items } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [visibleProducts, setVisibleProducts] = useState(15);

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
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (!user) {
      alert('Необходимо войти в систему!');
      return;
    }
    addItem(product);
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
            Каталог товаров
          </h1>
          <p className="text-gray-400">
            Найдите все необходимые товары для ваших любимых игр
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Поиск */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {/* Сортировка */}
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="popular">По популярности</option>
                <option value="price-low">Сначала дешевые</option>
                <option value="price-high">Сначала дорогие</option>
                <option value="rating">По рейтингу</option>
              </select>
            </div>
          </div>
        </div>

        {/* Категории */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Все категории
            </button>
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-red-500 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Результаты */}
        <div className="mb-6">
          <p className="text-gray-400">
            Найдено товаров: {filteredProducts.length}
          </p>
        </div>

        {/* Товары */}
        {displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  isInCart={items.some((item) => item.id === product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                  onDetails={() => handleProductDetails(product)}
                />
              ))}
            </div>

            {visibleProducts < filteredProducts.length && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200"
                >
                  Показать еще товары
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
            <p className="text-gray-400">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
