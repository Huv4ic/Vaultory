import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ShoppingCart, Star, Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useFavorites } from '@/hooks/useFavorites';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  images?: string[];
  image_url?: string;
  category_id?: string;
  game?: string;
  rating?: number;
  sales?: number;
  description?: string;
  isInCart: boolean;
  onAddToCart: () => void;
  onDetails: () => void;
}

const ProductCard = ({
  id,
  name,
  price,
  original_price,
  images,
  image_url,
  category_id,
  game,
  rating,
  sales,
  description,
  isInCart,
  onAddToCart,
  onDetails
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite, loading } = useFavorites();

  const handleFavoriteClick = async () => {
    await toggleFavorite(id);
  };

  // Используем изображение из массива или из image_url
  const image = (images && images.length > 0) ? images[0] : (image_url || '/placeholder.svg');

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group overflow-hidden h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Изображение */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Оверлей с градиентом */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Категория */}
        {category_id && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-emerald-600 text-white text-xs font-medium rounded-lg shadow-lg">
              {category_id}
            </span>
          </div>
        )}

        {/* Кнопка избранного */}
        <Button
          onClick={handleFavoriteClick}
          disabled={loading}
          size="sm"
          variant="ghost"
          className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all duration-300 p-1 h-8 w-8 rounded-lg"
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${
              isFavorite(id) 
                ? 'text-red-500 fill-current' 
                : 'text-white hover:text-red-400'
            }`} 
          />
        </Button>
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
            {original_price && original_price > price && (
              <span className="text-gray-400 line-through text-xs">
                {original_price}₴
              </span>
            )}
            {sales && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-lg border border-amber-500/30">
                {sales} продаж
              </span>
            )}
          </div>
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
