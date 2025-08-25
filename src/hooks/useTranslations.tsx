import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from './useLanguage';

export interface ProductTranslation {
  product_id: string;
  language: string;
  name: string;
  description?: string;
  features?: string[];
}

export interface CaseTranslation {
  case_id: string;
  language: string;
  name: string;
  description?: string;
}

export interface CaseItemTranslation {
  case_item_id: string;
  language: string;
  name: string;
}

export interface CategoryTranslation {
  category_id: string;
  language: string;
  name: string;
}

export const useTranslations = () => {
  const { currentLanguage } = useLanguage();
  const [productTranslations, setProductTranslations] = useState<ProductTranslation[]>([]);
  const [caseTranslations, setCaseTranslations] = useState<CaseTranslation[]>([]);
  const [caseItemTranslations, setCaseItemTranslations] = useState<CaseItemTranslation[]>([]);
  const [categoryTranslations, setCategoryTranslations] = useState<CategoryTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка всех переводов при инициализации
  useEffect(() => {
    loadAllTranslations();
  }, [currentLanguage]);

  const loadAllTranslations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем все переводы параллельно
      const [
        productResult,
        caseResult,
        caseItemResult,
        categoryResult
      ] = await Promise.all([
        supabase
          .from('product_translations')
          .select('*')
          .eq('language', currentLanguage),
        
        supabase
          .from('case_translations')
          .select('*')
          .eq('language', currentLanguage),
        
        supabase
          .from('case_item_translations')
          .select('*')
          .eq('language', currentLanguage),
        
        supabase
          .from('category_translations')
          .select('*')
          .eq('language', currentLanguage)
      ]);

      // Проверяем на ошибки
      if (productResult.error) throw productResult.error;
      if (caseResult.error) throw caseResult.error;
      if (caseItemResult.error) throw caseItemResult.error;
      if (categoryResult.error) throw categoryResult.error;

      // Устанавливаем данные
      setProductTranslations(productResult.data || []);
      setCaseTranslations(caseResult.data || []);
      setCaseItemTranslations(caseItemResult.data || []);
      setCategoryTranslations(categoryResult.data || []);

    } catch (err: any) {
      console.error('Ошибка загрузки переводов:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения перевода товара
  const getProductTranslation = (
    productId: string, 
    field: 'name' | 'description' = 'name',
    fallback?: string
  ): string => {
    const translation = productTranslations.find(t => t.product_id === productId);
    if (translation) {
      if (field === 'name') return translation.name;
      if (field === 'description') return translation.description || fallback || '';
    }
    return fallback || productId;
  };

  // Функция для получения перевода кейса
  const getCaseTranslation = (
    caseId: string, 
    field: 'name' | 'description' = 'name',
    fallback?: string
  ): string => {
    const translation = caseTranslations.find(t => t.case_id === caseId);
    if (translation) {
      if (field === 'name') return translation.name;
      if (field === 'description') return translation.description || fallback || '';
    }
    return fallback || caseId;
  };

  // Функция для получения перевода предмета кейса
  const getCaseItemTranslation = (
    caseItemId: string,
    fallback?: string
  ): string => {
    const translation = caseItemTranslations.find(t => t.case_item_id === caseItemId);
    return translation?.name || fallback || caseItemId;
  };

  // Функция для получения перевода категории
  const getCategoryTranslation = (
    categoryId: string,
    fallback?: string
  ): string => {
    const translation = categoryTranslations.find(t => t.category_id === categoryId);
    return translation?.name || fallback || categoryId;
  };

  // Функция для получения особенностей товара
  const getProductFeatures = (productId: string): string[] => {
    const translation = productTranslations.find(t => t.product_id === productId);
    return translation?.features || [];
  };

  // Функция для добавления/обновления перевода товара (для админки)
  const updateProductTranslation = async (
    productId: string,
    name: string,
    description?: string,
    features?: string[]
  ) => {
    try {
      const { error } = await supabase
        .from('product_translations')
        .upsert({
          product_id: productId,
          language: currentLanguage,
          name,
          description,
          features
        });

      if (error) throw error;
      
      // Перезагружаем переводы
      await loadAllTranslations();
      return true;
    } catch (err: any) {
      console.error('Ошибка обновления перевода товара:', err);
      setError(err.message);
      return false;
    }
  };

  // Функция для добавления/обновления перевода кейса (для админки)
  const updateCaseTranslation = async (
    caseId: string,
    name: string,
    description?: string
  ) => {
    try {
      const { error } = await supabase
        .from('case_translations')
        .upsert({
          case_id: caseId,
          language: currentLanguage,
          name,
          description
        });

      if (error) throw error;
      
      // Перезагружаем переводы
      await loadAllTranslations();
      return true;
    } catch (err: any) {
      console.error('Ошибка обновления перевода кейса:', err);
      setError(err.message);
      return false;
    }
  };

  // Функция для добавления/обновления перевода категории (для админки)
  const updateCategoryTranslation = async (
    categoryId: string,
    name: string
  ) => {
    try {
      const { error } = await supabase
        .from('category_translations')
        .upsert({
          category_id: categoryId,
          language: currentLanguage,
          name
        });

      if (error) throw error;
      
      // Перезагружаем переводы
      await loadAllTranslations();
      return true;
    } catch (err: any) {
      console.error('Ошибка обновления перевода категории:', err);
      setError(err.message);
      return false;
    }
  };

  return {
    // Состояние
    loading,
    error,
    currentLanguage,
    
    // Данные
    productTranslations,
    caseTranslations,
    caseItemTranslations,
    categoryTranslations,
    
    // Функции получения переводов
    getProductTranslation,
    getCaseTranslation,
    getCaseItemTranslation,
    getCategoryTranslation,
    getProductFeatures,
    
    // Функции обновления (для админки)
    updateProductTranslation,
    updateCaseTranslation,
    updateCategoryTranslation,
    
    // Перезагрузка
    refreshTranslations: loadAllTranslations
  };
};
