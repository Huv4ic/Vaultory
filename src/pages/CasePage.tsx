import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useCaseStats } from '../hooks/useCaseStats';
import { useInventory } from '../hooks/useInventory';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Package, ArrowLeft, Crown, Zap, Target, Shield } from 'lucide-react';
import CaseRoulette from '../components/CaseRoulette';

interface CaseItem {
  id: string;
  case_id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  drop_chance: number;
  image_url: string;
  price: number; // Добавляем поле цены
}

interface Case {
  id: string;
  name: string;
  game_id?: string;
  game?: string;
  price: number;
  image?: string;
  image_url?: string;
  description?: string;
  gradient?: string;
  icon?: string;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

const CasePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incrementCaseOpened } = useCaseStats();
  const { addItem } = useInventory();
  const { profile } = useAuth();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [caseItems, setCaseItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRoulette, setShowRoulette] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCaseData();
    }
  }, [id]);

  const fetchCaseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем данные кейса
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();

      if (caseError) throw caseError;

      // Преобразуем данные к правильному формату
      const formattedCase: Case = {
        ...caseData,
        image_url: caseData.image || '', // Используем поле image из базы
        game: 'Unknown Game' // Пока используем заглушку, так как в базе нет поля game
      };

      setCaseData(formattedCase);

      // Загружаем предметы кейса
      const { data: itemsData, error: itemsError } = await supabase
        .from('admin_case_items') // Используем admin_case_items вместо case_items
        .select('*')
        .eq('case_id', id)
        .order('name');

      if (itemsError) throw itemsError;

      // Преобразуем данные к правильному формату
      const formattedItems: CaseItem[] = (itemsData || []).map((item: any) => ({
        id: item.id,
        case_id: item.case_id,
        name: item.name,
        rarity: item.rarity,
        drop_chance: item.drop_chance || 0,
        image_url: item.image_url || '',
        price: item.price || 0 // Добавляем цену из базы
      }));

      setCaseItems(formattedItems);
      setLoading(false);

    } catch (err) {
      console.error('Error fetching case data:', err);
      setError('Ошибка при загрузке данных кейса');
      setLoading(false);
    }
  };

  const handleOpenCase = () => {
    // Проверяем, есть ли предметы в кейсе
    if (caseItems.length === 0) {
      alert('В этом кейсе нет предметов для открытия');
      return;
    }
    
    // Показываем рулетку
    setShowRoulette(true);
  };

  const handleCaseOpened = async (item: CaseItem) => {
    // Здесь можно добавить логику для добавления предмета в инвентарь
    console.log('🎉 Кейс открыт! Выпад предмет:', item);
    console.log('📦 Данные кейса:', caseData);
    
    // ДОБАВЛЯЕМ ПРЕДМЕТ В ИНВЕНТАРЬ
    // ВАЖНО: Эта функция вызывается только при нажатии "Добавить в инвентарь"
    // При нажатии "Продать" она НЕ вызывается
    try {
      const inventoryItem = {
        name: item.name,
        price: item.price, // Используем цену из CaseItem
        rarity: item.rarity,
        type: 'case_item', // Используем фиксированное значение
        caseId: item.case_id,
        case_name: caseData?.name || 'Неизвестный кейс',
        image: undefined, // У CaseItem нет поля image
        image_url: item.image_url,
        obtained_at: new Date().toISOString()
      };
      
      console.log('🎁 Создаем предмет для инвентаря:', inventoryItem);
      console.log('🔧 Вызываем addItem...');
      await addItem(inventoryItem);
      console.log('✅ Предмет успешно добавлен в инвентарь!');
    } catch (error) {
      console.error('❌ Ошибка при добавлении предмета в инвентарь:', error);
    }
    
    // Увеличиваем счетчик открытий кейса для статистики
    if (caseData && id) {
      try {
        // caseId уже является строкой из URL параметров
        const caseId = id;
        console.log('ID кейса из URL:', id, 'Тип:', typeof caseId);
        
        if (!caseId || caseId.trim() === '') {
          console.error('Некорректный ID кейса:', id);
          return;
        }
        
        await incrementCaseOpened(caseId, caseData.name, caseData.image_url);
        console.log('Статистика открытий кейса обновлена');
      } catch (err) {
        console.error('Ошибка обновления статистики:', err);
      }
    } else {
      console.error('Отсутствуют данные кейса или ID:', { caseData, id });
    }
    
    // НЕ закрываем рулетку автоматически - пользователь сам закроет её кнопкой "Закрыть"
    // Рулетка будет показывать результат до тех пор, пока пользователь не нажмет кнопку
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'epic':
        return <Zap className="w-4 h-4 text-purple-400" />;
      case 'rare':
        return <Target className="w-4 h-4 text-blue-400" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'text-yellow-400 border-yellow-400';
      case 'epic':
        return 'text-purple-400 border-purple-400';
      case 'rare':
        return 'text-blue-400 border-blue-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const getRarityName = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary':
        return 'Легендарный';
      case 'epic':
        return 'Эпический';
      case 'rare':
        return 'Редкий';
      default:
        return 'Обычный';
    }
  };

  // Функция для определения тематики кейса и стилей кнопки
  const getCaseTheme = (caseName: string) => {
    const name = caseName.toLowerCase();
    
    // Простые готовые стили для каждого кейса
    if (name.includes('феникс') || name.includes('phoenix')) {
      return "bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/30 border-0 text-sm sm:text-base";
    }
    
    if (name.includes('годзилла') || name.includes('godzilla')) {
      return "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 border-0 text-sm sm:text-base";
    }
    
    if (name.includes('гадюка') || name.includes('viper') || name.includes('змея') || name.includes('snake')) {
      return "bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30 border-0 text-sm sm:text-base";
    }
    
    if (name.includes('акула') || name.includes('shark') || name.includes('рыба') || name.includes('fish')) {
      return "bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-gray-500/30 border-0 text-sm sm:text-base";
    }
    
    if (name.includes('дракон') || name.includes('dragon')) {
      return "bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30 border-0 text-sm sm:text-base";
    }
    
    if (name.includes('единорог') || name.includes('unicorn')) {
      return "bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 hover:from-purple-500 hover:via-pink-600 hover:to-purple-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30 border-0 text-sm sm:text-base";
    }
    
    if (name.includes('космос') || name.includes('space') || name.includes('галактика') || name.includes('galaxy')) {
      return "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-500/30 border-0 text-sm sm:text-base";
    }
    
    if (name.includes('океан') || name.includes('ocean') || name.includes('море') || name.includes('sea')) {
      return "bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-700 hover:from-cyan-600 hover:via-blue-700 hover:to-cyan-800 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/30 border-0 text-sm sm:text-base";
    }
    
    if (name.includes('лес') || name.includes('forest') || name.includes('природа') || name.includes('nature')) {
      return "bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30 border-0 text-sm sm:text-base";
    }
    
    if (name.includes('огонь') || name.includes('fire') || name.includes('пламя') || name.includes('flame')) {
      return "bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/30 border-0 text-sm sm:text-base";
    }
    
    if (name.includes('лед') || name.includes('ice') || name.includes('снег') || name.includes('snow')) {
      return "bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-600 hover:to-blue-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 border-0 text-sm sm:text-base";
    }
    
    if (name.includes('молния') || name.includes('lightning') || name.includes('электричество') || name.includes('electric')) {
      return "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-500/30 border-0 text-sm sm:text-base";
    }
    
    // По умолчанию - золотая тема
    return "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/30 border-0 text-sm sm:text-base";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 border-4 border-amber-400/30 mx-auto"></div>
              <p className="mt-4 text-lg sm:text-xl text-gray-300">Загрузка кейса...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-red-400 mb-4">{error || 'Кейс не найден'}</h1>
            <Button onClick={() => navigate('/cases')} className="bg-amber-600 hover:bg-amber-700 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к кейсам
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Кнопка возврата */}
        <div className="mb-6 mt-16 sm:mt-20 md:mt-24">
          <Button 
            onClick={() => navigate('/cases')} 
            className={caseData ? getCaseTheme(caseData.name) : "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/30 border-0 text-sm sm:text-base"}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Вернуться к кейсам
          </Button>
        </div>

        {/* Основная информация о кейсе */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Изображение кейса */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <img
                src={caseData.image_url || '/images/placeholder.jpg'}
                alt={caseData.name}
                className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl"
                onError={(e) => {
                  console.log('Image failed to load:', caseData.image_url);
                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
              />
            </div>
          </div>

          {/* Информация о кейсе */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">{caseData.name}</h1>
              <Badge variant="outline" className="text-amber-400 border-amber-400 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
                {caseData.game}
              </Badge>
            </div>

            {caseData.description && (
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                {caseData.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">
                {caseData.price}₴
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400 text-sm sm:text-base">
                <Package className="w-4 h-4 mr-2" />
                {caseItems.length} предметов
              </Badge>
            </div>

            {/* Кнопка открытия кейса */}
            <Button
              onClick={handleOpenCase}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold text-lg sm:text-xl rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30"
            >
              <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Открыть кейс
            </Button>
          </div>
        </div>

        {/* Содержимое кейса */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
            Содержимое кейса
          </h2>
          
          {caseItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {caseItems.map((item) => (
                <div key={item.id} className="text-center space-y-2 sm:space-y-3 group">
                  {/* Изображение предмета */}
                  <div className="relative mx-auto">
                    <img
                      src={item.image_url || '/images/placeholder.jpg'}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain mx-auto transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                    {/* Иконка редкости */}
                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2">
                      {getRarityIcon(item.rarity)}
                    </div>
                  </div>

                  {/* Название предмета */}
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base leading-tight px-2">
                      {item.name}
                    </h3>
                  </div>

                  {/* Редкость */}
                  <div className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                    item.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    item.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    item.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {getRarityName(item.rarity)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Package className="w-16 h-16 sm:w-20 sm:w-24 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-base sm:text-lg">В этом кейсе пока нет предметов</p>
            </div>
          )}
        </div>
      </div>

      {/* Рулетка для открытия кейса */}
      {showRoulette && caseData && (
        <CaseRoulette
          caseItems={caseItems}
          casePrice={caseData.price}
          caseName={caseData.name}
          telegramId={profile?.telegram_id || 0}
          onClose={() => setShowRoulette(false)}
          onCaseOpened={handleCaseOpened}
        />
      )}
    </div>
  );
};

export default CasePage;