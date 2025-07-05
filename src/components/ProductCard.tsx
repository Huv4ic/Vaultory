import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  sales: number;
}

const ProductCard = ({ id, name, price, originalPrice, image, category, rating, sales }: ProductCardProps) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const { items, addItem } = useCart();
  const inCart = items.some(i => i.id === id);

  return (
    <div className="group bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/10">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{discount}%
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <div className="text-xs text-red-400 mb-1 font-medium">{category}</div>
        <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
          {name}
        </h3>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-yellow-400 text-xs font-medium">{rating}</span>
          </div>
          <span className="text-gray-400 text-xs">({sales} продаж)</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold text-lg">{price}₽</span>
            {originalPrice && (
              <span className="text-gray-400 text-sm line-through">{originalPrice}₽</span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Link to={`/product/${id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-2 border-gray-600 text-gray-300 font-semibold rounded-lg shadow transition-all duration-200 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-500/10"
            >
              Подробнее
            </Button>
          </Link>
          <Button
            size="sm"
            className={`w-12 h-12 flex items-center justify-center rounded-lg shadow-lg font-bold text-white bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 transition-all duration-200 ${inCart ? 'opacity-60 cursor-not-allowed' : ''}`}
            onClick={() => addItem({ id, name, price, image })}
            disabled={inCart}
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
