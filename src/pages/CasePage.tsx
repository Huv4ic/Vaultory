import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useCaseStats } from '../hooks/useCaseStats';
import { useInventory } from '../hooks/useInventory';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/ui/Notification';
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
  drop_after_cases?: number; // Добавляем поле для отслеживания выпадения
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
  const { showSuccess, showError, notification, hideNotification } = useNotification();
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

      // Загружаем данные кейса из админской таблицы
      const { data: caseData, error: caseError } = await supabase
        .from('admin_cases')
        .select('*')
        .eq('id', id)
        .single();

      if (caseError) throw caseError;

      // Преобразуем данные к правильному формату
      const formattedCase: Case = {
        ...caseData,
        image_url: caseData.image_url || '', // Используем поле image_url из админской таблицы
        game: caseData.game || 'Unknown Game' // Используем поле game из админской таблицы
      };

      setCaseData(formattedCase);

                    // Загружаем предметы кейса
       const { data, error: itemsError } = await supabase
         .from('admin_case_items') // Используем admin_case_items вместо case_items
         .select('*')
         .eq('case_id', id)
         .order('name');

      if (itemsError) throw itemsError;

      // Преобразуем данные, добавляя поле price если его нет
      const formattedItems = (data || []).map((item: any) => ({
        id: item.id,
        case_id: item.case_id || id || '', // Добавляем case_id
        name: item.name,
        rarity: item.rarity || 'common',
        drop_chance: item.drop_chance || 0,
        image_url: item.image_url || '',
        price: typeof item.price === 'number' ? item.price : 0, // Добавляем цену из базы
        drop_after_cases: item.drop_after_cases // Добавляем поле drop_after_cases
      }));

      console.log('📦 Загруженные предметы кейса:', formattedItems);
      console.log('🔍 Значения редкости:', formattedItems.map(item => ({ name: item.name, rarity: item.rarity })));
      
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
      showError('В этом кейсе нет предметов для открытия');
      return;
    }
    
    // Показываем рулетку
    setShowRoulette(true);
  };

  const handleCaseOpened = async (item: CaseItem, action: 'add' | 'sell') => {
    console.log('📦 Case opened with action:', action, 'item:', item.name);
    
    // Добавляем предмет в инвентарь только если действие - "add"
    if (action === 'add') {
      console.log('🎉 Кейс открыт! Выпал предмет:', item);
      
      // ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА: убеждаемся что addItem вызывается только один раз
      console.log('🔍 ПРОВЕРКА: addItem будет вызван только один раз для предмета:', item.name);
    console.log('📦 Данные кейса:', caseData);
    console.log('🔍 ДЕТАЛЬНАЯ ОТЛАДКА - Полученный предмет:', {
      id: item.id,
      name: item.name,
      price: item.price,
      rarity: item.rarity,
      case_id: item.case_id,
      image_url: item.image_url,
      drop_after_cases: item.drop_after_cases
    });
    
    // ПРОВЕРЯЕМ ОБЯЗАТЕЛЬНЫЕ ПОЛЯ
    console.log('🔍 ПРОВЕРКА ПОЛЕЙ:');
    console.log('- Название предмета:', item.name ? '✅' : '❌', item.name);
    console.log('- Цена предмета:', (typeof item.price === 'number' && item.price >= 0) ? '✅' : '❌', item.price);
    console.log('- Редкость:', item.rarity ? '✅' : '❌', item.rarity);
    console.log('- ID кейса:', item.case_id ? '✅' : '❌', item.case_id);
    console.log('- Название кейса:', caseData?.name ? '✅' : '❌', caseData?.name);
    console.log('- URL изображения:', item.image_url ? '✅' : '❌', item.image_url);
    
    // ДОБАВЛЯЕМ ПРЕДМЕТ В ИНВЕНТАРЬ
    // ВАЖНО: Эта функция вызывается только при нажатии "Добавить в инвентарь"
    // При нажатии "Продать" она НЕ вызывается
    try {
      const inventoryItem = {
        name: item.name || 'Неизвестный предмет',
        price: typeof item.price === 'number' ? item.price : 0, // Проверяем тип цены
        rarity: item.rarity || 'common',
        type: 'case_item', // Используем фиксированное значение
        caseId: item.case_id || id || '', // Используем case_id из предмета или ID кейса
        case_name: caseData?.name || 'Неизвестный кейс',
        image: undefined, // У CaseItem нет поля image
        image_url: item.image_url || '',
        obtained_at: new Date().toISOString()
      };
      
      console.log('🎁 Создаем предмет для инвентаря:', inventoryItem);
      console.log('🔧 Вызываем addItem с предметом:', inventoryItem.name);
      console.log('💰 Цена предмета:', inventoryItem.price);
      console.log('🆔 Case ID:', inventoryItem.caseId);
      console.log('📦 Case Name:', inventoryItem.case_name);
      
      await addItem(inventoryItem);
      console.log('✅ Предмет успешно добавлен в инвентарь!');
    } catch (error) {
      console.error('❌ Ошибка при добавлении предмета в инвентарь:', error);
      console.error('❌ Детали ошибки:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
    } // Закрываем блок if (action === 'add')
    
    // Увеличиваем счетчик открытий кейса для статистики (для всех действий)
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

  // Функция для сортировки предметов по редкости
  const sortItemsByRarity = (items: CaseItem[]) => {
    console.log('🔍 Сортируем предметы по редкости:', items.map(item => ({ name: item.name, rarity: item.rarity })));
    
    const rarityOrder = {
      'legendary': 4,
      'epic': 3,
      'rare': 2,
      'common': 1,
      'uncommon': 1.5, // Добавляем промежуточную редкость
      'normal': 1, // Альтернативное название для обычных
      'basic': 1, // Еще одно альтернативное название
      'default': 1 // Значение по умолчанию
    };
    
    const sortedItems = [...items].sort((a, b) => {
      const aRarity = a.rarity?.toLowerCase() || 'common';
      const bRarity = b.rarity?.toLowerCase() || 'common';
      
      const aOrder = rarityOrder[aRarity as keyof typeof rarityOrder] || 0;
      const bOrder = rarityOrder[bRarity as keyof typeof rarityOrder] || 0;
      
      console.log(`📊 Сравниваем: ${a.name} (${aRarity}: ${aOrder}) vs ${b.name} (${bRarity}: ${bOrder})`);
      
      return bOrder - aOrder; // Сортировка по убыванию (легендарные выше)
    });
    
    console.log('✅ Отсортированные предметы:', sortedItems.map(item => ({ name: item.name, rarity: item.rarity })));
    return sortedItems;
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
    
    // Единый стиль для всех кейсов
    return "bg-[#a31212] hover:bg-[#8a0f0f] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 border-0 text-sm sm:text-base";
    
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#f0f0f0]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 border-4 border-[#a31212] mx-auto"></div>
              <p className="mt-4 text-lg sm:text-xl text-[#a0a0a0]">Загрузка кейса...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#f0f0f0]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#a31212] mb-4">{error || 'Кейс не найден'}</h1>
            <Button onClick={() => navigate('/cases')} className="bg-[#a31212] hover:bg-[#8a0f0f] px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к кейсам
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#f0f0f0]">
      <div className="container mx-auto px-4 py-8">
        {/* Кнопка возврата */}
        <div className="mb-6 mt-16 sm:mt-20 md:mt-24">
          <Button 
            onClick={() => navigate('/cases')} 
            className="bg-[#a31212] hover:bg-[#8a0f0f] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#f0f0f0] mb-2 sm:mb-3">{caseData.name}</h1>
              <Badge variant="outline" className="text-[#a31212] border-[#a31212] text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
                {caseData.game}
              </Badge>
            </div>

            {caseData.description && (
              <p className="text-[#a0a0a0] text-base sm:text-lg leading-relaxed">
                {caseData.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="text-2xl sm:text-3xl font-bold text-[#f0f0f0]">
                {caseData.price}₴
              </div>
              <Badge variant="outline" className="text-[#a31212] border-[#a31212] text-sm sm:text-base">
                <Package className="w-4 h-4 mr-2" />
                {caseItems.length} предметов
              </Badge>
            </div>

            {/* Кнопка открытия кейса */}
            <Button
              onClick={handleOpenCase}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold text-lg sm:text-xl rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Открыть кейс
            </Button>

            {/* Содержимое кейса - теперь под кнопкой */}
            <div className="mt-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#f0f0f0] mb-4">
                Содержимое кейса
              </h3>
          
          {caseItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {sortItemsByRarity(caseItems).map((item, index) => (
                <div key={item.id} className="text-center space-y-2 sm:space-y-3 group relative bg-[#181818] rounded-xl p-3 sm:p-4 border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 h-full flex flex-col">
                  {/* Изображение предмета */}
                  <div className="relative mx-auto flex-shrink-0">
                    <img
                      src={item.image_url || '/images/placeholder.jpg'}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain mx-auto"
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
                  <div className="flex-1 flex items-center justify-center min-h-[2.5rem] sm:min-h-[3rem] px-1">
                    <h3 className="font-semibold text-[#f0f0f0] text-xs sm:text-sm leading-tight break-words overflow-hidden text-center line-clamp-2">
                      {item.name}
                    </h3>
                  </div>

                  {/* Редкость */}
                  <div className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 max-w-full ${
                    item.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    item.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                    item.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    <span className="truncate">{getRarityName(item.rarity)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Package className="w-16 h-16 sm:w-20 sm:w-24 mx-auto mb-4 text-[#a0a0a0]" />
              <p className="text-[#a0a0a0] text-base sm:text-lg">В этом кейсе пока нет предметов</p>
            </div>
          )}
            </div>
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
        
        {/* Красивые уведомления */}
        <Notification
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
          autoHide={notification.autoHide}
          duration={notification.duration}
        />
      </div>
    </div>
  );
};

export default CasePage;