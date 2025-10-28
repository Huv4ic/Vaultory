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
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#a31212] mx-auto mb-4"></div>
          <p className="text-[#a0a0a0] text-xl">Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center bg-[#181818] rounded-2xl p-8 border border-[#1c1c1c]">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-[#f0f0f0] mb-4">Товар не найден</h1>
          <p className="text-[#a0a0a0] mb-6">
            К сожалению, запрашиваемый товар не существует или был удален.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105"
          >
            Вернуться в каталог
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] relative">

      {/* Основной контент */}
      <div className="relative z-10 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Кнопка назад */}
        <div className="mb-8 pt-20">
          <Button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-[#181818] border border-[#1c1c1c] text-[#a0a0a0] hover:text-[#f0f0f0] hover:border-[#a31212] font-bold rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              <span>Назад</span>
            </div>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 border-b-2 border-[#a31212] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-lg sm:text-xl text-[#a0a0a0]">Загрузка товара...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#a31212] mb-4 sm:mb-6">Ошибка загрузки</h2>
            <p className="text-[#a0a0a0] text-sm sm:text-base mb-6">Не удалось загрузить информацию о товаре</p>
            <Button
              onClick={() => navigate('/')}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
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
                <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-6 hover:border-[#a31212] transition-all duration-300">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-[#1c1c1c] border border-[#1c1c1c] relative">
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Миниатюры */}
              {product.images && product.images.length > 1 && (
                <div className="group relative">
                  <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-6 hover:border-[#a31212] transition-all duration-300">
                    <h3 className="text-lg font-black text-[#f0f0f0] mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#a31212]" />
                      Другие изображения
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(image)}
                          className={`group/thumb aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 relative ${
                            selectedImage === image
                              ? 'border-[#a31212]'
                              : 'border-[#1c1c1c] hover:border-[#a31212]'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                          />
                          {selectedImage === image && (
                            <div className="absolute inset-0 bg-[#a31212]/20 flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-[#a31212]" />
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
                <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-8 hover:border-[#a31212] transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-black text-[#f0f0f0] mb-2">
                        {product.name}
                      </h1>
                      <div className="flex items-center gap-2">
                        <Gem className="w-5 h-5 text-[#a31212]" />
                        <span className="text-[#a0a0a0] text-sm">Премиум товар</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={handleShare}
                        size="sm"
                        className="w-12 h-12 p-0 bg-[#1c1c1c] hover:bg-[#a31212] text-[#a0a0a0] hover:text-white rounded-xl transition-all duration-300 hover:scale-105 border border-[#1c1c1c] hover:border-[#a31212]"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => toggleFavorite(product.id)}
                        size="sm"
                        disabled={favoritesLoading}
                        className={`w-12 h-12 p-0 rounded-xl transition-all duration-300 hover:scale-105 border ${
                          isFavorite(product.id)
                            ? 'bg-[#a31212] hover:bg-[#8a0f0f] text-white border-[#a31212]'
                            : 'bg-[#1c1c1c] hover:bg-[#a31212] text-[#a0a0a0] hover:text-white border-[#1c1c1c] hover:border-[#a31212]'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Цена */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-4xl md:text-5xl font-black text-[#f0f0f0]">
                        {product.price}₴
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-xl text-[#a0a0a0] line-through">{product.original_price}₴</span>
                      )}
                    </div>

                  {/* Игра */}
                  {product.game && (
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1c1c1c] rounded-xl border border-[#1c1c1c]">
                        <Crown className="w-4 h-4 text-[#a31212]" />
                        <span className="text-[#a31212] font-bold">{product.game}</span>
                      </div>
                    </div>
                  )}

                  {/* Описание */}
                  {product.description && (
                    <div className="mb-6">
                      <h3 className="text-lg font-black text-[#f0f0f0] mb-3 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-[#a31212]" />
                        Описание
                      </h3>
                      <p className="text-[#a0a0a0] leading-relaxed">{product.description}</p>
                    </div>
                  )}

                  {/* Количество */}
                  <div className="mb-6">
                    <label className="block text-lg font-black text-[#f0f0f0] mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#a31212]" />
                      Количество
                    </label>
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        size="sm"
                        className="w-12 h-12 p-0 bg-[#1c1c1c] hover:bg-[#a31212] text-[#a0a0a0] hover:text-white rounded-xl transition-all duration-300 hover:scale-105 border border-[#1c1c1c] hover:border-[#a31212]"
                      >
                        -
                      </Button>
                      <span className="text-2xl font-black text-[#f0f0f0] min-w-[4rem] text-center">
                        {quantity}
                      </span>
                      <Button
                        onClick={() => setQuantity(quantity + 1)}
                        size="sm"
                        className="w-12 h-12 p-0 bg-[#a31212] hover:bg-[#8a0f0f] text-white rounded-xl transition-all duration-300 hover:scale-105"
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
                      className="w-full py-4 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105"
                    >
                      <Zap className="w-6 h-6 mr-3" />
                      Купить сейчас
                    </Button>
                    
                    <Button
                      onClick={handleAddToCart}
                      disabled={isInCart}
                      className="w-full py-4 bg-[#1c1c1c] hover:bg-[#a31212] text-[#a0a0a0] hover:text-white font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 border border-[#1c1c1c] hover:border-[#a31212] disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="w-full py-4 bg-[#1c1c1c] hover:bg-[#a31212] text-[#a0a0a0] hover:text-white font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 border border-[#1c1c1c] hover:border-[#a31212]"
                    >
                      <Eye className="w-6 h-6 mr-3" />
                      Перейти в корзину
                    </Button>
                  </div>
                </div>
              </div>

              {/* Информация о доставке */}
              <div className="group relative">
                <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-8 hover:border-[#a31212] transition-all duration-300">
                  <h3 className="text-2xl font-black text-[#f0f0f0] mb-6 flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-[#a31212]" />
                    Доставка и гарантия
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-[#1c1c1c] rounded-xl border border-[#1c1c1c]">
                      <Clock className="w-5 h-5 text-[#a31212]" />
                      <span className="text-[#f0f0f0] font-medium">Мгновенная доставка</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-[#1c1c1c] rounded-xl border border-[#1c1c1c]">
                      <Shield className="w-5 h-5 text-[#a31212]" />
                      <span className="text-[#f0f0f0] font-medium">Гарантия качества</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-[#1c1c1c] rounded-xl border border-[#1c1c1c]">
                      <CheckCircle className="w-5 h-5 text-[#a31212]" />
                      <span className="text-[#f0f0f0] font-medium">Официальный товар</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <Package className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 text-[#a31212]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#a0a0a0] mb-2">Товар не найден</h2>
            <p className="text-[#a0a0a0] text-sm sm:text-base mb-6">Запрашиваемый товар не существует</p>
            <Button
              onClick={() => navigate('/')}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
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
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-[#f0f0f0]">
            ПОХОЖИЕ ТОВАРЫ
          </h2>
          <div className="w-32 h-1 bg-[#a31212] mx-auto rounded-full mb-6"></div>
          <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
            Откройте для себя другие <span className="text-[#a31212] font-bold">удивительные товары</span> из этой категории
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
                <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-6 hover:border-[#a31212] transition-all duration-300 hover:scale-105">
                  {/* Изображение */}
                  <div className="relative mb-6">
                    <div className="w-full h-40 bg-[#1c1c1c] rounded-2xl flex items-center justify-center overflow-hidden border border-[#1c1c1c]">
                      <img
                        src={
                          (similarProduct.images && similarProduct.images.length > 0) 
                            ? similarProduct.images[0] 
                            : (similarProduct.image_url || '/placeholder.svg')
                        }
                        alt={similarProduct.name}
                        className="w-full h-full object-contain rounded-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Информация о товаре */}
                  <div className="relative z-10">
                    <h4 className="text-[#f0f0f0] font-black mb-3 line-clamp-2 text-lg">
                      {similarProduct.name}
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl font-black text-[#f0f0f0]">
                          {similarProduct.price}₴
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="w-12 h-12 p-0 bg-[#a31212] hover:bg-[#8a0f0f] text-white rounded-xl transition-all duration-300 hover:scale-105"
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
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-[#f0f0f0]">
            ПОЧЕМУ ВЫБИРАЮТ НАС
          </h2>
          <div className="w-32 h-1 bg-[#a31212] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative">
            <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-8 hover:border-[#a31212] transition-all duration-300 hover:scale-105 text-center">
              <div className="w-20 h-20 bg-[#1c1c1c] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#a31212]">
                <Award className="w-10 h-10 text-[#a31212]" />
              </div>
              <h4 className="text-2xl font-black text-[#f0f0f0] mb-4">Гарантия качества</h4>
              <p className="text-[#a0a0a0] leading-relaxed">
                Все товары <span className="text-[#a31212] font-bold">официальные</span> и лицензированные. Мы гарантируем подлинность каждого продукта.
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-8 hover:border-[#a31212] transition-all duration-300 hover:scale-105 text-center">
              <div className="w-20 h-20 bg-[#1c1c1c] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#a31212]">
                <Zap className="w-10 h-10 text-[#a31212]" />
              </div>
              <h4 className="text-2xl font-black text-[#f0f0f0] mb-4">Быстрая доставка</h4>
              <p className="text-[#a0a0a0] leading-relaxed">
                Товары доставляются <span className="text-[#a31212] font-bold">мгновенно</span> после оплаты. Никаких ожиданий - получайте сразу!
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-8 hover:border-[#a31212] transition-all duration-300 hover:scale-105 text-center">
              <div className="w-20 h-20 bg-[#1c1c1c] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#a31212]">
                <TrendingUp className="w-10 h-10 text-[#a31212]" />
              </div>
              <h4 className="text-2xl font-black text-[#f0f0f0] mb-4">Популярность</h4>
              <p className="text-[#a0a0a0] leading-relaxed">
                Высокий рейтинг и много <span className="text-[#a31212] font-bold">положительных отзывов</span> от довольных клиентов по всему миру.
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
