import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { AdminCase, CaseFormData, AdminCaseItem, CaseItemFormData } from '../../types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, Edit, Trash2, Save, X, Package, Settings, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useNotification } from '../../hooks/useNotification';
import Notification from '../ui/Notification';

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
  price: 0, // Добавляем поле цены
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
  const { showSuccess, showError, showWarning, notification, hideNotification } = useNotification();

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
      
      // Преобразуем данные, добавляя поле price в items если его нет
      const formattedCases = (data || []).map(caseData => ({
        ...caseData,
        items: (caseData.items || []).map((item: any) => ({
          ...item,
          price: typeof item.price === 'number' ? item.price : 0, // Проверяем тип
        }))
      }));
      
      setCases(formattedCases);
      setLoading(false);
      
    } catch (err) {
      console.error('Error fetching cases:', err);
      showError('Ошибка при загрузке кейсов');
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
      
      // Преобразуем данные, добавляя поле price если его нет
      const formattedItems = (data || []).map((item: any) => ({
        ...item,
        price: typeof item.price === 'number' ? item.price : 0, // Проверяем тип
      }));
      
      setCaseItems(formattedItems);
    } catch (err) {
      console.error('Error fetching case items:', err);
      showError('Ошибка при загрузке предметов кейса');
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
      price: item.price || 0, // Добавляем поле цены
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
      [name]: ['drop_after_cases', 'price'].includes(name) ? parseFloat(value) || 0 : value
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
        showSuccess('Кейс успешно обновлен!');
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
        showSuccess('Кейс успешно добавлен!');
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
        showError('Заполните все обязательные поля!');
        return;
      }
      
      // Валидация цены
      if (typeof currentCaseItem.price !== 'number' || currentCaseItem.price < 0) {
        showError('Укажите корректную цену предмета!');
        return;
      }
      
      // Убираем ограничение на максимальную цену - теперь можно ставить любую цену
      // if (currentCaseItem.price > 999999999.99) {
      //   toast('Цена не может превышать 999,999,999.99₴!', 'error');
      //   return;
      // }

      const itemData = {
        case_id: currentCaseId,
        name: currentCaseItem.name,
        rarity: currentCaseItem.rarity,
        drop_chance: 0, // Устанавливаем в 0, так как не используем
        image_url: currentCaseItem.image_url,
        drop_after_cases: currentCaseItem.drop_after_cases || 0,
        price: Number(currentCaseItem.price) || 0, // Явно преобразуем в число
      };

      if (itemEditMode === 'edit' && editingItemId) {
        // Обновление существующего предмета
        const { error } = await supabase
          .from('admin_case_items')
          .update(itemData)
          .eq('id', editingItemId);

        if (error) throw error;
        showSuccess('Предмет успешно обновлен!');
      } else {
        // Добавление нового предмета
        const { error } = await supabase
          .from('admin_case_items')
          .insert(itemData);

        if (error) throw error;
        showSuccess('Предмет успешно добавлен!');
      }

      closeCaseItemModal();
      fetchCaseItems(currentCaseId);
      
    } catch (err) {
      console.error('Error saving case item:', err);
              showError(`Ошибка при сохранении предмета: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
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
      
              showSuccess('Кейс успешно удален!');
      fetchCases();
      
    } catch (err) {
      console.error('Error deleting case:', err);
             showError('Ошибка при удалении кейса');
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
      
             showSuccess('Предмет успешно удален!');
      if (currentCaseId) {
        fetchCaseItems(currentCaseId);
      }
      
    } catch (err) {
      console.error('Error deleting case item:', err);
             showError('Ошибка при удалении предмета');
    }
  };

  // Функция для создания глобального счетчика кейсов
  const ensureGlobalCounter = async () => {
    try {
      // Проверяем, есть ли запись о глобальном счетчике в admin_logs
      const { data: counterData, error: fetchError } = await supabase
        .from('admin_logs')
        .select('*')
        .eq('action', 'global_case_counter')
        .eq('target_type', 'counter')
        .single();

      if (fetchError || !counterData) {
        // Создаем начальную запись о глобальном счетчике
        const { error: insertError } = await supabase
          .from('admin_logs')
          .insert({
            admin_id: 'system',
            action: 'global_case_counter',
            target_type: 'counter',
            target_id: 'main',
            details: { total_cases_opened: 0, last_reset_at: new Date().toISOString() },
            created_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Не удалось создать начальную запись счетчика:', insertError);
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error('Ошибка при создании глобального счетчика:', err);
      return false;
    }
  };

  // Функция для получения текущего глобального счетчика
  const getGlobalCounter = async (): Promise<number> => {
    try {
      const { data: counterData, error: fetchError } = await supabase
        .from('admin_logs')
        .select('details')
        .eq('action', 'global_case_counter')
        .eq('target_type', 'counter')
        .eq('target_id', 'main')
        .single();

      if (fetchError || !counterData) {
        return 0;
      }

      const details = counterData.details as any;
      return details?.total_cases_opened || 0;
    } catch (err) {
      console.error('Ошибка при получении глобального счетчика:', err);
      return 0;
    }
  };

  // Функция для обновления глобального счетчика
  const updateGlobalCounter = async (newCount: number) => {
    try {
      const { error: updateError } = await supabase
        .from('admin_logs')
        .update({
          details: { 
            total_cases_opened: newCount, 
            last_reset_at: new Date().toISOString() 
          }
        })
        .eq('action', 'global_case_counter')
        .eq('target_type', 'counter')
        .eq('target_id', 'main');

      if (updateError) {
        console.error('Не удалось обновить глобальный счетчик:', updateError);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Ошибка при обновлении глобального счетчика:', err);
      return false;
    }
  };

  // Функция для обновления интерфейса глобального счетчика
  const updateCounterUI = async () => {
    try {
      const currentCount = await getGlobalCounter();
      
      // Обновляем счетчик
      const counterElement = document.getElementById('global-counter');
      if (counterElement) {
        counterElement.textContent = currentCount.toString();
      }
      
      // Обновляем информацию о следующих предметах
      const nextItemsElement = document.getElementById('next-items');
      if (nextItemsElement) {
        const nextCases = [currentCount + 1, currentCount + 2, currentCount + 3];
        const itemsHtml = nextCases.map(caseNumber => {
          const eligibleItems = caseItems.filter(item => item.drop_after_cases === caseNumber);
          if (eligibleItems.length === 0) return null;
          
          return `<div class="text-xs text-gray-400 ml-2 mb-1">
            <span class="text-blue-400">Кейс #${caseNumber}:</span> ${eligibleItems.map(item => item.name).join(', ')}
          </div>`;
        }).filter(Boolean).join('');
        
        nextItemsElement.innerHTML = itemsHtml || '<div class="text-xs text-gray-500 ml-2">Нет предметов для следующих кейсов</div>';
      }
    } catch (err) {
      console.error('Ошибка при обновлении интерфейса счетчика:', err);
    }
  };

  // Обновляем интерфейс счетчика при загрузке
  useEffect(() => {
    if (caseItems.length > 0) {
      updateCounterUI();
    }
  }, [caseItems]);

  const handleResetCaseCounter = async () => {
    if (!confirm('⚠️ ВНИМАНИЕ! Вы уверены, что хотите сбросить глобальный счетчик открытых кейсов?\n\nЭто действие:\n• Сбросит счетчик для ВСЕХ пользователей\n• Предметы с настройкой "выпадает через N кейсов" начнут выпадать заново\n• НЕ затронет любимые кейсы и инвентарь пользователей\n\nПродолжить?')) {
      return;
    }

    try {
      // Создаем глобальный счетчик если его нет
      await ensureGlobalCounter();
      
      // Сбрасываем глобальный счетчик в базе данных
      const success = await updateGlobalCounter(0);
      
      if (!success) {
        throw new Error('Не удалось обновить глобальный счетчик');
      }

      // Также сбрасываем localStorage для текущей сессии (опционально)
      localStorage.setItem('totalCasesOpened', '0');
      
      // Записываем действие в лог админки
      const { error: logError } = await supabase
        .from('admin_logs')
        .insert({
          admin_id: 'admin', // Или ID текущего админа
          action: 'reset_global_case_counter',
          target_type: 'global',
          target_id: 'all_users',
          details: 'Глобальный счетчик открытых кейсов сброшен на 0',
          created_at: new Date().toISOString()
        });

      if (logError) {
        console.warn('Не удалось записать в лог админки:', logError);
      }

      showSuccess('✅ Глобальный счетчик открытых кейсов успешно сброшен!\n\nТеперь все предметы будут выпадать заново согласно настройкам из админки.');
      
      // Обновляем интерфейс
      fetchCases();
      updateCounterUI();
      
    } catch (err) {
      console.error('Error resetting case counter:', err);
      showError('Ошибка при сбросе счетчика открытых кейсов');
    }
  };

  const filteredCases = cases.filter(gameCase =>
    gameCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gameCase.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-3 sm:p-6 bg-gray-900 text-white rounded-xl shadow-xl">
        <div className="flex items-center justify-center h-24 sm:h-32">
          <div className="text-base sm:text-lg">Загрузка кейсов...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-900 text-white rounded-xl shadow-xl">
      {/* Заголовок и кнопки */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Управление кейсами</h1>
          <p className="text-gray-400 text-sm sm:text-base">Добавляйте, редактируйте и удаляйте кейсы</p>
          
          {/* Информация о глобальном счетчике */}
          <div className="mt-2 p-3 bg-gray-800/50 rounded-lg text-sm">
            <p className="text-gray-300">
              🌐 <strong>Глобальный счетчик открытых кейсов:</strong> <span id="global-counter">Загрузка...</span>
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Этот счетчик влияет на выпадение предметов с настройкой "выпадает через N кейсов"
            </p>
            
            {/* Предметы, которые выпадут в следующих кейсах */}
            <div className="mt-3 pt-3 border-t border-gray-600">
              <p className="text-gray-300 text-xs font-medium mb-2">📊 Предметы в следующих кейсах:</p>
              <div id="next-items">Загрузка...</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Кнопка сброса счетчика кейсов */}
          <Button 
            onClick={handleResetCaseCounter} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm sm:text-base"
            title="Сбросить счетчик открытых кейсов для всех пользователей"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Сбросить счетчик кейсов
          </Button>
          
          {/* Кнопка тестирования (добавляет +1 к счетчику) */}
          <Button 
            onClick={() => {
              const current = parseInt(localStorage.getItem('totalCasesOpened') || '0');
              localStorage.setItem('totalCasesOpened', (current + 1).toString());
              showSuccess(`Тест: счетчик увеличен до ${current + 1}`);
              // Обновляем интерфейс
              setTimeout(() => window.location.reload(), 1000);
            }} 
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 text-xs sm:text-sm"
            title="Тест: добавить +1 к счетчику кейсов"
          >
            <Plus className="w-4 h-4 mr-1" />
            +1
          </Button>
          
          {/* Кнопка добавления кейса */}
          <Button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm sm:text-base">
            <Plus className="w-4 h-4 mr-2" />
            Добавить кейс
          </Button>
        </div>
      </div>

      {/* Поиск */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Поиск по названию или игре..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Таблица кейсов */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm bg-gray-800 rounded-xl">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Изображение</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Название</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden sm:table-cell">Игра</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Цена</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden lg:table-cell">Предметы</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map(gameCase => (
              <tr key={gameCase.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                <td className="py-2 px-2 sm:px-4">
                  <img 
                    src={gameCase.image_url} 
                    alt={gameCase.name}
                    className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div>
                    <div className="font-medium text-xs sm:text-sm">{gameCase.name}</div>
                    {gameCase.description && (
                      <div className="text-xs text-gray-400 truncate max-w-xs hidden sm:block">
                        {gameCase.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-2 px-2 sm:px-4 hidden sm:table-cell">
                  <Badge variant="outline" className="text-xs">{gameCase.game}</Badge>
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="font-medium text-xs sm:text-sm">{gameCase.price}₴</div>
                </td>
                <td className="py-2 px-2 sm:px-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-medium text-xs sm:text-sm">
                      {gameCase.items?.length || 0}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-2 sm:px-4">
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(gameCase)}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 sm:px-2 sm:py-1"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openCaseItemsModal(gameCase)}
                      className="bg-blue-600 hover:bg-blue-700 border-blue-600 h-6 w-6 sm:h-8 sm:w-8 p-0 sm:px-2 sm:py-1"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(gameCase.id)}
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

      {/* Модальное окно добавления/редактирования кейса */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                {editMode === 'add' ? 'Добавить кейс' : 'Редактировать кейс'}
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

              <div>
                <label className="block text-sm font-medium mb-2">Название *</label>
                <Input
                  name="name"
                  value={currentCase.name}
                  onChange={handleChange}
                  placeholder="Название кейса"
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Игра *</label>
                <Input
                  name="game"
                  value={currentCase.game}
                  onChange={handleChange}
                  placeholder="CS2, Roblox, PUBG"
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
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
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL изображения *</label>
                <Input
                  name="image_url"
                  value={currentCase.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
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
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
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

      {/* Модальное окно управления предметами кейса */}
      {caseItemsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  <span className="text-sm sm:text-base">Предметы кейса: {currentCaseName}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={closeCaseItemsModal}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {/* Кнопка добавления предмета */}
              <div className="flex justify-end">
                <Button onClick={openAddItemModal} className="bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить предмет
                </Button>
              </div>

              {/* Таблица предметов */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm bg-gray-800 rounded-xl">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Изображение</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Название</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden sm:table-cell">Редкость</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden lg:table-cell">Выпадает через</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left hidden md:table-cell">Цена</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseItems.map(item => (
                      <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-2 px-2 sm:px-4">
                          <img 
                            src={item.image_url || '/images/placeholder.jpg'} 
                            alt={item.name}
                            className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                            }}
                          />
                        </td>
                        <td className="py-2 px-2 sm:px-4">
                          <div className="font-medium text-xs sm:text-sm">{item.name}</div>
                        </td>
                        <td className="py-2 px-2 sm:px-4 hidden sm:table-cell">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              item.rarity === 'legendary' ? 'text-yellow-400 border-yellow-400' :
                              item.rarity === 'epic' ? 'text-purple-400 border-purple-400' :
                              item.rarity === 'rare' ? 'text-blue-400 border-blue-400' :
                              'text-gray-400 border-gray-400'
                            }`}
                          >
                            {item.rarity === 'legendary' ? 'Легендарный' :
                             item.rarity === 'epic' ? 'Эпический' :
                             item.rarity === 'rare' ? 'Редкий' :
                             'Обычный'}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 sm:px-4 hidden lg:table-cell">
                          <div className="font-medium text-xs sm:text-sm">{item.drop_after_cases} кейсов</div>
                        </td>
                        <td className="py-2 px-2 sm:px-4 hidden md:table-cell">
                          <div className="font-medium text-xs sm:text-sm text-green-400">
                            {typeof item.price === 'number' ? `${item.price}₴` : '0₴'}
                          </div>
                        </td>
                        <td className="py-2 px-2 sm:px-4">
                          <div className="flex gap-1 sm:gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditItemModal(item)}
                              className="h-6 w-6 sm:h-8 sm:w-8 p-0 sm:px-2 sm:py-1"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCaseItem(item.id)}
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

              {caseItems.length === 0 && (
                <div className="text-center py-6 sm:py-8 text-gray-400">
                  <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">В этом кейсе пока нет предметов</p>
                  <p className="text-xs sm:text-sm">Добавьте первый предмет, нажав кнопку выше</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Модальное окно добавления/редактирования предмета */}
      {caseItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                {itemEditMode === 'add' ? 'Добавить предмет' : 'Редактировать предмет'}
                <Button variant="ghost" size="sm" onClick={closeCaseItemModal}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              <div>
                <label className="block text-sm font-medium mb-2">Название предмета *</label>
                <Input
                  name="name"
                  value={currentCaseItem.name}
                  onChange={handleCaseItemChange}
                  placeholder="Название предмета"
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Редкость</label>
                <Select
                  value={currentCaseItem.rarity}
                  onValueChange={(value) => handleCaseItemSelectChange('rarity', value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-sm sm:text-base">
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
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Цена предмета (₴) *</label>
                <Input
                  name="price"
                  type="number"
                  value={currentCaseItem.price || ''}
                  onChange={handleCaseItemChange}
                  placeholder="10000000"
                  min="0"
                  step="0.01"
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Цена, за которую можно продать предмет (без ограничений)
                </p>
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
                  className="bg-gray-700 border-gray-600 text-sm sm:text-base"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Предмет выпадет только когда глобальный счетчик кейсов достигнет этого числа.<br/>
                  <strong>Примеры:</strong><br/>
                  • 1 = выпадет на 1-м кейсе<br/>
                  • 1000 = выпадет на 1000-м кейсе<br/>
                  • 11000 = выпадет на 11000-м кейсе
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button onClick={handleSaveCaseItem} className="flex-1 bg-green-600 hover:bg-green-700 text-sm sm:text-base">
                  <Save className="w-4 h-4 mr-2" />
                  {itemEditMode === 'add' ? 'Добавить' : 'Сохранить'}
                </Button>
                <Button onClick={closeCaseItemModal} variant="outline" className="flex-1 text-sm sm:text-base">
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Красивые уведомления */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        autoHide={notification.autoHide}
        duration={notification.duration}
      />
    </div>
  );
};

export default AdminCases; 