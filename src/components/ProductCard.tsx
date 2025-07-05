import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  sales: number;
  isInCart: boolean;
  onAddToCart: () => void;
  onDetails: () => void;
}

const ProductCard = ({ id, name, price, originalPrice, image, category, rating, sales, isInCart, onAddToCart, onDetails }: ProductCardProps) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

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
          <button
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200 mb-2"
            onClick={onDetails}
          >
            Подробнее
          </button>
          <button
            className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200"
            onClick={onAddToCart}
            disabled={isInCart}
          >
            {isInCart ? 'В корзине' : 'В корзину'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
