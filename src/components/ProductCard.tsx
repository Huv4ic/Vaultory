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
    <div className="rounded-2xl shadow-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex flex-col text-center transition-transform duration-200 hover:scale-105 min-h-[420px] h-full">
      <img src={image} alt={name} className="w-24 h-24 object-contain mx-auto mb-4 rounded-xl shadow-lg bg-white/10" />
      <div className="text-xl font-bold mb-1 text-white drop-shadow-lg animate-fade-in line-clamp-2 min-h-[2.5em]">{name}</div>
      <div className="text-base text-gray-100 mb-2 animate-fade-in line-clamp-1 min-h-[1.5em]">{category}</div>
      {originalPrice && (
        <div className="mb-2">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg mr-2">-{discount}%</span>
          <span className="line-through text-gray-400">{originalPrice}₽</span>
        </div>
      )}
      <div className="text-lg font-bold text-white mb-2 animate-fade-in">Цена: <span className="text-cyan-300">{price}₽</span></div>
      <div className="flex items-center justify-center space-x-2 mb-4">
        <span className="text-yellow-400 font-bold">★ {rating}</span>
        <span className="text-gray-300 text-sm">({sales} продаж)</span>
      </div>
      <div className="mt-auto w-full flex flex-col gap-2">
        <button
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200"
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
  );
};

export default ProductCard;
