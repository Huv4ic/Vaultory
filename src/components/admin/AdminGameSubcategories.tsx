import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GameCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface GameSubcategory {
  id: string;
  game_category_id: string;
  name: string;
  name_en?: string;
  name_ru?: string;
  slug: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminGameSubcategories: React.FC = () => {
  const [gameCategories, setGameCategories] = useState<GameCategory[]>([]);
  const [subcategories, setSubcategories] = useState<GameSubcategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    name_en: '',
    name_ru: '',
    slug: '',
    order_index: 0,
    is_active: true,
  });
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGameCategories();
    fetchSubcategories();
  }, []);

  const fetchGameCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('game_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching game categories:', error);
        setError('Не удалось загрузить главные категории.');
      } else {
        setGameCategories(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Ошибка при загрузке главных категорий.');
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase
        .from('game_subcategories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching subcategories:', error);
        setError('Не удалось загрузить подкатегории.');
      } else {
        setSubcategories(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Ошибка при загрузке подкатегорий.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewSubcategory((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewSubcategory((prev) => ({
      ...prev,
      name,
      slug: editingSubcategoryId ? prev.slug : generateSlug(name), // Не меняем slug при редактировании
    }));
  };

  const handleSaveSubcategory = async () => {
    if (!selectedCategoryId || !newSubcategory.name || !newSubcategory.slug) {
      setError('Пожалуйста, выберите главную категорию и заполните название подкатегории.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const subcategoryData = {
        ...newSubcategory,
        game_category_id: selectedCategoryId,
        id: editingSubcategoryId || `${selectedCategoryId}-${newSubcategory.slug}`,
      };

      let result;
      if (editingSubcategoryId) {
        result = await supabase
          .from('game_subcategories')
          .update(subcategoryData)
          .eq('id', editingSubcategoryId);
      } else {
        result = await supabase
          .from('game_subcategories')
          .insert(subcategoryData);
      }

      if (result.error) {
        console.error('Error saving subcategory:', result.error);
        setError(`Ошибка сохранения подкатегории: ${result.error.message}`);
      } else {
        setNewSubcategory({
          name: '',
          name_en: '',
          name_ru: '',
          slug: '',
          order_index: 0,
          is_active: true,
        });
        setEditingSubcategoryId(null);
        setSelectedCategoryId('');
        fetchSubcategories();
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Неожиданная ошибка при сохранении подкатегории.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubcategory = (subcategory: GameSubcategory) => {
    setEditingSubcategoryId(subcategory.id);
    setSelectedCategoryId(subcategory.game_category_id);
    setNewSubcategory({
      name: subcategory.name,
      name_en: subcategory.name_en || '',
      name_ru: subcategory.name_ru || '',
      slug: subcategory.slug,
      order_index: subcategory.order_index,
      is_active: subcategory.is_active,
    });
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту подкатегорию?')) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('game_subcategories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting subcategory:', error);
        setError(`Ошибка удаления подкатегории: ${error.message}`);
      } else {
        fetchSubcategories();
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Неожиданная ошибка при удалении подкатегории.');
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(sub => sub.game_category_id === categoryId);
  };

  const resetForm = () => {
    setEditingSubcategoryId(null);
    setSelectedCategoryId('');
    setNewSubcategory({
      name: '',
      name_en: '',
      name_ru: '',
      slug: '',
      order_index: 0,
      is_active: true,
    });
  };

  return (
    <div className="p-6 bg-[#121212] text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-red-500">Управление подкатегориями</h2>

      {loading && <p className="text-gray-400">Загрузка...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-8 p-6 bg-[#1a1a1a] rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-red-400">
          {editingSubcategoryId ? 'Редактировать подкатегорию' : 'Добавить новую подкатегорию'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="game_category_id" className="block text-sm font-medium text-gray-300 mb-1">
              Главная категория *
            </label>
            <select
              id="game_category_id"
              name="game_category_id"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-[#2a2a2a] text-white focus:ring-red-500 focus:border-red-500"
              disabled={!!editingSubcategoryId}
            >
              <option value="">Выберите главную категорию</option>
              {gameCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Название *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newSubcategory.name}
              onChange={handleNameChange}
              className="w-full p-2 border border-gray-600 rounded-md bg-[#2a2a2a] text-white focus:ring-red-500 focus:border-red-500"
              placeholder="Например: Аккаунты"
            />
          </div>

          <div>
            <label htmlFor="name_en" className="block text-sm font-medium text-gray-300 mb-1">
              Название (EN)
            </label>
            <input
              type="text"
              id="name_en"
              name="name_en"
              value={newSubcategory.name_en}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-600 rounded-md bg-[#2a2a2a] text-white focus:ring-red-500 focus:border-red-500"
              placeholder="Например: Accounts"
            />
          </div>

          <div>
            <label htmlFor="name_ru" className="block text-sm font-medium text-gray-300 mb-1">
              Название (RU)
            </label>
            <input
              type="text"
              id="name_ru"
              name="name_ru"
              value={newSubcategory.name_ru}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-600 rounded-md bg-[#2a2a2a] text-white focus:ring-red-500 focus:border-red-500"
              placeholder="Например: Аккаунты"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
              Slug (для URL) *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={newSubcategory.slug}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-600 rounded-md bg-[#2a2a2a] text-white focus:ring-red-500 focus:border-red-500"
              placeholder="Например: accounts"
              disabled={!!editingSubcategoryId}
            />
          </div>

          <div>
            <label htmlFor="order_index" className="block text-sm font-medium text-gray-300 mb-1">
              Порядок отображения
            </label>
            <input
              type="number"
              id="order_index"
              name="order_index"
              value={newSubcategory.order_index}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-600 rounded-md bg-[#2a2a2a] text-white focus:ring-red-500 focus:border-red-500"
              min="0"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={newSubcategory.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-[#2a2a2a]"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-300">
              Активна
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSaveSubcategory}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {editingSubcategoryId ? 'Сохранить изменения' : 'Добавить подкатегорию'}
          </button>
          {editingSubcategoryId && (
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition duration-200"
              disabled={loading}
            >
              Отмена
            </button>
          )}
        </div>
      </div>

      <div className="p-6 bg-[#1a1a1a] rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-red-400">Существующие подкатегории</h3>
        {gameCategories.map((category) => (
          <div key={category.id} className="mb-6 border border-gray-700 rounded-md p-4">
            <h4 className="text-xl font-bold mb-3 text-red-300">{category.name}</h4>
            {getSubcategoriesForCategory(category.id).length > 0 ? (
              <ul className="space-y-2">
                {getSubcategoriesForCategory(category.id).map((sub) => (
                  <li key={sub.id} className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded-md">
                    <span className="text-gray-200">
                      {sub.name} ({sub.slug}) - Порядок: {sub.order_index} {sub.is_active ? '(Активна)' : '(Неактивна)'}
                    </span>
                    <div>
                      <button
                        onClick={() => handleEditSubcategory(sub)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md mr-2 transition duration-200"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDeleteSubcategory(sub.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition duration-200"
                      >
                        Удалить
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Нет подкатегорий для этой главной категории.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGameSubcategories;
