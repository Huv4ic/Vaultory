import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [gameCategory, setGameCategory] = useState<GameCategory | null>(null);
  const [subcategories, setSubcategories] = useState<GameSubcategory[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const { telegramUser } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (categoryId) {
      fetchGameCategory();
      fetchSubcategories();
    }
  }, [categoryId]);

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

  const handleSubcategoryClick = (subcategory: GameSubcategory) => {
    navigate(`/category/${categoryId}/subcategory/${subcategory.id}`);
  };

  const getSubcategoryIcon = (slug: string) => {
    const iconMap: { [key: string]: string } = {
      'accounts': '👤',
      'currency': '💰',
      'promotions': '🎯',
      'skins': '🎨',
      'items': '📦',
      'boost': '⚡',
      'money': '💵',
      'uc': '💎',
      'robux': '💎',
      'keys': '🔑',
    };
    return iconMap[slug] || '📂';
  };

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!gameCategory) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-xl">Категория не найдена</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />
      
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
            <p className="text-xl text-gray-300">Выберите подкатегорию</p>
          </div>
        </div>

        {/* Кнопка назад */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 px-4 py-2 bg-[#a31212] hover:bg-[#8a0f0f] text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
      </div>

      {/* Контент */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Выберите подкатегорию</h2>
          <p className="text-gray-400">Выберите нужную подкатегорию для просмотра товаров</p>
        </div>

        {subcategories.length > 0 ? (
          <div className={`grid gap-6 ${
            subcategories.length === 1 
              ? 'grid-cols-1 max-w-sm mx-auto' 
              : subcategories.length === 2 
                ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {subcategories.map((sub, index) => (
              <div
                key={sub.id}
                onClick={() => handleSubcategoryClick(sub)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700 hover:border-[#a31212] transition-all duration-300">
                  <div className="text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {getSubcategoryIcon(sub.slug)}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{sub.name}</h3>
                    <p className="text-gray-400 text-sm">Нажмите для просмотра товаров</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-4">Подкатегории не найдены</div>
            <p className="text-gray-500">
              Для этой категории пока не созданы подкатегории
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}