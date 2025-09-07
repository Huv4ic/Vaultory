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
      {/* Основная карточка в стиле GGFort */}
      <div className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 rounded-2xl border-2 border-purple-500/40 hover:border-purple-400/60 transition-all duration-500 transform hover:scale-[1.03] hover:-translate-y-3 group overflow-hidden h-full flex flex-col shadow-2xl hover:shadow-purple-500/40">
        
        {/* Светящаяся рамка */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Изображение с эффектами в стиле GGFort */}
        <div className="relative h-52 overflow-hidden flex-shrink-0 rounded-t-2xl bg-gradient-to-br from-gray-800 to-gray-900">
          {/* Пьедестал как в GGFort */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-10 bg-gradient-to-t from-gray-700 to-gray-600 rounded-full shadow-2xl"></div>
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-t from-purple-600/40 to-purple-500/30 rounded-full blur-md"></div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-transparent to-pink-600/15 z-10"></div>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
          />
          
          {/* Голографический эффект */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform skew-x-12 group-hover:translate-x-full"></div>

          {/* Скидочный бейдж - маленький сверху */}
          {original_price && original_price > price && (
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
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
            className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all duration-300 p-2 h-10 w-10 rounded-full border border-gray-500/40 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-500/50"
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${
                isFavorite(id) 
                  ? 'text-red-500 fill-current drop-shadow-lg' 
                  : 'text-white hover:text-red-400 hover:drop-shadow-lg'
              }`} 
            />
          </Button>
        </div>

        {/* Нижняя часть в стиле GGFort */}
        <div className="relative flex-1 flex flex-col">
          {/* Неоновый бар с информацией */}
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-b-2xl p-4 flex-1 flex flex-col justify-center group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-blue-500 transition-all duration-500">
            {/* Светящиеся эффекты */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-blue-500/40 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-b-2xl border-2 border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-2xl shadow-purple-500/60"></div>
            
            <div className="relative z-10 text-center">
              {/* Название товара */}
              <h3 className="text-white font-bold text-base mb-3 line-clamp-2 drop-shadow-lg">
                {getProductTranslation(id, 'name', name)}
              </h3>
              
              {/* Цены встроенные в дизайн */}
              <div className="flex items-center justify-center space-x-3 mb-3">
                {original_price && original_price > price ? (
                  <>
                    <span className="text-gray-300 line-through text-sm font-medium">
                      {original_price}₴
                    </span>
                    <span className="text-white font-black text-xl drop-shadow-lg">
                      {price}₴
                    </span>
                  </>
                ) : (
                  <span className="text-white font-black text-xl drop-shadow-lg">
                    {price}₴
                  </span>
                )}
              </div>
              
              {/* Статистика продаж */}
              {sales && (
                <div className="flex items-center justify-center">
                  <div className="px-3 py-1.5 bg-white/25 text-white text-xs font-medium rounded-full border border-white/40 backdrop-blur-sm">
                    <Star className="w-3 h-3 inline mr-1.5" />
                    {sales} {t('продаж')}
                  </div>
                </div>
              )}
            </div>
            
            {/* Интерактивная область - вся нижняя часть кликабельна для открытия товара */}
            <div 
              className="absolute inset-0 rounded-b-2xl cursor-pointer"
              onClick={onDetails}
              title={t('Нажмите для просмотра товара')}
            ></div>
            
            {/* Hover эффект для всей области */}
            <div className="absolute inset-0 bg-white/20 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            
            {/* Кнопка добавления в корзину - отдельная */}
            <div className="absolute bottom-3 right-3 z-20">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart();
                }}
                size="sm"
                className="h-10 w-10 p-0 bg-white/25 hover:bg-white/35 border border-white/40 hover:border-white/60 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                title={isInCart ? t('В корзине') : t('Добавить в корзину')}
              >
                <ShoppingCart className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Магический свет при наведении */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      </div>

      {/* Отражение карточки (3D эффект) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-slate-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl border border-gray-700/30 transition-all duration-700 transform translate-y-2 translate-x-2 -z-10 opacity-0 group-hover:opacity-80 group-hover:translate-y-3 group-hover:translate-x-3"></div>
    </div>
  );
};

export default ProductCard;
