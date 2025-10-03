import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Package, 
  Shield, 
  Truck, 
  Clock,
  CheckCircle,
  Heart,
  Share2,
  Eye,
  Tag,
  Zap,
  Award,
  TrendingUp,
  Crown,
  Flame,
  Target,
  Rocket,
  Sparkles,
  Gem
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { useFavorites } from '@/hooks/useFavorites';
import ShareModal from '@/components/ShareModal';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { addItem, items } = useCart();
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites();
  
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    // Прокручиваем страницу наверх при загрузке
    window.scrollTo(0, 0);
    
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else if (product && product.image_url) {
      setSelectedImage(product.image_url);
    } else {
      setSelectedImage('/placeholder.svg');
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || (product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'),
        image: product.images && product.images.length > 0 ? product.images[0] : (product.image_url || '/placeholder.svg')
      });
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const isInCart = product ? items.some(item => item.id === product.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400/30 mx-auto mb-4"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-amber-400 mx-auto"></div>
          </div>
          <p className="text-gray-300 text-xl">Загрузка товара...</p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce animation-delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-white mb-4">Товар не найден</h1>
          <p className="text-gray-300 mb-6">
            К сожалению, запрашиваемый товар не существует или был удален.
          </p>
          <Button
            onClick={() => navigate('/catalog')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
          >
            Вернуться в каталог
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        {/* Плавающие частицы */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-green-400 rounded-full opacity-90"></div>
        <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-50"></div>
        
        {/* Светящиеся линии */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        
        {/* Большие светящиеся элементы */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-r from-pink-500/10 to-yellow-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-xl"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-10 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Кнопка назад */}
        <div className="mb-8 pt-20">
          <Button
            onClick={() => navigate(-1)}
            className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-cyan-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Назад</span>
            </div>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 border-b-2 border-amber-400 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-300">Загрузка товара...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-400 mb-4 sm:mb-6">Ошибка загрузки</h2>
            <p className="text-gray-300 text-sm sm:text-base mb-6">Не удалось загрузить информацию о товаре</p>
            <Button
              onClick={() => navigate('/catalog')}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
            >
              Вернуться в каталог
            </Button>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Левая колонка - изображения */}
            <div className="space-y-6">
              {/* Главное изображение */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-6 hover:border-cyan-400/50 transition-all duration-500">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-400/20 to-purple-600/20 border border-cyan-500/30 relative">
                    {/* Декоративные кольца */}
                    <div className="absolute inset-2 border border-cyan-400/20 rounded-xl animate-spin-slow"></div>
                    <div className="absolute inset-4 border border-purple-400/20 rounded-xl animate-spin-reverse"></div>
                    
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="relative z-10 w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Магические частицы */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-80"></div>
                    <div className="absolute top-1/2 left-2 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-70"></div>
                  </div>
                </div>
              </div>

              {/* Миниатюры */}
              {product.images && product.images.length > 1 && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all duration-500">
                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      Другие изображения
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(image)}
                          className={`group/thumb aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-110 relative ${
                            selectedImage === image
                              ? 'border-cyan-400 shadow-lg shadow-cyan-500/30'
                              : 'border-purple-500/30 hover:border-purple-400/50'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                          />
                          {selectedImage === image && (
                            <div className="absolute inset-0 bg-cyan-400/20 flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-cyan-400" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Правая колонка - информация */}
            <div className="space-y-6">
              {/* Основная информация */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-pink-500/30 p-8 hover:border-pink-400/50 transition-all duration-500">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-black text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {product.name}
                      </h1>
                      <div className="flex items-center gap-2">
                        <Gem className="w-5 h-5 text-pink-400" />
                        <span className="text-gray-400 text-sm">Премиум товар</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={handleShare}
                        size="sm"
                        className="w-12 h-12 p-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-lg shadow-cyan-500/25"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => toggleFavorite(product.id)}
                        size="sm"
                        disabled={favoritesLoading}
                        className={`w-12 h-12 p-0 rounded-xl transition-all duration-300 hover:scale-110 ${
                          isFavorite(product.id)
                            ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white shadow-lg shadow-red-500/25'
                            : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Цена */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {product.price}₴
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-xl text-gray-400 line-through">{product.original_price}₴</span>
                      )}
                    </div>
                    {product.original_price && product.original_price > product.price && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-bold">
                          Скидка {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Рейтинг и продажи */}
                  <div className="flex items-center space-x-6 mb-6">
                    {product.rating && (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-white font-bold">{product.rating}</span>
                      </div>
                    )}
                    {product.sales && (
                      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300 font-medium">{product.sales} продаж</span>
                      </div>
                    )}
                  </div>

                  {/* Игра */}
                  {product.game && (
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                        <Crown className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-bold">{product.game}</span>
                      </div>
                    </div>
                  )}

                  {/* Описание */}
                  {product.description && (
                    <div className="mb-6">
                      <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        Описание
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{product.description}</p>
                    </div>
                  )}

                  {/* Количество */}
                  <div className="mb-6">
                    <label className="block text-lg font-black text-white mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-cyan-400" />
                      Количество
                    </label>
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        size="sm"
                        className="w-12 h-12 p-0 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-lg shadow-red-500/25"
                      >
                        -
                      </Button>
                      <span className="text-2xl font-black text-white min-w-[4rem] text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {quantity}
                      </span>
                      <Button
                        onClick={() => setQuantity(quantity + 1)}
                        size="sm"
                        className="w-12 h-12 p-0 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-lg shadow-green-500/25"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="space-y-4">
                    {/* Кнопка "Купить сейчас" */}
                    <Button
                      onClick={() => {
                        handleAddToCart();
                        navigate('/cart');
                      }}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-emerald-600/25"
                    >
                      <Zap className="w-6 h-6 mr-3" />
                      Купить сейчас
                    </Button>
                    
                    <Button
                      onClick={handleAddToCart}
                      disabled={isInCart}
                      className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isInCart ? (
                        <>
                          <CheckCircle className="w-6 h-6 mr-3" />
                          Уже в корзине
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-6 h-6 mr-3" />
                          Добавить в корзину
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => navigate('/cart')}
                      className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-500/25"
                    >
                      <Eye className="w-6 h-6 mr-3" />
                      Перейти в корзину
                    </Button>
                  </div>
                </div>
              </div>

              {/* Информация о доставке */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-green-500/30 p-8 hover:border-green-400/50 transition-all duration-500">
                  <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-green-400" />
                    Доставка и гарантия
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                      <Clock className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">Мгновенная доставка</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Гарантия качества</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                      <CheckCircle className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-medium">Официальный товар</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <Package className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 text-gray-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">Товар не найден</h2>
            <p className="text-gray-500 text-sm sm:text-base mb-6">Запрашиваемый товар не существует</p>
            <Button
              onClick={() => navigate('/catalog')}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
            >
              Вернуться в каталог
            </Button>
          </div>
        )}
      </div>

      {/* Похожие товары */}
      <div className="mt-32 max-w-[1920px] mx-auto px-4 relative">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ПОХОЖИЕ ТОВАРЫ
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Откройте для себя другие <span className="text-cyan-400 font-bold">удивительные товары</span> из этой категории
          </p>
        </div>
        
        {/* Сетка товаров */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products
            .filter(p => p.id !== product.id && p.category_id === product.category_id)
            .slice(0, 4)
            .map((similarProduct, index) => (
              <div 
                key={similarProduct.id}
                className="group relative cursor-pointer"
                onClick={() => navigate(`/product/${similarProduct.id}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-6 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105">
                  {/* Изображение */}
                  <div className="relative mb-6">
                    <div className="w-full h-40 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-2xl flex items-center justify-center overflow-hidden border border-cyan-500/30 relative">
                      {/* Декоративные кольца */}
                      <div className="absolute inset-2 border border-cyan-400/20 rounded-xl animate-spin-slow"></div>
                      <div className="absolute inset-4 border border-purple-400/20 rounded-xl animate-spin-reverse"></div>
                      
                      <img
                        src={
                          (similarProduct.images && similarProduct.images.length > 0) 
                            ? similarProduct.images[0] 
                            : (similarProduct.image_url || '/placeholder.svg')
                        }
                        alt={similarProduct.name}
                        className="relative z-10 w-full h-full object-contain rounded-xl group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      
                      {/* Магические частицы */}
                      <div className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
                      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-80"></div>
                    </div>
                  </div>
                  
                  {/* Информация о товаре */}
                  <div className="relative z-10">
                    <h4 className="text-white font-black mb-3 line-clamp-2 text-lg group-hover:text-cyan-100 transition-colors duration-300">
                      {similarProduct.name}
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          {similarProduct.price}₴
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="w-12 h-12 p-0 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-lg shadow-cyan-500/25"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem({
                            id: similarProduct.id,
                            name: similarProduct.name,
                            price: similarProduct.price,
                            image_url: similarProduct.images && similarProduct.images.length > 0 ? similarProduct.images[0] : '/placeholder.svg'
                          });
                        }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-32 mb-20 max-w-[1920px] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ПОЧЕМУ ВЫБИРАЮТ НАС
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-8 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-cyan-500/20">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-black text-white mb-4 group-hover:text-cyan-100 transition-colors duration-300">Гарантия качества</h4>
              <p className="text-gray-300 leading-relaxed">
                Все товары <span className="text-cyan-400 font-bold">официальные</span> и лицензированные. Мы гарантируем подлинность каждого продукта.
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-green-500/30 p-8 hover:border-green-400/50 transition-all duration-500 hover:scale-105 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-green-500/20">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-black text-white mb-4 group-hover:text-green-100 transition-colors duration-300">Быстрая доставка</h4>
              <p className="text-gray-300 leading-relaxed">
                Товары доставляются <span className="text-green-400 font-bold">мгновенно</span> после оплаты. Никаких ожиданий - получайте сразу!
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-purple-500/20">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-black text-white mb-4 group-hover:text-purple-100 transition-colors duration-300">Популярность</h4>
              <p className="text-gray-300 leading-relaxed">
                Высокий рейтинг и много <span className="text-purple-400 font-bold">положительных отзывов</span> от довольных клиентов по всему миру.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для шаринга */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        productName={product?.name || ''}
      />
    </div>
  );
};

export default ProductPage;
