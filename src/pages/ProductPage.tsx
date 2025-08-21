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
  Tag
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
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700 flex items-center justify-center">
        <div className="text-center bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-3xl font-bold text-white mb-4">Товар не найден</h1>
          <p className="text-white/80 mb-6">
            К сожалению, запрашиваемый товар не существует или был удален.
          </p>
          <Button
            onClick={() => navigate('/catalog')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
          >
            Вернуться в каталог
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
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Галерея изображений */}
          <div className="space-y-6">
            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardContent className="p-6">
                <div className="relative">
                  <img
                    src={selectedImage || product.image_url || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-black/50 backdrop-blur-sm border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-black/50 backdrop-blur-sm border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Миниатюры */}
                {product.image_url && (
                  <div className="flex space-x-2 mt-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                        selectedImage === product.image_url 
                          ? 'border-amber-400' 
                          : 'border-transparent hover:border-amber-400/50'
                      }`}
                      onClick={() => setSelectedImage(product.image_url)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            {/* Основная информация */}
            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    {product.category_id}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <span className="text-white font-semibold">4.8</span>
                    <span className="text-white/60 text-sm">(127 отзывов)</span>
                  </div>
                </div>
                <CardTitle className="text-3xl text-white mb-2">{product.name}</CardTitle>
                <CardDescription className="text-amber-300 text-lg">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Цена */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-amber-400">{product.price}₴</div>
                      {product.original_price && product.original_price > product.price && (
                        <div className="text-white/60 line-through">{product.original_price}₴</div>
                      )}
                    </div>
                    {product.original_price && product.original_price > product.price && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                      </Badge>
                    )}
                  </div>

                  {/* Количество */}
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-semibold">Количество:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      >
                        -
                      </Button>
                      <span className="text-white font-semibold min-w-[2rem] text-center">{quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQuantity(quantity + 1)}
                        className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="space-y-3">
                    {isInCart ? (
                      <Button
                        disabled
                        className="w-full py-4 bg-emerald-600/20 text-emerald-400 border-emerald-500/30 cursor-not-allowed"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Товар уже в корзине
                      </Button>
                    ) : (
                      <Button
                        onClick={handleAddToCart}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Добавить в корзину
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      className="w-full py-4 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Добавить в избранное
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Характеристики */}
            {product.features && product.features.length > 0 && (
              <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Package className="w-5 h-5 mr-2 text-amber-400" />
                    Характеристики
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-white/90">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Информация о доставке */}
            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-emerald-400" />
                  Информация о доставке
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-white font-semibold">Время доставки</div>
                      <div className="text-white/80 text-sm">5 минут - 2 часа</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-white font-semibold">Гарантия</div>
                      <div className="text-white/80 text-sm">100% гарантия качества</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Tag className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white font-semibold">Официальный товар</div>
                      <div className="text-white/80 text-sm">Лицензированный продукт</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Похожие товары */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Похожие товары
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.category_id === product.category_id && p.id !== product.id)
              .slice(0, 4)
              .map((similarProduct) => (
                <Card 
                  key={similarProduct.id}
                  className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => navigate(`/product/${similarProduct.id}`)}
                >
                  <CardContent className="p-4">
                    <img
                      src={similarProduct.image_url || '/placeholder.svg'}
                      alt={similarProduct.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                      {similarProduct.name}
                    </h3>
                    <div className="text-amber-400 font-bold">{similarProduct.price}₴</div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
