import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AdminCase, CaseFormData } from '../../types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Search, Plus, Edit, Trash2, Save, X, Package } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const emptyCase: CaseFormData = {
  name: '',
  game: '',
  price: 0,
  image_url: '',
  description: '',
};

const AdminCases = () => {
  const [cases, setCases] = useState<AdminCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<'edit' | 'add'>('add');
  const [currentCase, setCurrentCase] = useState<CaseFormData>(emptyCase);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      
      // Временно загружаем из существующего файла
      // Позже заменим на загрузку из admin_cases
      import('../../data/cases').then(({ cases: existingCases }) => {
        const adminCases: AdminCase[] = existingCases.map(gameCase => ({
          id: gameCase.id,
          name: gameCase.name,
          price: gameCase.price,
          image_url: gameCase.image,
          game: gameCase.game,
          description: `Кейс ${gameCase.name} для игры ${gameCase.game}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: gameCase.items.map(item => ({
            id: `${gameCase.id}-${item.name}`,
            case_id: gameCase.id,
            name: item.name,
            image_url: '/images/placeholder.jpg',
            rarity: item.rarity,
            drop_chance: item.chance,
            created_at: new Date().toISOString(),
          })),
        }));
        
        setCases(adminCases);
        setLoading(false);
      }).catch(err => {
        console.error('Error importing cases:', err);
        toast('Ошибка при загрузке кейсов', 'error');
        setLoading(false);
      });
      
    } catch (err) {
      console.error('Error fetching cases:', err);
      toast('Ошибка при загрузке кейсов', 'error');
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditMode('add');
    setCurrentCase(emptyCase);
    setEditingId(null);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (gameCase: AdminCase) => {
    setEditMode('edit');
    setCurrentCase({
      name: gameCase.name,
      game: gameCase.game,
      price: gameCase.price,
      image_url: gameCase.image_url,
      description: gameCase.description || '',
    });
    setEditingId(gameCase.id);
    setError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentCase(emptyCase);
    setEditingId(null);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setError(null);
      
      // Валидация
      if (!currentCase.name.trim() || !currentCase.price || !currentCase.image_url.trim() || !currentCase.game.trim()) {
        setError('Заполните все обязательные поля!');
        return;
      }

      // Временно используем локальное состояние
      if (editMode === 'edit' && editingId) {
        // Обновление существующего кейса
        setCases(prev => prev.map(c => 
          c.id === editingId ? {
            ...c,
            name: currentCase.name,
            game: currentCase.game,
            price: currentCase.price,
            image_url: currentCase.image_url,
            description: currentCase.description,
          } : c
        ));
        toast('Кейс успешно обновлен!', 'success');
      } else {
        // Создание нового кейса
        const newCase: AdminCase = {
          id: Date.now().toString(),
          ...currentCase,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: [],
        };
        setCases(prev => [newCase, ...prev]);
        toast('Кейс успешно добавлен!', 'success');
      }

      closeModal();
    } catch (err) {
      console.error('Error saving case:', err);
      setError('Ошибка при сохранении кейса: ' + (err as any).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот кейс?')) return;

    try {
      // Временно используем локальное состояние
      setCases(prev => prev.filter(c => c.id !== id));
      toast('Кейс успешно удален!', 'success');
    } catch (err) {
      console.error('Error deleting case:', err);
      toast('Ошибка при удалении кейса', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCase(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const filteredCases = cases.filter(gameCase =>
    gameCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gameCase.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Загрузка кейсов...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Управление кейсами</h2>
        <Button onClick={openAddModal} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Добавить кейс
        </Button>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Поиск по названию или игре..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Таблица кейсов */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm bg-gray-800 rounded-xl">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left">Изображение</th>
              <th className="py-3 px-4 text-left">Название</th>
              <th className="py-3 px-4 text-left">Игра</th>
              <th className="py-3 px-4 text-left">Цена</th>
              <th className="py-3 px-4 text-left">Предметы</th>
              <th className="py-3 px-4 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map(gameCase => (
              <tr key={gameCase.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                <td className="py-2 px-4">
                  <img 
                    src={gameCase.image_url} 
                    alt={gameCase.name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                </td>
                <td className="py-2 px-4">
                  <div>
                    <div className="font-medium">{gameCase.name}</div>
                    {gameCase.description && (
                      <div className="text-xs text-gray-400 truncate max-w-xs">
                        {gameCase.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-2 px-4">
                  <Badge variant="outline">{gameCase.game}</Badge>
                </td>
                <td className="py-2 px-4">
                  <div className="font-medium">{gameCase.price}₴</div>
                </td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-medium">
                      {gameCase.items?.length || 0}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(gameCase)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(gameCase.id)}
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
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editMode === 'add' ? 'Добавить кейс' : 'Редактировать кейс'}
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

              <div>
                <label className="block text-sm font-medium mb-2">Название *</label>
                <Input
                  name="name"
                  value={currentCase.name}
                  onChange={handleChange}
                  placeholder="Название кейса"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Игра *</label>
                <Input
                  name="game"
                  value={currentCase.game}
                  onChange={handleChange}
                  placeholder="CS2, Roblox, PUBG"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Цена *</label>
                <Input
                  name="price"
                  type="number"
                  value={currentCase.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL изображения *</label>
                <Input
                  name="image_url"
                  value={currentCase.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Описание</label>
                <Textarea
                  name="description"
                  value={currentCase.description}
                  onChange={handleChange}
                  placeholder="Описание кейса..."
                  rows={3}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-700">
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

export default AdminCases; 