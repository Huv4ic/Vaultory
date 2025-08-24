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
  TrendingUp
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
        image_url: product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12">
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Кнопка назад */}
        <div className="mb-6 sm:mb-8 mt-16 sm:mt-20 md:mt-24">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-lg sm:rounded-xl text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Назад
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Левая колонка - изображения */}
            <div className="space-y-4 sm:space-y-6">
              {/* Главное изображение */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6">
                <div className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Миниатюры */}
              {product.images && product.images.length > 1 && (
                <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6">
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4">Другие изображения</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                          selectedImage === image
                            ? 'border-amber-400 shadow-lg shadow-amber-500/30'
                            : 'border-amber-500/30 hover:border-amber-400/50'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Правая колонка - информация */}
            <div className="space-y-4 sm:space-y-6">
              {/* Основная информация */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{product.name}</h1>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Button
                      onClick={handleShare}
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 sm:w-10 sm:h-10 p-0 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-300 transition-all duration-300"
                    >
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      onClick={() => toggleFavorite(product.id)}
                      size="sm"
                      variant="outline"
                      disabled={favoritesLoading}
                      className={`w-8 h-8 sm:w-10 sm:h-10 p-0 transition-all duration-300 ${
                        isFavorite(product.id)
                          ? 'border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-400 hover:text-red-300'
                          : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-300'
                      }`}
                    >
                      <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Цена */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400">{product.price}₴</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-lg sm:text-xl text-gray-400 line-through">{product.original_price}₴</span>
                    )}
                  </div>
                  {product.original_price && product.original_price > product.price && (
                    <div className="mt-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs sm:text-sm">
                        Скидка {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Рейтинг и продажи */}
                <div className="flex items-center space-x-4 sm:space-x-6 mb-3 sm:mb-4">
                  {product.rating && (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current" />
                      <span className="text-sm sm:text-base text-white font-medium">{product.rating}</span>
                    </div>
                  )}
                  {product.sales && (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <span className="text-sm sm:text-base text-gray-300">{product.sales} продаж</span>
                    </div>
                  )}
                </div>

                {/* Игра */}
                {product.game && (
                  <div className="mb-3 sm:mb-4">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs sm:text-sm">
                      {product.game}
                    </Badge>
                  </div>
                )}

                {/* Описание */}
                {product.description && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-2">Описание</h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Количество */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm sm:text-base font-medium text-white mb-2">Количество</label>
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <Button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      size="sm"
                      className="w-8 h-8 sm:w-10 sm:h-10 p-0 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 hover:text-amber-300 transition-all duration-300"
                    >
                      -
                    </Button>
                    <span className="text-lg sm:text-xl font-bold text-white min-w-[3rem] text-center">{quantity}</span>
                    <Button
                      onClick={() => setQuantity(quantity + 1)}
                      size="sm"
                      className="w-8 h-8 sm:w-10 sm:h-10 p-0 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 hover:text-amber-300 transition-all duration-300"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="space-y-3 sm:space-y-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isInCart ? (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Уже в корзине
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Добавить в корзину
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/cart')}
                    variant="outline"
                    className="w-full py-3 sm:py-4 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Перейти в корзину
                  </Button>
                </div>
              </div>

              {/* Информация о доставке */}
              <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-amber-400" />
                  Доставка и гарантия
                </h3>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    <span>Мгновенная доставка</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Shield className="w-4 h-4 sm:w-5 sm:w-5 text-blue-400" />
                    <span>Гарантия качества</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                    <span>Официальный товар</span>
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
      <div className="mt-20 max-w-[1920px] mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Похожие товары
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(p => p.id !== product.id && p.category_id === product.category_id)
            .slice(0, 4)
            .map((similarProduct, index) => (
              <div 
                key={similarProduct.id}
                className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/product/${similarProduct.id}`)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-full h-32 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-xl mb-3 flex items-center justify-center">
                  <img
                    src={similarProduct.images && similarProduct.images.length > 0 ? similarProduct.images[0] : '/placeholder.svg'}
                    alt={similarProduct.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                <h4 className="text-white font-semibold mb-2 line-clamp-2 text-sm">
                  {similarProduct.name}
                </h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold">{similarProduct.price}₴</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-lg"
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
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-20 max-w-[1920px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Гарантия качества</h4>
            <p className="text-gray-300 text-sm">
              Все товары официальные и лицензированные
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
              <Zap className="w-8 h-8 text-amber-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Быстрая доставка</h4>
            <p className="text-gray-300 text-sm">
              Товары доставляются мгновенно после оплаты
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
              <TrendingUp className="w-8 h-8 text-amber-400" />
            </div>
            <h4 className="text-white font-semibold mb-2">Популярность</h4>
            <p className="text-gray-300 text-sm">
              Высокий рейтинг и много положительных отзывов
            </p>
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
