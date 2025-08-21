import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Загружаем избранные товары пользователя
  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('user_favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const favoriteIds = data?.map((fav: any) => fav.product_id) || [];
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Добавляем товар в избранное
  const addToFavorites = async (productId: string) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      const { error } = await (supabase as any)
        .from('user_favorites')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      if (error) throw error;
      
      setFavorites(prev => [...prev, productId]);
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Удаляем товар из избранного
  const removeFromFavorites = async (productId: string) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      const { error } = await (supabase as any)
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      
      setFavorites(prev => prev.filter(id => id !== productId));
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Переключаем состояние избранного
  const toggleFavorite = async (productId: string) => {
    if (favorites.includes(productId)) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  };

  // Проверяем, находится ли товар в избранном
  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  // Загружаем избранные при изменении пользователя
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    fetchFavorites
  };
};
