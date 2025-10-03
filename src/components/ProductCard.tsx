import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ShoppingCart, Star, Heart, Zap } from 'lucide-react';
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
  onBuyNow?: () => void;
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
  onDetails,
  onBuyNow
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
      <div className="relative bg-gray-900 rounded-3xl border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-500 transform hover:scale-[1.03] hover:-translate-y-3 group overflow-hidden flex flex-col shadow-2xl hover:shadow-cyan-500/30 h-[500px]">
        
        {/* Светящиеся эффекты */}
        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-xl pointer-events-none"></div>
        
        {/* Изображение с пьедесталом */}
        <div className="relative h-56 overflow-hidden flex-shrink-0 rounded-t-3xl bg-gray-800">
          {/* Пьедестал с свечением */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-10 bg-gray-700 rounded-full shadow-2xl"></div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-cyan-500/30 rounded-full blur-md shadow-cyan-500/50"></div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-18 h-6 bg-cyan-400/20 rounded-full blur-lg"></div>
          
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-110"
          />
          
          {/* Светящийся эффект при наведении */}
          <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          {/* Скидочный бейдж */}
          {original_price && original_price > price && (
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-emerald-500/50 animate-pulse">
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
            className="absolute top-4 right-4 z-20 bg-gray-800/80 hover:bg-gray-700/90 transition-all duration-300 p-2 h-10 w-10 rounded-full border border-gray-600/50 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/30"
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${
                isFavorite(id) 
                  ? 'text-red-500 fill-current drop-shadow-lg' 
                  : 'text-gray-300 hover:text-red-400 hover:drop-shadow-lg'
              }`} 
            />
          </Button>
        </div>

        {/* Нижняя часть с информацией */}
        <div className="relative flex-1 flex flex-col bg-gray-800 rounded-b-3xl p-5">
          <div className="flex-1 flex flex-col justify-center text-center">
            {/* Название товара - красивый стильный текст */}
            <h3 className="text-white font-bold text-xl mb-4 line-clamp-2 tracking-wide drop-shadow-lg h-14 flex items-center justify-center">
              {getProductTranslation(id, 'name', name)}
            </h3>
            
            {/* Цены - стильные и яркие */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              {original_price && original_price > price ? (
                <>
                  <span className="text-gray-400 line-through text-base font-medium">
                    {original_price}₴
                  </span>
                  <span className="text-cyan-400 font-black text-2xl drop-shadow-lg shadow-cyan-500/50">
                    {price}₴
                  </span>
                </>
              ) : (
                <span className="text-cyan-400 font-black text-2xl drop-shadow-lg shadow-cyan-500/50">
                  {price}₴
                </span>
              )}
            </div>
            
            {/* Статистика продаж - стилизованная */}
            <div className="flex items-center justify-center mb-4 h-8">
              {sales && (
                <div className="px-4 py-2 bg-gray-700/50 text-cyan-300 text-sm font-medium rounded-full border border-cyan-400/30 backdrop-blur-sm shadow-lg">
                  <Star className="w-4 h-4 inline mr-2 text-cyan-400" />
                  {sales} {t('продаж')}
                </div>
              )}
            </div>
          </div>
          
          {/* Кнопки действий */}
          <div className="flex gap-2 items-center">
            {/* Кнопка "Купить" */}
            {onBuyNow && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyNow();
                }}
                size="sm"
                className="flex-1 group relative h-12 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-600/50 hover:shadow-emerald-500/70"
                title="Купить сейчас"
              >
                {/* Светящийся эффект */}
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse pointer-events-none"></div>
                
                {/* Контент кнопки */}
                <div className="relative z-10 flex items-center justify-center">
                  <Zap className="w-4 h-4 mr-1" />
                  <span className="text-sm">Купить</span>
                </div>
              </Button>
            )}
            
            {/* Кнопка добавления в корзину */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              size="sm"
              className={`group relative h-12 w-12 p-0 rounded-full transition-all duration-300 hover:scale-110 ${
                isInCart 
                  ? 'bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/50 hover:shadow-green-400/70' 
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70'
              }`}
              title={isInCart ? t('В корзине') : t('Добавить в корзину')}
            >
              {/* Светящийся эффект */}
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse pointer-events-none"></div>
              
              {/* Иконка корзины */}
              <ShoppingCart className={`w-6 h-6 relative z-10 transition-all duration-300 ${
                isInCart ? 'animate-bounce' : 'group-hover:scale-110'
              }`} />
              
              {/* Дополнительные светящиеся эффекты */}
              {!isInCart && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
