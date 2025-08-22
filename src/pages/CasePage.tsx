import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Package, ArrowLeft, Crown, Zap, Target, Shield } from 'lucide-react';

interface CaseItem {
  id: string;
  name: string;
  rarity: string;
  image_url?: string;
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
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [caseItems, setCaseItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        .from('case_items')
        .select('*')
        .eq('case_id', id)
        .order('name');

      if (itemsError) throw itemsError;

      setCaseItems(itemsData || []);
      setLoading(false);

    } catch (err) {
      console.error('Error fetching case data:', err);
      setError('Ошибка при загрузке данных кейса');
      setLoading(false);
    }
  };

  const handleOpenCase = () => {
    // Здесь будет логика открытия кейса
    alert('Функция открытия кейса будет добавлена позже');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl">Загрузка кейса...</div>
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
            <h1 className="text-2xl font-bold text-red-400 mb-4">Ошибка</h1>
            <p className="text-gray-400 mb-6">{error || 'Кейс не найден'}</p>
            <Button onClick={() => navigate('/cases')} className="bg-amber-600 hover:bg-amber-700">
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
        <div className="mb-6 mt-20">
          <Button 
            onClick={() => navigate('/cases')} 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к кейсам
          </Button>
        </div>

        {/* Основная информация о кейсе */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Изображение кейса */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <img
                src={caseData.image_url || '/images/placeholder.jpg'}
                alt={caseData.name}
                className="w-96 h-96 object-contain rounded-2xl shadow-2xl"
                onError={(e) => {
                  console.log('Image failed to load:', caseData.image_url);
                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
              />
              {/* Убираем желтую рамку */}
            </div>
          </div>

          {/* Информация о кейсе */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{caseData.name}</h1>
              <Badge variant="outline" className="text-amber-400 border-amber-400 text-lg px-4 py-2">
                {caseData.game}
              </Badge>
            </div>

            {caseData.description && (
              <p className="text-gray-300 text-lg leading-relaxed">
                {caseData.description}
              </p>
            )}

            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-amber-400">
                {caseData.price}₴
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Package className="w-4 h-4 mr-2" />
                {caseItems.length} предметов
              </Badge>
            </div>

            {/* Кнопка открытия кейса */}
            <Button
              onClick={handleOpenCase}
              className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30"
            >
              <Package className="w-6 h-6 mr-3" />
              Открыть кейс
            </Button>
          </div>
        </div>

        {/* Содержимое кейса */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Содержимое кейса
          </h2>
          
          {caseItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {caseItems.map((item) => (
                <Card key={item.id} className="bg-gray-800/30 border-gray-600/50 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-3">
                    <div className="text-center space-y-2">
                      {/* Изображение предмета */}
                      <div className="relative mx-auto">
                        <img
                          src={item.image_url || '/images/placeholder.jpg'}
                          alt={item.name}
                          className="w-24 h-24 object-contain mx-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                          }}
                        />
                        {/* Иконка редкости */}
                        <div className="absolute -top-1 -right-1">
                          {getRarityIcon(item.rarity)}
                        </div>
                      </div>

                      {/* Название предмета */}
                      <div>
                        <h3 className="font-medium text-white text-sm leading-tight">
                          {item.name}
                        </h3>
                      </div>

                      {/* Редкость */}
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-1 ${getRarityColor(item.rarity)}`}
                      >
                        {getRarityName(item.rarity)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-24 h-24 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">В этом кейсе пока нет предметов</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CasePage; 