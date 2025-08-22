import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AdminCase, CaseFormData, AdminCaseItem, CaseItemFormData } from '../../types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, Edit, Trash2, Save, X, Package, Settings, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const emptyCase: CaseFormData = {
  name: '',
  game: '',
  price: 0,
  image_url: '',
  description: '',
};

const emptyCaseItem: CaseItemFormData = {
  name: '',
  rarity: 'common',
  image_url: '',
  drop_after_cases: 0,
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
  
  // Новые состояния для управления предметами кейса
  const [caseItemsModalOpen, setCaseItemsModalOpen] = useState(false);
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [currentCaseName, setCurrentCaseName] = useState<string>('');
  const [caseItems, setCaseItems] = useState<AdminCaseItem[]>([]);
  const [caseItemModalOpen, setCaseItemModalOpen] = useState(false);
  const [currentCaseItem, setCurrentCaseItem] = useState<CaseItemFormData>(emptyCaseItem);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemEditMode, setItemEditMode] = useState<'edit' | 'add'>('add');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      
      // Загружаем кейсы с предметами
      const { data, error } = await supabase
        .from('admin_cases')
        .select(`
          *,
          items:admin_case_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCases(data || []);
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching cases:', err);
      toast('Ошибка при загрузке кейсов', 'error');
      setLoading(false);
    }
  };

  const fetchCaseItems = async (caseId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_case_items')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCaseItems(data || []);
    } catch (err) {
      console.error('Error fetching case items:', err);
      toast('Ошибка при загрузке предметов кейса', 'error');
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

  const openCaseItemsModal = async (gameCase: AdminCase) => {
    setCurrentCaseId(gameCase.id);
    setCurrentCaseName(gameCase.name);
    await fetchCaseItems(gameCase.id);
    setCaseItemsModalOpen(true);
  };

  const openAddItemModal = () => {
    setItemEditMode('add');
    setCurrentCaseItem(emptyCaseItem);
    setEditingItemId(null);
    setCaseItemModalOpen(true);
  };

  const openEditItemModal = (item: AdminCaseItem) => {
    setItemEditMode('edit');
    setCurrentCaseItem({
      name: item.name,
      rarity: item.rarity,
      image_url: item.image_url || '',
      drop_after_cases: item.drop_after_cases || 0,
    });
    setEditingItemId(item.id);
    setCaseItemModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentCase(emptyCase);
    setEditingId(null);
    setError(null);
  };

  const closeCaseItemsModal = () => {
    setCaseItemsModalOpen(false);
    setCurrentCaseId(null);
    setCurrentCaseName('');
    setCaseItems([]);
  };

  const closeCaseItemModal = () => {
    setCaseItemModalOpen(false);
    setCurrentCaseItem(emptyCaseItem);
    setEditingItemId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCase(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCaseItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCaseItem(prev => ({
      ...prev,
      [name]: ['drop_after_cases'].includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleCaseItemSelectChange = (name: string, value: string) => {
    setCurrentCaseItem(prev => ({
      ...prev,
      [name]: name === 'rarity' ? value as 'common' | 'rare' | 'epic' | 'legendary' : value
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      
      // Валидация
      if (!currentCase.name.trim() || !currentCase.price || !currentCase.image_url.trim() || !currentCase.game.trim()) {
        setError('Заполните все обязательные поля!');
        return;
      }

      if (editMode === 'edit' && editingId) {
        // Обновление существующего кейса
        const { data, error } = await supabase
          .from('admin_cases')
          .update({
            name: currentCase.name,
            game: currentCase.game,
            price: currentCase.price,
            image_url: currentCase.image_url,
            description: currentCase.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId)
          .select();

        if (error) throw error;
        toast('Кейс успешно обновлен!', 'success');
      } else {
        // Добавление нового кейса
        const { data, error } = await supabase
          .from('admin_cases')
          .insert({
            name: currentCase.name,
            game: currentCase.game,
            price: currentCase.price,
            image_url: currentCase.image_url,
            description: currentCase.description,
          })
          .select();

        if (error) throw error;
        toast('Кейс успешно добавлен!', 'success');
      }

      closeModal();
      fetchCases();
      
    } catch (err) {
      console.error('Error saving case:', err);
      setError('Ошибка при сохранении кейса');
    }
  };

  const handleSaveCaseItem = async () => {
    try {
      if (!currentCaseId) return;
      
      // Валидация
      if (!currentCaseItem.name.trim() || !currentCaseItem.image_url.trim()) {
        toast('Заполните все обязательные поля!', 'error');
        return;
      }

      const itemData = {
        case_id: currentCaseId,
        name: currentCaseItem.name,
        rarity: currentCaseItem.rarity,
        drop_chance: 0, // Устанавливаем в 0, так как не используем
        image_url: currentCaseItem.image_url,
        drop_after_cases: currentCaseItem.drop_after_cases || 0,
      };

      if (itemEditMode === 'edit' && editingItemId) {
        // Обновление существующего предмета
        const { error } = await supabase
          .from('admin_case_items')
          .update(itemData)
          .eq('id', editingItemId);

        if (error) throw error;
        toast('Предмет успешно обновлен!', 'success');
      } else {
        // Добавление нового предмета
        const { error } = await supabase
          .from('admin_case_items')
          .insert(itemData);

        if (error) throw error;
        toast('Предмет успешно добавлен!', 'success');
      }

      closeCaseItemModal();
      fetchCaseItems(currentCaseId);
      
    } catch (err) {
      console.error('Error saving case item:', err);
      toast(`Ошибка при сохранении предмета: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`, 'error');
    }
  };

  const handleDelete = async (caseId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот кейс?')) return;
    
    try {
      // Сначала удаляем все предметы кейса
      await supabase.from('admin_case_items').delete().eq('case_id', caseId);
      
      // Затем удаляем сам кейс
      const { error } = await supabase
        .from('admin_cases')
        .delete()
        .eq('id', caseId);

      if (error) throw error;
      
      toast('Кейс успешно удален!', 'success');
      fetchCases();
      
    } catch (err) {
      console.error('Error deleting case:', err);
      toast('Ошибка при удалении кейса', 'error');
    }
  };

  const handleDeleteCaseItem = async (itemId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот предмет?')) return;
    
    try {
      const { error } = await supabase
        .from('admin_case_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      toast('Предмет успешно удален!', 'success');
      if (currentCaseId) {
        fetchCaseItems(currentCaseId);
      }
      
    } catch (err) {
      console.error('Error deleting case item:', err);
      toast('Ошибка при удалении предмета', 'error');
    }
  };

  const filteredCases = cases.filter(gameCase =>
    gameCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gameCase.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 bg-gray-900 text-white rounded-xl shadow-xl">
        <div className="flex items-center justify-center h-32">
          <div className="text-lg">Загрузка кейсов...</div>
        </div>
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
                      variant="outline"
                      onClick={() => openCaseItemsModal(gameCase)}
                      className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                    >
                      <Settings className="w-3 h-3" />
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

      {/* Модальное окно добавления/редактирования кейса */}
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

      {/* Модальное окно управления предметами кейса */}
      {caseItemsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-blue-400" />
                  <span>Предметы кейса: {currentCaseName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={closeCaseItemsModal}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Кнопка добавления предмета */}
              <div className="flex justify-end">
                <Button onClick={openAddItemModal} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить предмет
                </Button>
              </div>

              {/* Таблица предметов */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm bg-gray-800 rounded-xl">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-4 text-left">Изображение</th>
                      <th className="py-3 px-4 text-left">Название</th>
                      <th className="py-3 px-4 text-left">Редкость</th>
                      <th className="py-3 px-4 text-left">Выпадает через</th>
                      <th className="py-3 px-4 text-left">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseItems.map(item => (
                      <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-2 px-4">
                          <img 
                            src={item.image_url || '/images/placeholder.jpg'} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                            }}
                          />
                        </td>
                        <td className="py-2 px-4">
                          <div className="font-medium">{item.name}</div>
                        </td>
                        <td className="py-2 px-4">
                          <Badge 
                            variant="outline" 
                            className={
                              item.rarity === 'legendary' ? 'text-yellow-400 border-yellow-400' :
                              item.rarity === 'epic' ? 'text-purple-400 border-purple-400' :
                              item.rarity === 'rare' ? 'text-blue-400 border-blue-400' :
                              'text-gray-400 border-gray-400'
                            }
                          >
                            {item.rarity === 'legendary' ? 'Легендарный' :
                             item.rarity === 'epic' ? 'Эпический' :
                             item.rarity === 'rare' ? 'Редкий' :
                             'Обычный'}
                          </Badge>
                        </td>
                        <td className="py-2 px-4">
                          <div className="font-medium">{item.drop_after_cases} кейсов</div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditItemModal(item)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCaseItem(item.id)}
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

              {caseItems.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>В этом кейсе пока нет предметов</p>
                  <p className="text-sm">Добавьте первый предмет, нажав кнопку выше</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Модальное окно добавления/редактирования предмета */}
      {caseItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {itemEditMode === 'add' ? 'Добавить предмет' : 'Редактировать предмет'}
                <Button variant="ghost" size="sm" onClick={closeCaseItemModal}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название предмета *</label>
                <Input
                  name="name"
                  value={currentCaseItem.name}
                  onChange={handleCaseItemChange}
                  placeholder="Название предмета"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Редкость</label>
                <Select
                  value={currentCaseItem.rarity}
                  onValueChange={(value) => handleCaseItemSelectChange('rarity', value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="common">Обычный</SelectItem>
                    <SelectItem value="rare">Редкий</SelectItem>
                    <SelectItem value="epic">Эпический</SelectItem>
                    <SelectItem value="legendary">Легендарный</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL изображения *</label>
                <Input
                  name="image_url"
                  value={currentCaseItem.image_url}
                  onChange={handleCaseItemChange}
                  placeholder="https://example.com/item.jpg"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Выпадает через N кейсов</label>
                <Input
                  name="drop_after_cases"
                  type="number"
                  value={currentCaseItem.drop_after_cases || ''}
                  onChange={handleCaseItemChange}
                  placeholder="1000"
                  min="0"
                  className="bg-gray-700 border-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Глобальный счетчик открытых кейсов на всем сайте
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveCaseItem} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  {itemEditMode === 'add' ? 'Добавить' : 'Сохранить'}
                </Button>
                <Button onClick={closeCaseItemModal} variant="outline" className="flex-1">
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