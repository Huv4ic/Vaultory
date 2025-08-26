import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryService, DatabaseInventoryItem } from '../services/inventoryService';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface InventoryItem {
  id?: string;
  name: string;
  price: number;
  rarity: string;
  type?: string;
  caseId?: string;
  case_name?: string;
  image?: string;
  image_url?: string;
  status?: 'new' | 'sold' | 'withdrawn';
  obtained_at?: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => Promise<void>;
  removeItem: (index: number) => Promise<void>;
  sellItem: (index: number) => Promise<number>;
  withdrawItem: (index: number) => Promise<void>;
  clear: () => Promise<void>;
  refreshItems: () => Promise<void>;
  getTotalValue: () => Promise<number>;
  getCasesOpened: () => Promise<number>;
  casesOpened: number;
  spent: number;
  purchased: number;
  syncInventory: () => Promise<void>;
  loading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [casesOpened, setCasesOpened] = useState(0);
  const [spent, setSpent] = useState(0);
  const [purchased, setPurchased] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Очередь для предметов, если профиль не загружен (временно)
  const [pendingItems, setPendingItems] = useState<InventoryItem[]>([]);

  // Функция для загрузки инвентаря из базы данных
  const loadInventoryFromDatabase = async (telegramId: number) => {
    try {
      setLoading(true);
      console.log('🔄 Загружаем инвентарь из базы данных для telegram_id:', telegramId);
      
      const dbItems = await InventoryService.getUserInventory(telegramId);
      console.log('📦 Получено предметов из БД:', dbItems.length);
      
      // Конвертируем DatabaseInventoryItem в InventoryItem
      const convertedItems: InventoryItem[] = dbItems.map(dbItem => ({
        id: dbItem.id,
        name: dbItem.item_name,
        price: dbItem.item_price,
        rarity: dbItem.item_rarity,
        type: dbItem.item_type,
        caseId: dbItem.case_id,
        case_name: dbItem.case_name,
        image: dbItem.item_image,
        image_url: dbItem.item_image_url,
        status: dbItem.status,
        obtained_at: dbItem.obtained_at,
        withdrawal_status: dbItem.withdrawal_status
      }));

      // Простая дедупликация по ID
      const uniqueItems = convertedItems.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      );

      setItems(uniqueItems);
      console.log('✅ Загружено', uniqueItems.length, 'предметов из базы данных');
    } catch (error) {
      console.error('❌ Failed to load inventory from database:', error);
    } finally {
      setLoading(false);
    }
  };

  // Функция для миграции localStorage в базу данных
  const migrateLocalStorage = async (telegramId: number) => {
    try {
      await InventoryService.migrateLocalStorageToDatabase(telegramId);
      // После миграции загружаем данные из базы
      await loadInventoryFromDatabase(telegramId);
    } catch (error) {
      console.error('Failed to migrate localStorage:', error);
    }
  };

  // Функция для проверки подключения к базе данных
  const checkDatabaseConnection = async () => {
    try {
      const telegramId = profile?.telegram_id;
      if (!telegramId) return false;
      
      // Пытаемся получить инвентарь из базы
      const dbItems = await InventoryService.getUserInventory(telegramId);
      console.log('Database connection successful, items count:', dbItems.length);
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  };

  // Инициализация при загрузке
  useEffect(() => {
    console.log('Profile changed:', profile);
    const telegramId = profile?.telegram_id;
    if (telegramId) {
      console.log('Telegram ID found:', telegramId);
      
      // localStorage больше не используется - все данные на сервере
      
      // Загружаем данные из базы данных
      console.log('Loading from database...');
      loadInventoryFromDatabase(telegramId);
      
      // Загружаем статистику из профиля
      if (profile.cases_opened !== undefined) {
        setCasesOpened(profile.cases_opened);
      }
      if (profile.total_spent !== undefined) {
        setSpent(profile.total_spent);
      }
      
      // Обрабатываем очередь предметов, если они есть (временно)
      if (pendingItems.length > 0) {
        console.log('Processing pending items:', pendingItems);
        pendingItems.forEach(async (pendingItem) => {
          await addItem(pendingItem);
        });
        setPendingItems([]); // Очищаем очередь
      }
    } else {
      console.log('No telegram ID yet, profile:', profile);
    }
  }, [profile]);

  // Проверяем подключение к базе при загрузке профиля
  useEffect(() => {
    if (profile?.telegram_id) {
      checkDatabaseConnection();
    }
  }, [profile]);

  // Real-time обновление инвентаря
  useEffect(() => {
    if (!profile?.telegram_id) return;

    console.log('🔄 Устанавливаем real-time подписку на инвентарь для telegram_id:', profile.telegram_id);

    const subscription = supabase
      .channel('inventory_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_inventory',
          filter: `telegram_id=eq.${profile.telegram_id}`
        },
        (payload) => {
          console.log('🔄 REAL-TIME: Инвентарь обновлен:', payload);
          
          // Обновляем инвентарь из базы данных
          loadInventoryFromDatabase(profile.telegram_id);
        }
      )
      .subscribe((status) => {
        console.log('🔄 Real-time inventory subscription status:', status);
      });

    return () => {
      console.log('🔄 Отключаем real-time подписку на инвентарь');
      subscription.unsubscribe();
    };
  }, [profile?.telegram_id]);

  // Данные теперь хранятся только в базе данных, localStorage не используется

  const addItem = async (item: InventoryItem & { spent?: number; purchased?: boolean }) => {
    try {
      console.log('addItem called with:', item);
      console.log('Current profile:', profile);
      
      // Получаем telegram_id из профиля пользователя
      const telegramId = profile?.telegram_id;
      if (!telegramId) {
        console.error('Telegram ID not found in profile, profile:', profile);
              // Если профиль еще не загружен, ждем загрузки
      if (!profile) {
        console.log('Profile not loaded yet, waiting...');
        return;
      }
        return;
      }

      console.log('Adding item to database with telegramId:', telegramId);

      // Проверка на дублирование по названию и кейсу
      const existingItem = items.find(existingItem => 
        existingItem.name === item.name && 
        existingItem.caseId === item.caseId
      );
      
      if (existingItem) {
        console.log('🚫 Предмет уже существует в инвентаре, пропускаем добавление:', existingItem);
        return;
      }
      
      // Дополнительная проверка - если предмет уже был продан, не добавляем
      if (item.status === 'sold') {
        console.log('🚫 Предмет уже был продан, пропускаем добавление:', item);
        return;
      }

      try {
        // Пытаемся добавить предмет в базу данных
        const newItemId = await InventoryService.addItemToInventory(telegramId, item);
        
        if (newItemId) {
          console.log('Item added successfully to database with ID:', newItemId);
          
          // Простая проверка по ID
          const duplicateCheck = items.find(existingItem => existingItem.id === newItemId);
          if (duplicateCheck) {
            console.log('🚫 Предмет с таким ID уже существует, пропускаем добавление в состояние');
            return;
          }
          
          // Обновляем локальное состояние инвентаря
          const newItem = { ...item, id: newItemId, status: 'new' as const };
          setItems(prev => [...prev, newItem]);
          
          console.log('✅ Предмет добавлен в инвентарь:', newItem.name);
        } else {
          console.error('Failed to get new item ID from database');
          throw new Error('Database operation failed');
        }
      } catch (dbError) {
        console.error('Database error - item not added:', dbError);
        throw dbError;
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const removeItem = async (index: number) => {
    // Простое удаление из локального состояния
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const sellItem = async (index: number) => {
    try {
      console.log('🔄 sellItem вызван с индексом:', index);
      const item = items[index];
      console.log('📦 Предмет для продажи:', item);
      
      if (!item || item.status === 'sold' || !item.id) {
        console.error('❌ Предмет не найден или уже продан:', { item, index });
        return 0;
      }

      const telegramId = profile?.telegram_id;
      if (!telegramId) {
        console.error('❌ Telegram ID not found in profile');
        return 0;
      }

      console.log('🔧 Вызываем InventoryService.sellItem:', { itemId: item.id, telegramId });

      // Продаем предмет через базу данных
      const sellPrice = await InventoryService.sellItem(item.id, telegramId);
      
      if (sellPrice >= 0) { // Изменяем > 0 на >= 0
        console.log('✅ Предмет продан за:', sellPrice);
        console.log('🗑️ Удаляем предмет из локального состояния...');
        
        // Удаляем предмет из локального состояния
        setItems(prev => {
          const newItems = prev.filter((_, i) => i !== index);
          console.log('📊 Состояние обновлено:', { 
            oldCount: prev.length, 
            newCount: newItems.length,
            removedItem: item.name 
          });
          return newItems;
        });
        
        console.log('✅ Предмет успешно удален из состояния');
        
        // Обновляем инвентарь из базы данных
        await refreshItems();
        
        return sellPrice;
      } else {
        console.error('❌ Не удалось продать предмет, цена:', sellPrice);
        return 0;
      }
    } catch (error) {
      console.error('❌ Failed to sell item:', error);
      return 0;
    }
  };

  const withdrawItem = async (index: number) => {
    try {
      console.log('🔄 withdrawItem вызван с индексом:', index);
      const item = items[index];
      console.log('📦 Предмет для вывода:', item);
      
      if (!item || !item.id) {
        console.error('❌ Предмет не найден:', { item, index });
        return;
      }

      const telegramId = profile?.telegram_id;
      if (!telegramId) {
        console.error('❌ Telegram ID not found in profile');
        return;
      }

      console.log('🔧 Вызываем InventoryService.withdrawItem:', { itemId: item.id, telegramId });

      // Выводим предмет через базу данных
      const success = await InventoryService.withdrawItem(item.id, telegramId);
      
      if (success) {
        console.log('✅ Предмет успешно выведен');
        // Удаляем предмет из локального состояния
        setItems(prev => prev.filter((_, i) => i !== index));
      } else {
        console.error('❌ Не удалось вывести предмет');
      }
    } catch (error) {
      console.error('❌ Failed to withdraw item:', error);
    }
  };

  const refreshItems = async () => {
    const telegramId = profile?.telegram_id;
    if (telegramId) {
      await loadInventoryFromDatabase(telegramId);
    }
  };

  const syncInventory = async () => {
    const telegramId = profile?.telegram_id;
    if (telegramId) {
      // Сначала мигрируем localStorage если есть
      await migrateLocalStorage(telegramId);
      // Затем загружаем из базы
      await loadInventoryFromDatabase(telegramId);
    }
  };

  const getTotalValue = async () => {
    return items.filter(item => item.status !== 'sold').reduce((sum, item) => sum + item.price, 0);
  };

  const getCasesOpened = async () => casesOpened;

  const clear = async () => {
    setItems([]);
    setCasesOpened(0);
    setSpent(0);
    setPurchased(0);
    
    // Данные теперь хранятся только в базе данных
    console.log('Inventory cleared (database-only mode)');
  };

  // localStorage больше не используется

  return (
    <InventoryContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      sellItem, 
      withdrawItem, 
      clear, 
      refreshItems, 
      getTotalValue, 
      getCasesOpened, 
      casesOpened, 
      spent, 
      purchased,
      syncInventory,
      loading
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}; 