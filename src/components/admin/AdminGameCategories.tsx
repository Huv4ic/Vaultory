import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, Plus, Edit, Trash2, Save, X, Gamepad2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface GameCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

const emptyCategory = {
  name: '',
  color: 'from-blue-500 to-purple-600',
  icon: '🎮',
};

const AdminGameCategories = () => {
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<'edit' | 'add'>('add');
  const [currentCategory, setCurrentCategory] = useState(emptyCategory);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const colorOptions = [
    { value: 'from-blue-500 to-purple-600', label: 'Синий-Фиолетовый' },
    { value: 'from-red-500 to-pink-600', label: 'Красный-Розовый' },
    { value: 'from-green-500 to-teal-600', label: 'Зеленый-Бирюзовый' },
    { value: 'from-yellow-500 to-orange-600', label: 'Желтый-Оранжевый' },
    { value: 'from-purple-500 to-indigo-600', label: 'Фиолетовый-Индиго' },
    { value: 'from-pink-500 to-rose-600', label: 'Розовый-Красный' },
    { value: 'from-cyan-500 to-blue-600', label: 'Бирюзовый-Синий' },
    { value: 'from-emerald-500 to-green-600', label: 'Изумрудный-Зеленый' },
  ];

  const iconOptions = [
    '🎮', '🎯', '⚔️', '🏆', '💎', '🔥', '⭐', '🌟', '💫', '🎲',
    '🎪', '🎨', '🎵', '🎸', '🎺', '🎻', '🎹', '🎤', '🎧', '🎬'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('game_categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCategories(data || []);
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast('Ошибка при загрузке категорий', 'error');
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditMode('add');
    setCurrentCategory(emptyCategory);
    setEditingId(null);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (category: GameCategory) => {
    setEditMode('edit');
    setCurrentCategory({
      name: category.name,
      color: category.color,
      icon: category.icon,
    });
    setEditingId(category.id);
    setError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentCategory(emptyCategory);
    setEditingId(null);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setError(null);
      
      if (!currentCategory.name.trim()) {
        setError('Название категории обязательно!');
        return;
      }

      if (editMode === 'edit' && editingId) {
        const { data, error } = await supabase
          .from('game_categories')
          .update({
            name: currentCategory.name,
            color: currentCategory.color,
            icon: currentCategory.icon,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId)
          .select()
          .single();

        if (error) throw error;

        setCategories(prev => prev.map(c => c.id === editingId ? data : c));
        toast('Категория успешно обновлена!', 'success');
      } else {
        const newId = `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const { data, error } = await supabase
          .from('game_categories')
          .insert([{
            id: newId,
            name: currentCategory.name,
            color: currentCategory.color,
            icon: currentCategory.icon,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (error) throw error;

        setCategories(prev => [data, ...prev]);
        toast('Категория успешно добавлена!', 'success');
      }

      closeModal();
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Ошибка при сохранении категории: ' + (err as any).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) return;

    try {
      const { error } = await supabase
        .from('game_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(c => c.id !== id));
      toast('Категория успешно удалена!', 'success');
    } catch (err) {
      console.error('Error deleting category:', err);
      toast('Ошибка при удалении категории', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Загрузка категорий...</div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-900 text-white rounded-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold">Управление главными категориями</h2>
        <Button onClick={openAddModal} className="bg-green-600 hover:bg-green-700 text-sm sm:text-base">
          <Plus className="w-4 h-4 mr-2" />
          Добавить категорию
        </Button>
      </div>

      {/* Поиск */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Поиск по названию категории..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Сетка категорий */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredCategories.map(category => (
          <Card key={category.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-semibold text-sm sm:text-base">{category.name}</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(category)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              
              <div className="mt-2 text-xs text-gray-400">
                Создана: {new Date(category.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Модальное окно добавления/редактирования */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <Card className="w-full max-w-md bg-gray-800 border-gray-700">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                {editMode === 'add' ? 'Добавить категорию' : 'Редактировать категорию'}
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Название категории *</label>
                <Input
                  name="name"
                  value={currentCategory.name}
                  onChange={handleChange}
                  placeholder="Название игры или категории"
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Цветовая схема</label>
                <select
                  name="color"
                  value={currentCategory.color}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm sm:text-base"
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Иконка</label>
                <div className="grid grid-cols-10 gap-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setCurrentCategory(prev => ({ ...prev, icon }))}
                      className={`p-2 rounded text-lg hover:bg-gray-600 transition-colors ${
                        currentCategory.icon === icon ? 'bg-gray-600' : 'bg-gray-700'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
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

export default AdminGameCategories;
