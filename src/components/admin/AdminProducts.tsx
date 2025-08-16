import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AdminProduct, ProductFormData } from '../../types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Search, Plus, Edit, Trash2, Save, X, Eye } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const emptyProduct: ProductFormData = {
  name: '',
  price: 0,
  original_price: undefined,
  image_url: '',
  category: '',
  game: '',
  rating: 0,
  sales: 0,
  description: '',
  features: [],
};

const AdminProducts = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<'edit' | 'add'>('add');
  const [currentProduct, setCurrentProduct] = useState<ProductFormData>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Временно используем существующие данные из файла
      // Позже заменим на запрос к базе данных
      const mockProducts: AdminProduct[] = [
        {
          id: '1',
          name: 'Steam ключ CS2',
          price: 299.99,
          original_price: 399.99,
          image_url: '/images/products/cs2-key.jpg',
          category: 'Ключи',
          game: 'CS2',
          rating: 4.8,
          sales: 1250,
          description: 'Официальный ключ для игры Counter-Strike 2',
          features: ['Мгновенная доставка', 'Официальный ключ', 'Поддержка Steam'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: '1000 Robux',
          price: 89.99,
          image_url: '/images/products/robux-1000.jpg',
          category: 'Валюта',
          game: 'Roblox',
          rating: 4.9,
          sales: 3200,
          description: '1000 Robux для Roblox',
          features: ['Мгновенное зачисление', 'Безопасная покупка', 'Поддержка 24/7'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: '50 UC PUBG',
          price: 149.99,
          image_url: '/images/products/uc-50.jpg',
          category: 'Валюта',
          game: 'PUBG',
          rating: 4.7,
          sales: 2100,
          description: '50 UC для PUBG Mobile',
          features: ['Быстрая доставка', 'Официальная валюта', 'Гарантия качества'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      
      setProducts(mockProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast('Ошибка при загрузке товаров', 'error');
    } finally {
      setLoading(false);
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
      rating: product.rating,
      sales: product.sales,
      description: product.description || '',
      features: product.features || [],
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
      if (!currentProduct.name.trim() || !currentProduct.price || !currentProduct.image_url.trim() || !currentProduct.category.trim() || !currentProduct.game.trim()) {
        setError('Заполните все обязательные поля!');
        return;
      }

      // Временно используем локальное состояние
      if (editMode === 'edit' && editingId) {
        // Обновление существующего товара
        setProducts(prev => prev.map(p => 
          p.id === editingId ? {
            ...p,
            name: currentProduct.name,
            price: currentProduct.price,
            original_price: currentProduct.original_price,
            image_url: currentProduct.image_url,
            category: currentProduct.category,
            game: currentProduct.game,
            rating: currentProduct.rating,
            sales: currentProduct.sales,
            description: currentProduct.description,
            features: currentProduct.features,
          } : p
        ));
        toast('Товар успешно обновлен!', 'success');
      } else {
        // Создание нового товара
        const newProduct: AdminProduct = {
          id: Date.now().toString(),
          ...currentProduct,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProducts(prev => [newProduct, ...prev]);
        toast('Товар успешно добавлен!', 'success');
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
      // Временно используем локальное состояние
      setProducts(prev => prev.filter(p => p.id !== id));
      toast('Товар успешно удален!', 'success');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast('Ошибка при удалении товара', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: ['price', 'original_price', 'rating', 'sales'].includes(name) ? Number(value) : value
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
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Управление товарами</h2>
        <Button onClick={openAddModal} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Добавить товар
        </Button>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Поиск по названию, категории или игре..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Таблица товаров */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-gray-800 rounded-xl">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left">Изображение</th>
              <th className="py-3 px-4 text-left">Название</th>
              <th className="py-3 px-4 text-left">Цена</th>
              <th className="py-3 px-4 text-left">Категория</th>
              <th className="py-3 px-4 text-left">Игра</th>
              <th className="py-3 px-4 text-left">Рейтинг</th>
              <th className="py-3 px-4 text-left">Продано</th>
              <th className="py-3 px-4 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                <td className="py-2 px-4">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                </td>
                <td className="py-2 px-4">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-400 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="font-medium">{product.price}₴</div>
                  {product.original_price && (
                    <div className="text-xs text-gray-400 line-through">
                      {product.original_price}₴
                    </div>
                  )}
                </td>
                <td className="py-2 px-4">
                  <Badge variant="secondary">{product.category}</Badge>
                </td>
                <td className="py-2 px-4">
                  <Badge variant="outline">{product.game}</Badge>
                </td>
                <td className="py-2 px-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{product.rating}</span>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="text-green-400 font-medium">{product.sales}</div>
                </td>
                <td className="py-2 px-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(product)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editMode === 'add' ? 'Добавить товар' : 'Редактировать товар'}
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название *</label>
                  <Input
                    name="name"
                    value={currentProduct.name}
                    onChange={handleChange}
                    placeholder="Название товара"
                    className="bg-gray-700 border-gray-600"
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
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Старая цена</label>
                  <Input
                    name="original_price"
                    type="number"
                    value={currentProduct.original_price || ''}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Рейтинг</label>
                  <Input
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={currentProduct.rating}
                    onChange={handleChange}
                    placeholder="0.0"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Категория *</label>
                  <Input
                    name="category"
                    value={currentProduct.category}
                    onChange={handleChange}
                    placeholder="Ключи, Валюта, и т.д."
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Игра *</label>
                  <Input
                    name="game"
                    value={currentProduct.game}
                    onChange={handleChange}
                    placeholder="CS2, Roblox, PUBG"
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Количество продаж</label>
                <Input
                  name="sales"
                  type="number"
                  value={currentProduct.sales}
                  onChange={handleChange}
                  placeholder="0"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL изображения *</label>
                <Input
                  name="image_url"
                  value={currentProduct.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-700 border-gray-600"
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
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Особенности (каждая с новой строки)</label>
                <Textarea
                  value={currentProduct.features.join('\n')}
                  onChange={handleFeaturesChange}
                  placeholder="Мгновенная доставка&#10;Официальный ключ&#10;Поддержка 24/7"
                  rows={3}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editMode === 'add' ? 'Добавить' : 'Сохранить'}
                </Button>
                <Button onClick={closeModal} variant="outline" className="flex-1">
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