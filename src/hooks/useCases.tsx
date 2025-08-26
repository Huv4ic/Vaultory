import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface Case {
  id: string;
  name: string;
  game: string;
  price: number;
  image_url: string;
  description: string;
}

export interface CaseItem {
  id: string;
  case_id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  drop_chance: number;
  image_url: string;
}

export const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [caseItems, setCaseItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Загружаем кейсы...');

      // Загружаем кейсы из админской таблицы
      const { data: casesData, error: casesError } = await supabase
        .from('admin_cases')
        .select('*')
        .order('name');

      if (casesError) {
        console.error('❌ Ошибка при загрузке кейсов:', casesError);
        throw casesError;
      }
      
      console.log('📦 Получены кейсы из БД:', casesData);
      console.log('📊 Количество кейсов:', casesData?.length || 0);
      
      // Фильтруем системные записи и приводим данные к правильному формату
      const formattedCases = (casesData || [])
        .filter(caseData => !caseData.name.startsWith('__'))
        .map((caseData: any) => ({
          id: caseData.id,
          name: caseData.name,
          game: caseData.game || 'Unknown Game',
          price: caseData.price,
          image_url: caseData.image_url,
          description: caseData.description || ''
        }));
      
      console.log('✅ Форматированные кейсы:', formattedCases);
      setCases(formattedCases);

      // Загружаем предметы в кейсах из админской таблицы
      const { data: itemsData, error: itemsError } = await supabase
        .from('admin_case_items')
        .select('*')
        .order('name');

      if (itemsError) {
        console.error('❌ Ошибка при загрузке предметов:', itemsError);
        throw itemsError;
      }
      
      console.log('🎁 Получены предметы из БД:', itemsData);
      console.log('📊 Количество предметов:', itemsData?.length || 0);
      
      // Приводим данные к правильному формату
      const formattedItems = (itemsData || []).map((itemData: any) => ({
        id: itemData.id,
        case_id: itemData.case_id,
        name: itemData.name,
        rarity: itemData.rarity,
        drop_chance: itemData.drop_chance,
        image_url: itemData.image_url || ''
      }));
      
      console.log('✅ Форматированные предметы:', formattedItems);
      setCaseItems(formattedItems);

    } catch (err) {
      console.error('❌ Ошибка при загрузке кейсов:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const refreshCases = () => {
    fetchCases();
  };

  // Функция для принудительного обновления данных
  const forceRefresh = () => {
    setLoading(true);
    fetchCases();
  };

  useEffect(() => {
    fetchCases();
    
    // Убираем автоматическое обновление каждые 5 секунд
    // Это создавало лишнюю нагрузку и могло вызывать мерцание интерфейса
    // return () => clearInterval(interval);
  }, []);

  return {
    cases,
    caseItems,
    loading,
    error,
    refreshCases,
    forceRefresh
  };
};
