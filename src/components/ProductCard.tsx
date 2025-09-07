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
      <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-2 group overflow-hidden h-full flex flex-col shadow-2xl hover:shadow-purple-500/20">
        
        {/* Светящиеся эффекты */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Изображение с пьедесталом */}
        <div className="relative h-52 overflow-hidden flex-shrink-0 rounded-t-2xl bg-gradient-to-br from-gray-800 to-gray-900">
          {/* Пьедестал как на скриншоте */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-t from-gray-700 to-gray-600 rounded-full shadow-2xl"></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-gradient-to-t from-purple-600/30 to-purple-500/20 rounded-full blur-sm"></div>
          
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 filter brightness-95 group-hover:brightness-105"
          />
          
          {/* Голографический эффект */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform skew-x-12 group-hover:translate-x-full"></div>
          
          {/* Скидочный бейдж */}
          {original_price && original_price > price && (
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
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
            className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/70 transition-all duration-300 p-1.5 h-8 w-8 rounded-full border border-gray-500/30 hover:border-gray-400"
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
        <div className="relative flex-1 flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 rounded-b-2xl p-4">
          <div className="flex-1 flex flex-col justify-center text-center">
            {/* Название товара - крупный текст как на скриншоте */}
            <h3 className="text-white font-bold text-lg mb-3 line-clamp-2">
              {getProductTranslation(id, 'name', name)}
            </h3>
            
            {/* Цены - крупные и яркие */}
            <div className="flex items-center justify-center space-x-3 mb-3">
              {original_price && original_price > price ? (
                <>
                  <span className="text-gray-400 line-through text-sm font-medium">
                    {original_price}₴
                  </span>
                  <span className="text-white font-black text-xl">
                    {price}₴
                  </span>
                </>
              ) : (
                <span className="text-white font-black text-xl">
                  {price}₴
                </span>
              )}
            </div>
            
            {/* Статистика продаж - стилизованная */}
            {sales && (
              <div className="flex items-center justify-center mb-3">
                <div className="px-3 py-1.5 bg-white/10 text-white text-xs font-medium rounded-full border border-white/20 backdrop-blur-sm">
                  <Star className="w-3 h-3 inline mr-1.5" />
                  {sales} {t('продаж')}
                </div>
              </div>
            )}
          </div>
          
          {/* Кнопка добавления в корзину - розовая как на скриншоте */}
          <div className="flex justify-end">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              size="sm"
              className="h-10 w-10 p-0 bg-pink-600 hover:bg-pink-700 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
              title={isInCart ? t('В корзине') : t('Добавить в корзину')}
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
