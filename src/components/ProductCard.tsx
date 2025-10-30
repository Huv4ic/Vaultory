import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ShoppingCart, Heart, Zap } from 'lucide-react';
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
      <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-2 group overflow-hidden flex flex-col h-[500px]">
        
        {/* Изображение */}
        <div className="relative h-56 overflow-hidden flex-shrink-0 rounded-t-3xl bg-[#1c1c1c]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />
          
          {/* Скидочный бейдж */}
          {original_price && original_price > price && (
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-[#a31212] text-white px-3 py-1.5 rounded-full text-xs font-bold">
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
            className="absolute top-4 right-4 z-20 bg-[#181818] hover:bg-[#1c1c1c] transition-all duration-300 p-2 h-10 w-10 rounded-full border border-[#1c1c1c] hover:border-[#a31212]"
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${
                isFavorite(id) 
                  ? 'text-[#a31212] fill-current' 
                  : 'text-[#a0a0a0] hover:text-[#a31212]'
              }`} 
            />
          </Button>
        </div>

        {/* Нижняя часть с информацией */}
        <div className="relative flex-1 flex flex-col bg-[#1c1c1c] rounded-b-3xl p-5">
          <div className="flex-1 flex flex-col justify-center text-center">
            {/* Название товара */}
            <h3 className="text-[#f0f0f0] font-bold text-2xl mb-4 line-clamp-3 tracking-wide min-h-[3.5rem] flex items-center justify-center text-center leading-tight">
              {getProductTranslation(id, 'name', name)}
            </h3>
            
            {/* Цены */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              {original_price && original_price > price ? (
                <>
                  <span className="text-[#a0a0a0] line-through text-lg font-medium">
                    ${original_price}
                  </span>
                  <span className="text-[#f0f0f0] font-black text-4xl">
                    ${price}
                  </span>
                </>
              ) : (
                <span className="text-[#f0f0f0] font-black text-4xl">
                  ${price}
                </span>
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
                className="flex-1 group relative h-12 px-4 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
                title="Купить сейчас"
              >
                {/* Контент кнопки */}
                <div className="relative z-10 flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-1" />
                  <span className="text-base">Купить</span>
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
              className={`group relative h-12 w-12 p-0 rounded-full transition-all duration-300 hover:scale-105 ${
                isInCart 
                  ? 'bg-[#a31212] hover:bg-[#8a0f0f] text-white' 
                  : 'bg-[#1c1c1c] hover:bg-[#a31212] text-[#a0a0a0] hover:text-white border border-[#1c1c1c] hover:border-[#a31212]'
              }`}
              title={isInCart ? t('В корзине') : t('Добавить в корзину')}
            >
              {/* Иконка корзины */}
              <ShoppingCart className={`w-6 h-6 relative z-10 transition-all duration-300 ${
                isInCart ? 'animate-bounce' : 'group-hover:scale-105'
              }`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
