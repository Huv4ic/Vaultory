import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useFavorites } from './useFavorites';

export interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  images?: string[];
  image_url?: string;
  category_id: string;
  game_id: string;
  description: string;
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  is_favorite?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  is_active: boolean;
  parent_id: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites, isFavorite } = useFavorites();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Загружаем категории
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Загружаем продукты
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) throw productsError;
      
      console.log('Raw products data:', productsData);
      
      // Добавляем информацию об избранности и сортируем
      const productsWithFavorites = (productsData || []).map(product => {
        console.log('Product:', product.name, 'Images:', product.images, 'Full product:', product);
        return {
          ...product,
          is_favorite: isFavorite(product.id)
        };
      });

      // Сортируем: избранные товары сначала, затем по названию
      const sortedProducts = productsWithFavorites.sort((a, b) => {
        if (a.is_favorite && !b.is_favorite) return -1;
        if (!a.is_favorite && b.is_favorite) return 1;
        return a.name.localeCompare(b.name);
      });

      setProducts(sortedProducts);

    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = () => {
    fetchProducts();
  };

  // Обновляем продукты при изменении избранных
  useEffect(() => {
    if (favorites.length > 0) {
      fetchProducts();
    }
  }, [favorites]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    refreshProducts
  };
};
