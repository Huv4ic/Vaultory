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
      className="relative group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Основная карточка - минималистичный дизайн */}
      <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 group overflow-hidden h-full flex flex-col shadow-2xl hover:shadow-white/10">
        
        {/* Тонкая светящаяся линия сверху */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Изображение */}
        <div className="relative h-52 overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
          />
          
          {/* Overlay при наведении */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Скидочный бейдж */}
          {original_price && original_price > price && (
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                -{Math.round(((original_price - price) / original_price) * 100)}%
              </div>
            </div>
          )}

          {/* Кнопка избранного */}
          <Button
            onClick={handleFavoriteClick}
            disabled={loading}
            size="sm"
            variant="ghost"
            className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all duration-300 p-2 h-10 w-10 rounded-full border border-white/20 hover:border-white/40"
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${
                isFavorite(id) 
                  ? 'text-red-500 fill-current' 
                  : 'text-white hover:text-red-400'
              }`} 
            />
          </Button>
        </div>

        {/* Контент */}
        <div className="p-6 flex flex-col flex-1 min-h-0">
          {/* Название */}
          <h3 className="text-white font-semibold mb-4 line-clamp-2 text-lg leading-tight group-hover:text-white/90 transition-colors duration-300">
            {getProductTranslation(id, 'name', name)}
          </h3>

          {/* Цена */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-white">
                  {price}₴
                </span>
                {original_price && original_price > price && (
                  <span className="text-gray-400 line-through text-lg font-medium">
                    {original_price}₴
                  </span>
                )}
              </div>
              {sales && (
                <div className="flex items-center">
                  <div className="px-3 py-1.5 bg-white/10 text-white/80 text-xs font-medium rounded-full border border-white/20 backdrop-blur-sm">
                    <Star className="w-3 h-3 inline mr-1.5" />
                    {sales} {t('продаж')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="p-6 pt-0 mt-auto">
          <div className="flex flex-col space-y-3 w-full">
            <Button
              onClick={onDetails}
              variant="outline"
              size="sm"
              className="w-full border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] h-12 text-sm font-medium rounded-2xl backdrop-blur-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t('Подробнее')}
            </Button>

            <Button
              onClick={onAddToCart}
              size="sm"
              className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] h-12 text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isInCart ? t('В корзине') : t('В корзину')}
            </Button>
          </div>
        </div>

        {/* Светящийся эффект при наведении */}
        <div className="absolute inset-0 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default ProductCard;
