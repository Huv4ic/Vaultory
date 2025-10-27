import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Star, ArrowLeft, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

interface GameCategory {
  id: string;
  name: string;
  icon: string;
  image_url?: string;
}

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [gameCategory, setGameCategory] = useState<GameCategory | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const { telegramUser } = useAuth();
  const { t } = useLanguage();
  const { products, categories, loading, error } = useProducts();
  const { items, addItem } = useCart();

  // Функция для сопоставления игры с категорией
  const matchGameToCategory = (gameName: string): string | null => {
    if (!gameName) return null;
    
    const lowerGameName = gameName.toLowerCase();
    if (lowerGameName.includes('steam') || lowerGameName.includes('стим')) return 'steam';
    if (lowerGameName.includes('minecraft') || lowerGameName.includes('майнкрафт')) return 'minecraft';
    if (lowerGameName.includes('roblox') || lowerGameName.includes('роблокс')) return 'roblox';
    if (lowerGameName.includes('fortnite') || lowerGameName.includes('фортнайт')) return 'fortnite';
    if (lowerGameName.includes('valorant') || lowerGameName.includes('валорант')) return 'valorant';
    if (lowerGameName.includes('cs2') || lowerGameName.includes('cs:2') || lowerGameName.includes('counter-strike')) return 'cs2';
    if (lowerGameName.includes('brawl stars') || lowerGameName.includes('браво старс')) return 'brawl_stars';
    if (lowerGameName.includes('gta') || lowerGameName.includes('grand theft auto')) return 'gta';
    if (lowerGameName.includes('rocket league') || lowerGameName.includes('rocketleague')) return 'rocket_league';
    if (lowerGameName.includes('spotify')) return 'spotify';
    if (lowerGameName.includes('world of tanks') || lowerGameName.includes('worldoftanks') || lowerGameName.includes('wot')) return 'world_of_tanks';
    if (lowerGameName.includes('telegram') || lowerGameName.includes('звезды') || (lowerGameName.includes('stars') && !lowerGameName.includes('brawl'))) return 'telegram_stars';
    
    return null;
  };

  // Загружаем данные категории
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      
      try {
        setCategoryLoading(true);
        const { data, error } = await supabase
          .from('game_categories')
          .select('*')
          .eq('id', categoryId)
          .single();

        if (error) {
          console.error('Ошибка загрузки категории:', error);
          return;
        }

        setGameCategory(data);
      } catch (error) {
        console.error('Ошибка при загрузке категории:', error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  // Фильтруем товары по категории и поиску
  useEffect(() => {
    if (!products.length || !categoryId) return;

    let filtered = [...products];

    // 1. Фильтрация по категории
    filtered = filtered.filter(product => {
      // Сначала проверяем game_category_id (приоритет)
      if (product.game_category_id) {
        return product.game_category_id === categoryId;
      }
      // Если game_category_id нет, используем старую логику
      const gameName = product.game || '';
      const matchedCategory = matchGameToCategory(gameName);
      return matchedCategory === categoryId;
    });

    // 2. Фильтрация по поиску
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.game && product.game.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 3. Сортировка
    filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    setFilteredProducts(filtered);
  }, [products, categoryId, searchQuery]);

  // Автоматический скролл при поиске
  useEffect(() => {
    if (searchQuery.trim() && productsSectionRef.current) {
      setTimeout(() => {
        productsSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [searchQuery]);

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#a31212] mb-4"></div>
          <p className="text-[#a0a0a0] text-lg">Загрузка категории...</p>
        </div>
      </div>
    );
  }

  if (!gameCategory) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#f0f0f0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#f0f0f0] mb-4">Категория не найдена</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-semibold rounded-lg transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#f0f0f0]">
      <Header />
      
      {/* Hero секция с крупной фотографией категории */}
      <section className="relative">
        {/* Фоновое изображение */}
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          {gameCategory.image_url ? (
            <img
              src={gameCategory.image_url}
              alt={gameCategory.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">{gameCategory.icon}</div>
                <h1 className="text-4xl font-bold text-[#f0f0f0]">{gameCategory.name}</h1>
              </div>
            </div>
          )}
          
          {/* Градиентный оверлей */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
          
          {/* Кнопка назад */}
          <div className="absolute top-6 left-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-[#181818]/80 backdrop-blur-sm text-[#f0f0f0] rounded-lg hover:bg-[#181818] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </button>
          </div>
          
          {/* Заголовок категории */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-8 h-8 text-[#a31212]" />
              <h1 className="text-4xl md:text-6xl font-black text-[#f0f0f0]">
                {gameCategory.name.toUpperCase()}
              </h1>
            </div>
            <p className="text-lg text-[#a0a0a0] max-w-2xl">
              Все товары для игры {gameCategory.name} в одном месте
            </p>
          </div>
        </div>
      </section>

      {/* Поиск по категории */}
      <section className="py-8 px-4 bg-[#121212]">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#a31212]" />
              <input
                type="text"
                placeholder={`Поиск в ${gameCategory.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#181818] border border-[#1c1c1c] rounded-lg text-[#f0f0f0] placeholder-[#a0a0a0] focus:border-[#a31212] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Товары */}
      <section ref={productsSectionRef} className="py-16 px-4 bg-[#121212]">
        <div className="container mx-auto">
          {/* Заголовок товаров */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#f0f0f0] mb-4">
              {searchQuery.trim() ? `Результаты поиска` : `Товары ${gameCategory.name}`}
            </h2>
            {searchQuery.trim() && (
              <p className="text-[#a0a0a0]">
                Найдено товаров: <span className="text-[#f0f0f0] font-semibold">{filteredProducts.length}</span>
              </p>
            )}
          </div>

          {/* Сетка товаров */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div className="w-24 h-24 mx-auto mb-6 bg-[#a31212]/20 rounded-3xl flex items-center justify-center border border-[#a31212]/30">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-2xl font-bold text-[#f0f0f0] mb-4">
                {searchQuery.trim() ? 'Ничего не найдено' : 'Товары скоро появятся!'}
              </h3>
              <p className="text-[#a0a0a0] text-lg">
                {searchQuery.trim() 
                  ? 'Попробуйте изменить поисковый запрос'
                  : 'В данной категории пока нет товаров'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
