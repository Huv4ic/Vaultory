import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, telegramUser } = useAuth();

  // Используем telegramUser.id если доступен, иначе user.id
  const currentUserId = telegramUser?.id || user?.id;

  // Загружаем избранные товары пользователя
  const fetchFavorites = async () => {
    if (!currentUserId) return;
    
    try {
      setLoading(true);
      console.log('Fetching favorites for user:', currentUserId);
      
      // Проверяем существование таблицы
      const { data: tableCheck, error: tableError } = await (supabase as any)
        .from('user_favorites')
        .select('count')
        .limit(1);
      
      if (tableError) {
        console.error('Table user_favorites does not exist or access denied:', tableError);
        console.log('Please run the SQL file add-favorites-system.sql in DBeaver');
        return;
      }
      
      const { data, error } = await (supabase as any)
        .from('user_favorites')
        .select('product_id')
        .eq('telegram_id', currentUserId);

      if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
      
      console.log('Favorites data:', data);
      const favoriteIds = data?.map((fav: any) => fav.product_id) || [];
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error in fetchFavorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Добавляем товар в избранное
  const addToFavorites = async (productId: string) => {
    if (!currentUserId) {
      console.log('No user found, cannot add to favorites');
      return false;
    }
    
    try {
      setLoading(true);
      console.log('Adding to favorites:', { userId: currentUserId, productId });
      
      const { error } = await (supabase as any)
        .from('user_favorites')
        .insert({
          telegram_id: currentUserId,
          product_id: productId
        });

      if (error) {
        console.error('Error adding to favorites:', error);
        throw error;
      }
      
      console.log('Successfully added to favorites');
      setFavorites(prev => [...prev, productId]);
      return true;
    } catch (error) {
      console.error('Error in addToFavorites:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Удаляем товар из избранного
  const removeFromFavorites = async (productId: string) => {
    if (!currentUserId) {
      console.log('No user found, cannot remove from favorites');
      return false;
    }
    
    try {
      setLoading(true);
      console.log('Removing from favorites:', { userId: currentUserId, productId });
      
      const { error } = await (supabase as any)
        .from('user_favorites')
        .delete()
        .eq('telegram_id', currentUserId)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from favorites:', error);
        throw error;
      }
      
      console.log('Successfully removed from favorites');
      setFavorites(prev => prev.filter(id => id !== productId));
      return true;
    } catch (error) {
      console.error('Error in removeFromFavorites:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Переключаем состояние избранного
  const toggleFavorite = async (productId: string) => {
    console.log('toggleFavorite called with productId:', productId, 'Current favorites:', favorites);
    if (favorites.includes(productId)) {
      console.log('Removing from favorites...');
      return await removeFromFavorites(productId);
    } else {
      console.log('Adding to favorites...');
      return await addToFavorites(productId);
    }
  };

  // Проверяем, находится ли товар в избранном
  const isFavorite = (productId: string) => {
    const result = favorites.includes(productId);
    console.log('isFavorite check:', { productId, result, favorites });
    return result;
  };

  // Загружаем избранные при изменении пользователя
  useEffect(() => {
    if (currentUserId) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [currentUserId]);

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
