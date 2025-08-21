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

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { addItem, items } = useCart();
  const { t } = useLanguage();
  
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (product && product.image_url) {
      setSelectedImage(product.image_url);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url
      });
    }
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
          <Button
            onClick={() => navigate('/catalog')}
            variant="outline"
            className="mb-6 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться в каталог
          </Button>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Галерея изображений */}
          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6">
              <div className="relative h-96 mb-4">
                <img
                  src={selectedImage || product.image_url || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                
                {/* Оверлей с информацией */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
                    <Tag className="w-4 h-4 mr-2" />
                    {product.category_id}
                  </Badge>
                </div>
                
                {product.rating && (
                  <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-white font-medium">{product.rating}</span>
                  </div>
                )}
              </div>
              
              {/* Убираем миниатюры - оставляем только основную фотографию */}
            </div>
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            {/* Основная информация */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6">
              <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
              
              {/* Цена */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-amber-400">{product.price}₴</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-gray-400 line-through text-xl">
                    {product.original_price}₴
                  </span>
                )}
                {product.sales && (
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    {product.sales} продаж
                  </Badge>
                )}
              </div>
              
              {/* Описание */}
              {product.description && (
                <p className="text-gray-300 leading-relaxed mb-6">
                  {product.description}
                </p>
              )}
              
              {/* Кнопки действий */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCart ? 'В корзине' : 'Добавить в корзину'}
                </Button>
                
                <Button
                  variant="outline"
                  className="px-6 py-4 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  В избранное
                </Button>
                
                <Button
                  variant="outline"
                  className="px-6 py-4 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Поделиться
                </Button>
              </div>
            </div>

            {/* Характеристики */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Package className="w-6 h-6 mr-3 text-amber-400" />
                Характеристики
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-amber-500/20">
                  <span className="text-gray-300">Категория:</span>
                  <span className="text-white font-medium">{product.category_id}</span>
                </div>
                
                {product.features && (
                  <div className="flex justify-between items-center py-2 border-b border-amber-500/20">
                    <span className="text-gray-300">Особенности:</span>
                    <span className="text-white font-medium">{product.features}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-2 border-b border-amber-500/20">
                  <span className="text-gray-300">Рейтинг:</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="text-white font-medium">{product.rating || 'Нет оценок'}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">Продажи:</span>
                  <span className="text-white font-medium">{product.sales || 0}</span>
                </div>
              </div>
            </div>

            {/* Информация о доставке */}
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Truck className="w-6 h-6 mr-3 text-amber-400" />
                Информация о доставке
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-300">Мгновенная доставка после оплаты</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-300">Официальный и лицензированный товар</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-300">Время обработки: 5 минут - 2 часа</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Похожие товары */}
        <div className="mt-20">
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
                      src={similarProduct.image_url || '/placeholder.svg'}
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
                          image_url: similarProduct.image_url
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
        <div className="mt-20">
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
      </div>
    </div>
  );
};

export default ProductPage;
