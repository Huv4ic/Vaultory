import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { Star, ShoppingCart, Shield, Clock, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

const ProductPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { telegramUser } = useAuth();
  const { addItem, items } = useCart();
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Товар не найден</h1>
          <Link to="/catalog">
            <Button className="bg-gradient-to-r from-red-500 to-purple-600">
              Вернуться в каталог
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const totalPrice = product.price * quantity;
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!telegramUser) {
      alert('Войдите через Telegram, чтобы добавить в корзину!');
      return;
    }
    addItem(product, quantity);
  };

  const isInCart = items.some((item) => item.id === product.id);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/catalog" className="inline-flex items-center text-gray-400 hover:text-red-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к каталогу
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Изображение товара */}
          <div className="relative">
            <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discount}%
                </div>
              )}
            </div>
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-red-400 mb-2">{product.category}</div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-400">({product.sales} продаж)</span>
              </div>
            </div>

            {/* Цена */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-white">{product.price}₽</div>
                  {product.originalPrice && (
                    <div className="text-gray-400 line-through">{product.originalPrice}₽</div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {quantity > 1 && (
                <div className="text-right text-sm text-gray-400 mb-4">
                  Общая стоимость: <span className="text-white font-semibold">{totalPrice}₽</span>
                </div>
              )}

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none text-lg py-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/25"
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isInCart ? 'В корзине' : 'Добавить в корзину'}
              </Button>
            </div>

            {/* Гарантии */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <Shield className="w-8 h-8 text-red-500 mb-2" />
                <h3 className="font-semibold mb-1">Гарантия качества</h3>
                <p className="text-sm text-gray-400">100% безопасная покупка</p>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <Clock className="w-8 h-8 text-red-500 mb-2" />
                <h3 className="font-semibold mb-1">Быстрая доставка</h3>
                <p className="text-sm text-gray-400">Мгновенная доставка</p>
              </div>
            </div>

            {/* Описание */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-3">Описание товара</h3>
              <p className="text-gray-300 leading-relaxed">
                Премиум товар для {product.game}. Высочайшее качество и мгновенная доставка гарантированы. 
                Этот товар пользуется популярностью среди игроков благодаря своей эффективности и надежности.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
