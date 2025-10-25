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
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const emptyCategory = {
  name: '',
  color: 'from-blue-500 to-purple-600',
  icon: '🎮',
  image_url: '',
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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
      
      // Если категорий нет, добавляем все существующие
      if (!data || data.length === 0) {
        console.log('Категорий нет, добавляем все существующие...');
        try {
          await seedAllCategories();
          console.log('Категории успешно добавлены');
          // Загружаем категории снова после добавления
          const { data: newData, error: newError } = await supabase
            .from('game_categories')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (newError) throw newError;
          setCategories(newData || []);
          console.log('Загружено категорий:', newData?.length);
        } catch (seedError) {
          console.error('Ошибка при добавлении категорий:', seedError);
          toast('Ошибка при добавлении категорий', 'error');
        }
      } else {
        console.log('Категории уже существуют:', data.length);
        setCategories(data);
      }
      
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast('Ошибка при загрузке категорий', 'error');
      setLoading(false);
    }
  };

  const seedAllCategories = async () => {
    console.log('Начинаем добавление категорий...');
    const gameCategories = [
      {
        id: 'tiktok',
        name: 'TikTok',
        color: 'from-pink-500 to-purple-600',
        icon: '📱'
      },
      {
        id: 'standoff2',
        name: 'Standoff 2',
        color: 'from-blue-500 to-cyan-600',
        icon: '🔫'
      },
      {
        id: 'mobile_legends',
        name: 'Mobile Legends',
        color: 'from-orange-500 to-red-600',
        icon: '⚔️'
      },
      {
        id: 'pubg',
        name: 'PUBG Mobile',
        color: 'from-green-500 to-teal-600',
        icon: '🎯'
      },
      {
        id: 'free_fire',
        name: 'Free Fire',
        color: 'from-red-500 to-pink-600',
        icon: '🔥'
      },
      {
        id: 'steam',
        name: 'Steam',
        color: 'from-gray-500 to-blue-600',
        icon: '🎮'
      },
      {
        id: 'roblox',
        name: 'Roblox',
        color: 'from-purple-500 to-indigo-600',
        icon: '🧱'
      },
      {
        id: 'genshin',
        name: 'Genshin Impact',
        color: 'from-yellow-500 to-orange-600',
        icon: '⭐'
      },
      {
        id: 'honkai',
        name: 'Honkai Star Rail',
        color: 'from-pink-500 to-purple-600',
        icon: '🚀'
      },
      {
        id: 'zenless',
        name: 'Zenless Zone Zero',
        color: 'from-cyan-500 to-blue-600',
        icon: '⚡'
      },
      {
        id: 'identity_v',
        name: 'Identity V',
        color: 'from-gray-600 to-purple-600',
        icon: '🎭'
      },
      {
        id: 'arena_breakout',
        name: 'Arena Breakout',
        color: 'from-green-600 to-blue-600',
        icon: '🛡️'
      },
      {
        id: 'epic_games',
        name: 'Epic Games',
        color: 'from-indigo-500 to-purple-600',
        icon: '🎯'
      },
      {
        id: 'brawl_stars',
        name: 'Brawl Stars',
        color: 'from-yellow-500 to-orange-600',
        icon: '⭐'
      },
      {
        id: 'gta',
        name: 'GTA',
        color: 'from-green-500 to-blue-600',
        icon: '🚗'
      },
      {
        id: 'rocket_league',
        name: 'Rocket League',
        color: 'from-blue-500 to-cyan-600',
        icon: '🚀'
      },
      {
        id: 'spotify',
        name: 'Spotify',
        color: 'from-green-500 to-emerald-600',
        icon: '🎵'
      },
      {
        id: 'world_of_tanks',
        name: 'World of Tanks Blitz',
        color: 'from-gray-600 to-yellow-600',
        icon: '🚗'
      },
      {
        id: 'telegram_stars',
        name: 'Звезды Telegram',
        color: 'from-blue-500 to-cyan-600',
        icon: '⭐'
      }
    ];

    console.log('Добавляем категории в базу данных...', gameCategories.length);
    const { error } = await supabase
      .from('game_categories')
      .insert(
        gameCategories.map(category => ({
          ...category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      );

    if (error) {
      console.error('Error seeding categories:', error);
      throw error;
    }
    console.log('Категории успешно добавлены в базу данных');
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `game-categories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
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
      image_url: category.image_url || '',
    });
    setEditingId(category.id);
    setError(null);
    setSelectedFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentCategory(emptyCategory);
    setEditingId(null);
    setError(null);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    try {
      setError(null);
      setUploading(true);
      
      if (!currentCategory.name.trim()) {
        setError('Название категории обязательно!');
        setUploading(false);
        return;
      }

      let imageUrl = currentCategory.image_url;

      // Загружаем изображение, если выбрано
      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile);
        } catch (uploadErr) {
          setError('Ошибка при загрузке изображения: ' + (uploadErr as any).message);
          setUploading(false);
          return;
        }
      }

      if (editMode === 'edit' && editingId) {
        const { data, error } = await supabase
          .from('game_categories')
          .update({
            name: currentCategory.name,
            color: currentCategory.color,
            icon: currentCategory.icon,
            image_url: imageUrl,
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
            image_url: imageUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (error) throw error;

        setCategories(prev => [data, ...prev]);
        toast('Категория успешно добавлена!', 'success');
      }

      setUploading(false);
      closeModal();
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Ошибка при сохранении категории: ' + (err as any).message);
      setUploading(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Показываем превью изображения
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentCategory(prev => ({
          ...prev,
          image_url: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
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
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={async () => {
              try {
                setLoading(true);
                await seedAllCategories();
                await fetchCategories();
                toast('Все категории успешно добавлены!', 'success');
              } catch (err) {
                console.error('Error seeding categories:', err);
                toast('Ошибка при добавлении категорий', 'error');
              } finally {
                setLoading(false);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
            disabled={loading}
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Добавить все категории
          </Button>
          <Button onClick={openAddModal} className="bg-green-600 hover:bg-green-700 text-sm sm:text-base">
            <Plus className="w-4 h-4 mr-2" />
            Добавить категорию
          </Button>
        </div>
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
              
              <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center overflow-hidden`}>
                {category.image_url ? (
                  <img 
                    src={category.image_url} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Если изображение не загрузилось, показываем иконку
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <span className={`text-2xl ${category.image_url ? 'hidden' : ''}`}>{category.icon}</span>
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

              <div>
                <label className="block text-sm font-medium mb-2">Изображение категории</label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-600 file:text-white hover:file:bg-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Или введите URL изображения</label>
                    <Input
                      name="image_url"
                      value={currentCategory.image_url}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                    />
                  </div>

                  {currentCategory.image_url && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium mb-2">Превью:</label>
                      <div className="w-32 h-20 rounded-lg overflow-hidden border border-gray-600">
                        <img 
                          src={currentCategory.image_url} 
                          alt="Превью"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={uploading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-sm sm:text-base disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editMode === 'add' ? 'Добавить' : 'Сохранить'}
                    </>
                  )}
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
