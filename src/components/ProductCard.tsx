import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ShoppingCart, Star, Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useFavorites } from '@/hooks/useFavorites';
import { useTranslations } from '@/hooks/useTranslations';

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
  const { getProductTranslation } = useTranslations();

  const handleFavoriteClick = async () => {
    await toggleFavorite(id);
  };

  // Используем изображение из массива или из image_url
  const image = (images && images.length > 0) ? images[0] : (image_url || '/placeholder.svg');

  return (
    <div
      className="relative group perspective-1000 h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Основная карточка с 3D эффектом */}
      <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-700 transform hover:scale-105 hover:-translate-y-3 hover:rotate-y-12 group overflow-hidden h-full flex flex-col shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/30">
        
        {/* Анимированный фон с частицами */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-blue-600/10 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-pink-400/60 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-bounce delay-700"></div>
        </div>

        {/* Изображение с 3D эффектом */}
        <div className="relative h-48 overflow-hidden flex-shrink-0 rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20 z-10"></div>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3 filter brightness-110 contrast-110"
          />
          
          {/* Голографический эффект */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform skew-x-12 group-hover:translate-x-full"></div>

          {/* Скидочный бейдж */}
          {original_price && original_price > price && (
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-green-500/50 animate-pulse">
                -{Math.round(((original_price - price) / original_price) * 100)}%
              </div>
            </div>
          )}

          {/* Кнопка избранного с неоновым эффектом */}
          <Button
            onClick={handleFavoriteClick}
            disabled={loading}
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all duration-300 p-2 h-10 w-10 rounded-full border border-purple-500/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/50"
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${
                isFavorite(id) 
                  ? 'text-red-500 fill-current drop-shadow-lg' 
                  : 'text-white hover:text-red-400 hover:drop-shadow-lg'
              }`} 
            />
          </Button>

          {/* Светящаяся рамка снизу */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>

        {/* Контент с улучшенным дизайном */}
        <div className="p-5 flex flex-col flex-1 min-h-0 relative z-10">
          {/* Название с эффектом свечения */}
          <h3 className="text-white font-bold mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-blue-400 transition-all duration-500 text-base leading-tight drop-shadow-sm">
            {getProductTranslation(id, 'name', name)}
          </h3>

          {/* Цена с неоновым эффектом */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
                  {price}₴
                </span>
                {original_price && original_price > price && (
                  <span className="text-gray-500 line-through text-sm font-medium">
                    {original_price}₴
                  </span>
                )}
              </div>
              {sales && (
                <div className="flex items-center">
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30 backdrop-blur-sm">
                    <Star className="w-3 h-3 inline mr-1" />
                    {sales} {t('продаж')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Кнопки с улучшенным дизайном */}
        <div className="p-5 pt-0 mt-auto relative z-10">
          <div className="flex flex-col space-y-3 w-full">
            <Button
              onClick={onDetails}
              variant="outline"
              size="sm"
              className="w-full border-2 border-purple-500/40 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-200 transition-all duration-300 hover:scale-105 h-12 text-sm font-bold rounded-xl backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/30"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t('Подробнее')}
            </Button>

            <Button
              onClick={onAddToCart}
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 h-12 text-sm font-bold rounded-xl border border-purple-500/30 hover:border-purple-400 backdrop-blur-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isInCart ? t('В корзине') : t('В корзину')}
            </Button>
          </div>
        </div>

        {/* Магический свет при наведении */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        {/* Дополнительное свечение краев */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none shadow-inset shadow-purple-500/20"></div>
      </div>

      {/* Отражение карточки (3D эффект) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-gray-800/20 to-gray-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/10 transition-all duration-700 transform translate-y-1 translate-x-1 -z-10 opacity-0 group-hover:opacity-60 group-hover:translate-y-2 group-hover:translate-x-2"></div>
    </div>
  );
};

export default ProductCard;
