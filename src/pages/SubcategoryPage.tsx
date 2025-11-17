import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';

interface GameCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  image_url?: string;
}

interface GameSubcategory {
  id: string;
  game_category_id: string;
  name: string;
  name_en?: string;
  name_ru?: string;
  slug: string;
  order_index: number;
  is_active: boolean;
}

export default function SubcategoryPage() {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [gameCategory, setGameCategory] = useState<GameCategory | null>(null);
  const [subcategory, setSubcategory] = useState<GameSubcategory | null>(null);
  const [subcategories, setSubcategories] = useState<GameSubcategory[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const { telegramUser } = useAuth();
  const { t } = useLanguage();
  const { products, categories, loading, error } = useProducts();
  const { items, addItem } = useCart();

  useEffect(() => {
    if (categoryId) {
      fetchGameCategory();
      fetchSubcategories();
    }
  }, [categoryId]);

  useEffect(() => {
    if (subcategoryId && subcategories.length > 0) {
      const foundSubcategory = subcategories.find(sub => sub.id === subcategoryId);
      if (foundSubcategory) {
        setSubcategory(foundSubcategory);
      }
    }
  }, [subcategoryId, subcategories]);

  useEffect(() => {
    filterProducts();
  }, [products, subcategory, searchQuery, sortOrder]);

  const fetchGameCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('game_categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (error) throw error;
      setGameCategory(data);
    } catch (err) {
      console.error('Error fetching game category:', err);
    } finally {
      setCategoryLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('game_subcategories')
        .select('*')
        .eq('game_category_id', categoryId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSubcategories(data || []);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const filterProducts = () => {
    if (!subcategory) {
      setFilteredProducts([]);
      return;
    }

      let filtered = products.filter((product: any) => {
      // Фильтруем по подкатегории
      const matchesSubcategory = product.subcategory_id === subcategory.id;
      
      // Если есть поисковый запрос, также фильтруем по нему
      if (searchQuery) {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             product.game?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             product.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSubcategory && matchesSearch;
      }
      
      return matchesSubcategory;
    });

    // Сортировка по цене
    const sorted = [...filtered].sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

    setFilteredProducts(sorted);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSubcategoryClick = (subcategory: GameSubcategory) => {
    navigate(`/category/${categoryId}/subcategory/${subcategory.id}`);
  };

  const handleBackToCategories = () => {
    navigate(`/category/${categoryId}`);
  };

  if (categoryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!gameCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Категория не найдена</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header с изображением категории */}
      <div className="relative">
        {gameCategory.image_url ? (
          <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${gameCategory.image_url})` }}>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ) : (
          <div className={`h-64 bg-gradient-to-br ${gameCategory.color} flex items-center justify-center`}>
            <div className="text-6xl">{gameCategory.icon}</div>
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-black mb-4">{gameCategory.name}</h1>
          </div>
        </div>

        {/* Кнопка назад */}
        <button
          onClick={handleBackToCategories}
          className="absolute top-4 left-4 px-4 py-2 bg-[#FFD700] hover:bg-[#FFC107] text-[#121212] hover-lift rounded-lg transition-colors"
        >
          ← Назад к категориям
        </button>
      </div>

      {/* Контент */}
      <div className="container mx-auto px-4 py-8">
        {!subcategory ? (
          // Показываем подкатегории
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Выберите подкатегорию</h2>
              <p className="text-gray-400">Выберите нужную подкатегорию для просмотра товаров</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategories.map((sub, index) => (
                <div
                  key={sub.id}
                  onClick={() => handleSubcategoryClick(sub)}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700 hover:border-[#FFD700]/50 hover-lift hover-glow transition-all duration-300">
                    <div className="text-center">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {sub.slug === 'accounts' && '👤'}
                        {sub.slug === 'currency' && '💰'}
                        {sub.slug === 'promotions' && '🎯'}
                        {sub.slug === 'skins' && '🎨'}
                        {sub.slug === 'items' && '📦'}
                        {sub.slug === 'boost' && '⚡'}
                        {sub.slug === 'money' && '💵'}
                        {sub.slug === 'uc' && '💎'}
                        {sub.slug === 'robux' && '💎'}
                        {sub.slug === 'keys' && '🔑'}
                        {!['accounts', 'currency', 'promotions', 'skins', 'items', 'boost', 'money', 'uc', 'robux', 'keys'].includes(sub.slug) && '📂'}
                      </div>
                      <h3 className="text-xl font-bold text-white">{sub.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Показываем товары подкатегории
          <div ref={productsSectionRef}>
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-3xl font-bold text-white mb-1">Товары в категории "{subcategory.name}"</h2>
                  <p className="text-gray-400">Найдено товаров: {filteredProducts.length}</p>
                </div>
                <button
                  onClick={toggleSortOrder}
                  className="px-4 py-2 rounded-lg bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] hover:border-[#FFD700]/50 hover-lift hover-glow text-white transition-colors"
                  title="Сортировать по цене"
                >
                  {sortOrder === 'desc' ? 'Сортировать: по убыванию' : 'Сортировать: по возрастанию'}
                </button>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      original_price={product.original_price}
                      images={product.images}
                      image_url={product.image_url}
                      category_id={product.category_id}
                      game={product.game}
                      rating={product.rating}
                      description={product.description}
                      isInCart={items.some(item => item.id === product.id)}
                      onAddToCart={() => addItem(product)}
                      onDetails={() => navigate(`/product/${product.id}`)}
                      onBuyNow={() => {
                        addItem(product);
                        navigate('/cart');
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 text-xl mb-4">Товары не найдены</div>
                <p className="text-gray-500">
                  {searchQuery 
                    ? `По запросу "${searchQuery}" в подкатегории "${subcategory.name}" товары не найдены`
                    : `В подкатегории "${subcategory.name}" пока нет товаров`
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
