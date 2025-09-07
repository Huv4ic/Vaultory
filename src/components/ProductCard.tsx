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
      className="relative group h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onDetails}
      title={t('Нажмите для просмотра товара')}
    >
      {/* Основная карточка */}
      <div className="relative bg-gray-900 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 group overflow-hidden h-full flex flex-col shadow-lg hover:shadow-xl">
        
        {/* Изображение */}
        <div className="relative h-48 overflow-hidden flex-shrink-0 rounded-t-2xl bg-gray-800">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />
          
          {/* Скидочный бейдж */}
          {original_price && original_price > price && (
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                -{Math.round(((original_price - price) / original_price) * 100)}%
              </div>
            </div>
          )}

          {/* Кнопка избранного */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteClick();
            }}
            disabled={loading}
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/70 transition-all duration-300 p-1.5 h-8 w-8 rounded-full"
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

        {/* Нижняя часть с информацией */}
        <div className="relative flex-1 flex flex-col bg-gray-800 rounded-b-2xl p-4">
          <div className="flex-1 flex flex-col justify-center">
            {/* Название товара */}
            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 text-center">
              {getProductTranslation(id, 'name', name)}
            </h3>
            
            {/* Цены */}
            <div className="flex items-center justify-center space-x-2 mb-2">
              {original_price && original_price > price ? (
                <>
                  <span className="text-gray-400 line-through text-xs">
                    {original_price}₴
                  </span>
                  <span className="text-white font-bold text-lg">
                    {price}₴
                  </span>
                </>
              ) : (
                <span className="text-white font-bold text-lg">
                  {price}₴
                </span>
              )}
            </div>
            
            {/* Статистика продаж */}
            {sales && (
              <div className="flex items-center justify-center">
                <div className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                  <Star className="w-3 h-3 inline mr-1" />
                  {sales} {t('продаж')}
                </div>
              </div>
            )}
          </div>
          
          {/* Кнопка добавления в корзину */}
          <div className="mt-3 flex justify-end">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              size="sm"
              className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 hover:scale-110"
              title={isInCart ? t('В корзине') : t('Добавить в корзину')}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
