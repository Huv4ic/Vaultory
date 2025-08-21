import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ShoppingCart, Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
  rating?: number;
  sales?: number;
  isInCart: boolean;
  onAddToCart: () => void;
  onDetails: () => void;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating,
  sales,
  isInCart,
  onAddToCart,
  onDetails
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group overflow-hidden h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Изображение */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={image || '/placeholder.svg'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Оверлей с градиентом */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Категория */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-emerald-600 text-white text-xs font-medium rounded-lg shadow-lg">
              {category}
            </span>
          </div>
        )}

        {/* Рейтинг */}
        {rating && (
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="text-white text-xs font-medium">{rating}</span>
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-4 flex flex-col flex-1 min-h-0">
        {/* Название */}
        <h3 className="text-white font-semibold mb-3 line-clamp-2 group-hover:text-amber-300 transition-colors duration-300 text-sm leading-tight">
          {name}
        </h3>

        {/* Цена */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-amber-400">
              {price}₴
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-gray-400 line-through text-xs">
                {originalPrice}₴
              </span>
            )}
          </div>

          {/* Продажи */}
          {sales && (
            <span className="text-gray-400 text-xs">
              {sales} {t('продаж')}
            </span>
          )}
        </div>
      </div>

      {/* Кнопки - размещаем вертикально */}
      <div className="p-4 pt-0 mt-auto">
        <div className="flex flex-col space-y-2 w-full">
          <Button
            onClick={onDetails}
            variant="outline"
            size="sm"
            className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300 hover:scale-105 h-10 text-sm font-medium"
          >
            <Eye className="w-4 h-4 mr-2" />
            {t('Подробнее')}
          </Button>

          <Button
            onClick={onAddToCart}
            size="sm"
            className="w-full bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105 h-10 text-sm font-medium"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isInCart ? t('В корзине') : t('В корзину')}
          </Button>
        </div>
      </div>
      {/* Анимированное свечение при наведении */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-emerald-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;
