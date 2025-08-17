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

      // Загружаем кейсы
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('*')
        .order('name');

      if (casesError) throw casesError;
      setCases(casesData || []);

      // Загружаем предметы в кейсах
      const { data: itemsData, error: itemsError } = await supabase
        .from('case_items')
        .select('*')
        .order('name');

      if (itemsError) throw itemsError;
      setCaseItems(itemsData || []);

    } catch (err) {
      console.error('Error fetching cases:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const refreshCases = () => {
    fetchCases();
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return {
    cases,
    caseItems,
    loading,
    error,
    refreshCases
  };
};
