import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AdminProduct, ProductFormData } from '../../types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Search, Plus, Edit, Trash2, Save, X, Eye, RefreshCw } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const emptyProduct: ProductFormData = {
  name: '',
  price: 0,
  original_price: undefined,
  image_url: '',
  category: '',
  game: '',
  description: '',
  features: [],
  game_category_id: '',
};

const AdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [gameCategories, setGameCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<'edit' | 'add'>('add');
  const [currentProduct, setCurrentProduct] = useState<ProductFormData>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Функция синхронизации товара с таблицей products
  const syncProductToMainTable = async (productData: any) => {
    try {
      console.log('Синхронизируем товар с основной таблицей:', productData);
      
      // Проверяем, существует ли товар в основной таблице
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('id', productData.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Ошибка проверки существования товара:', checkError);
        return;
      }

      const productToSync = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        original_price: productData.original_price,
        image_url: productData.image_url,
        game: productData.game,
        game_category_id: productData.game_category_id,
        description: productData.description,
        features: productData.features,
        created_at: productData.created_at,
        updated_at: productData.updated_at
      };

      if (existingProduct) {
        // Обновляем существующий товар
        const { error: updateError } = await supabase
          .from('products')
          .update(productToSync)
          .eq('id', productData.id);

        if (updateError) {
          console.error('Ошибка обновления товара в основной таблице:', updateError);
        } else {
          console.log('Товар успешно обновлен в основной таблице');
        }
      } else {
        // Создаем новый товар
        const { error: insertError } = await supabase
          .from('products')
          .insert([productToSync]);

        if (insertError) {
          console.error('Ошибка создания товара в основной таблице:', insertError);
        } else {
          console.log('Товар успешно создан в основной таблице');
        }
      }
    } catch (err) {
      console.error('Ошибка синхронизации товара:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchGameCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Загружаем из базы данных admin_products
      const { data, error } = await supabase
        .from('admin_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      toast('Ошибка при загрузке товаров', 'error');
      setLoading(false);
    }
  };

  const fetchGameCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('game_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      setGameCategories(data || []);
      
    } catch (err) {
      console.error('Error fetching game categories:', err);
      toast('Ошибка при загрузке главных категорий', 'error');
    }
  };

  const openAddModal = () => {
    setEditMode('add');
    setCurrentProduct(emptyProduct);
    setEditingId(null);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setEditMode('edit');
    setCurrentProduct({
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      image_url: product.image_url,
      category: product.category,
      game: product.game,
      description: product.description || '',
      features: product.features || [],
      game_category_id: product.game_category_id || '',
    });
    setEditingId(product.id);
    setError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentProduct(emptyProduct);
    setEditingId(null);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setError(null);
      
      // Валидация
      if (!currentProduct.name.trim() || !currentProduct.price || !currentProduct.image_url.trim() || !currentProduct.category.trim() || !currentProduct.game.trim() || !currentProduct.game_category_id) {
        setError('Заполните все обязательные поля!');
        return;
      }
  
      if (editMode === 'edit' && editingId) {
        // Обновление существующего товара
        const { data, error } = await supabase
          .from('admin_products')
          .update({
            name: currentProduct.name,
            price: currentProduct.price,
            original_price: currentProduct.original_price,
            image_url: currentProduct.image_url,
            category: currentProduct.category,
            game: currentProduct.game,
            description: currentProduct.description,
            features: currentProduct.features,
            game_category_id: currentProduct.game_category_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId)
          .select()
          .single();

        if (error) {
          console.error('Error updating product:', error);
          // Показать детальную ошибку
          const errorMessage = error.message || error.details || error.hint || JSON.stringify(error);
          setError('Ошибка при обновлении товара: ' + errorMessage);
          return;
        }

        setProducts(prev => prev.map(p => p.id === editingId ? data : p));
        toast('Товар успешно обновлен!', 'success');
        
        // Синхронизируем с основной таблицей
        await syncProductToMainTable(data);
      } else {
        // Создание нового товара
        const newId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const { data, error } = await supabase
          .from('admin_products')
          .insert([{
            id: newId,
            name: currentProduct.name,
            price: currentProduct.price,
            original_price: currentProduct.original_price,
            image_url: currentProduct.image_url,
            category: currentProduct.category,
            game: currentProduct.game,
            description: currentProduct.description,
            features: currentProduct.features,
            game_category_id: currentProduct.game_category_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (error) {
          console.error('Error adding product:', error);
          // Показать детальную ошибку
          const errorMessage = error.message || error.details || error.hint || JSON.stringify(error);
          setError('Ошибка при добавлении товара: ' + errorMessage);
          return;
        }

        setProducts(prev => [data, ...prev]);
        toast('Товар успешно добавлен!', 'success');
        
        // Синхронизируем с основной таблицей
        await syncProductToMainTable(data);
      }

      closeModal();
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Ошибка при сохранении товара: ' + (err as any).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;

    try {
      const { error } = await supabase
        .from('admin_products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        toast('Ошибка при удалении товара: ' + error.message, 'error');
        return;
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      toast('Товар успешно удален!', 'success');
      
      // Удаляем из основной таблицы
      await supabase
        .from('products')
        .delete()
        .eq('id', id);
    } catch (err) {
      console.error('Error deleting product:', err);
      toast('Ошибка при удалении товара', 'error');
    }
  };

  const handleSyncAllProducts = async () => {
    if (!window.confirm('Синхронизировать все товары с основным сайтом? Это может занять некоторое время.')) return;

    try {
      setLoading(true);
      
      // Получаем все товары из admin_products
      const { data: adminProducts, error: fetchError } = await supabase
        .from('admin_products')
        .select('*');

      if (fetchError) throw fetchError;

      console.log('Синхронизируем', adminProducts?.length, 'товаров...');

      // Синхронизируем каждый товар
      for (const product of adminProducts || []) {
        await syncProductToMainTable(product);
      }

      toast(`Синхронизировано ${adminProducts?.length || 0} товаров!`, 'success');
      
    } catch (err) {
      console.error('Error syncing products:', err);
      toast('Ошибка при синхронизации: ' + (err as any).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: ['price', 'original_price'].includes(name) ? Number(value) : value
    }));
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentProduct(prev => ({
      ...prev,
      features: e.target.value.split('\n').map(f => f.trim()).filter(Boolean)
    }));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Загрузка товаров...</div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-900 text-white rounded-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold">Управление товарами</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleSyncAllProducts} 
            className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Синхронизировать с сайтом
          </Button>
          <Button onClick={openAddModal} className="bg-green-600 hover:bg-green-700 text-sm sm:text-base">
            <Plus className="w-4 h-4 mr-2" />
            Добавить товар
          </Button>
        </div>
      </div>

      {/* Поиск */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Поиск по названию, категории или игре..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Таблица товаров */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm bg-gray-800 rounded-xl">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Изображение</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Название</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Цена</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden sm:table-cell">Категория</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden lg:table-cell">Игра</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                <td className="py-2 px-2 sm:px-4">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div>
                    <div className="font-medium text-xs sm:text-sm">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-400 truncate max-w-xs hidden sm:block">
                        {product.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="font-medium text-xs sm:text-sm">{product.price}₴</div>
                  {product.original_price && (
                    <div className="text-xs text-gray-400 line-through">
                      {product.original_price}₴
                    </div>
                  )}
                </td>
                <td className="py-2 px-2 sm:px-4 hidden sm:table-cell">
                  <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                </td>
                <td className="py-2 px-2 sm:px-4 hidden lg:table-cell">
                  <Badge variant="outline" className="text-xs">{product.game}</Badge>
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(product)}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 sm:px-2 sm:py-1"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 sm:px-2 sm:py-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно добавления/редактирования */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                {editMode === 'add' ? 'Добавить товар' : 'Редактировать товар'}
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название *</label>
                  <Input
                    name="name"
                    value={currentProduct.name}
                    onChange={handleChange}
                    placeholder="Название товара"
                    className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Цена *</label>
                  <Input
                    name="price"
                    type="number"
                    value={currentProduct.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Старая цена</label>
                  <Input
                    name="original_price"
                    type="number"
                    value={currentProduct.original_price || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Категория *</label>
                  <Input
                    name="category"
                    value={currentProduct.category}
                    onChange={handleChange}
                    placeholder="Ключи, Валюта, и т.д."
                    className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Игра *</label>
                  <Input
                    name="game"
                    value={currentProduct.game}
                    onChange={handleChange}
                    placeholder="CS2, Roblox, PUBG"
                    className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Главная категория *</label>
                <select
                  name="game_category_id"
                  value={currentProduct.game_category_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm sm:text-base"
                >
                  <option value="">Выберите главную категорию</option>
                  {gameCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL изображения *</label>
                <Input
                  name="image_url"
                  value={currentProduct.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <Textarea
                  name="description"
                  value={currentProduct.description}
                  onChange={handleChange}
                  placeholder="Описание товара..."
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Особенности (каждая с новой строки)</label>
                <Textarea
                  value={currentProduct.features.join('\n')}
                  onChange={handleFeaturesChange}
                  placeholder="Мгновенная доставка&#10;Официальный ключ&#10;Поддержка 24/7"
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                  <Save className="w-4 h-4 mr-2" />
                  {editMode === 'add' ? 'Добавить' : 'Сохранить'}
                </Button>
                <Button onClick={closeModal} variant="outline" className="flex-1 text-sm sm:text-base">
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminProducts; 