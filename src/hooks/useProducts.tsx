import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  category_id: string;
  game: string;
  rating: number;
  sales: number;
  description: string;
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setProducts(productsData || []);

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
