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
      <div className="relative bg-gradient-to-br from-slate-900/95 via-gray-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 group overflow-hidden h-full flex flex-col shadow-2xl hover:shadow-purple-500/30">
        
        {/* Анимированный фон с частицами */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-bounce"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-pink-400/40 rounded-full animate-bounce delay-700"></div>
        </div>

        {/* Изображение с эффектами в стиле GGFort */}
        <div className="relative h-48 overflow-hidden flex-shrink-0 rounded-t-2xl bg-gradient-to-br from-gray-800 to-gray-900">
          {/* Пьедестал как в GGFort */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-t from-gray-700 to-gray-600 rounded-full shadow-lg"></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-gradient-to-t from-purple-600/30 to-purple-500/20 rounded-full blur-sm"></div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 z-10"></div>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter brightness-95 group-hover:brightness-105"
          />
          
          {/* Голографический эффект */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform skew-x-12 group-hover:translate-x-full"></div>
          
          {/* Светящаяся рамка снизу */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>

          {/* Скидочный бейдж - маленький сверху */}
          {original_price && original_price > price && (
            <div className="absolute top-2 left-2 z-20">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
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
            className="absolute top-2 right-2 z-20 bg-black/50 backdrop-blur-md hover:bg-black/70 transition-all duration-300 p-1.5 h-8 w-8 rounded-full border border-gray-500/30 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-500/50"
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-300 ${
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
          <div className="relative bg-gradient-to-r from-purple-600/95 via-pink-600/95 to-blue-600/95 backdrop-blur-xl rounded-b-2xl p-3 flex-1 flex flex-col justify-center group-hover:from-purple-500/95 group-hover:via-pink-500/95 group-hover:to-blue-500/95 transition-all duration-500">
            {/* Светящиеся эффекты */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-b-2xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-purple-500/50"></div>
            
            <div className="relative z-10 text-center">
              {/* Название товара */}
              <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 drop-shadow-lg">
                {getProductTranslation(id, 'name', name)}
              </h3>
              
              {/* Цены встроенные в дизайн */}
              <div className="flex items-center justify-center space-x-2 mb-2">
                {original_price && original_price > price ? (
                  <>
                    <span className="text-gray-300 line-through text-xs font-medium">
                      {original_price}₴
                    </span>
                    <span className="text-white font-black text-lg drop-shadow-lg">
                      {price}₴
                    </span>
                  </>
                ) : (
                  <span className="text-white font-black text-lg drop-shadow-lg">
                    {price}₴
                  </span>
                )}
              </div>
              
              {/* Статистика продаж */}
              {sales && (
                <div className="flex items-center justify-center">
                  <div className="px-2 py-1 bg-white/20 text-white/90 text-xs font-medium rounded-full border border-white/30 backdrop-blur-sm">
                    <Star className="w-3 h-3 inline mr-1" />
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
            <div className="absolute inset-0 bg-white/15 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            
            {/* Кнопка добавления в корзину - отдельная */}
            <div className="absolute bottom-2 right-2 z-20">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart();
                }}
                size="sm"
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 rounded-full transition-all duration-300 hover:scale-110"
                title={isInCart ? t('В корзине') : t('Добавить в корзину')}
              >
                <ShoppingCart className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Магический свет при наведении */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        {/* Дополнительное свечение краев */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none shadow-inset shadow-purple-500/20"></div>
      </div>

      {/* Отражение карточки (3D эффект) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-slate-800/20 to-gray-900/20 backdrop-blur-xl rounded-2xl border border-gray-700/20 transition-all duration-700 transform translate-y-1 translate-x-1 -z-10 opacity-0 group-hover:opacity-60 group-hover:translate-y-2 group-hover:translate-x-2"></div>
    </div>
  );
};

export default ProductCard;
