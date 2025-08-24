import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryService, DatabaseInventoryItem } from '../services/inventoryService';
import { useAuth } from './useAuth';

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
  const [casesOpened, setCasesOpened] = useState(() => {
    const saved = localStorage.getItem('vaultory_cases_opened');
    return saved ? Number(saved) : 0;
  });
  const [spent, setSpent] = useState(() => {
    const saved = localStorage.getItem('vaultory_spent');
    return saved ? Number(saved) : 0;
  });
  const [purchased, setPurchased] = useState(() => {
    const saved = localStorage.getItem('vaultory_purchased');
    return saved ? Number(saved) : 0;
  });
  const [loading, setLoading] = useState(false);

  // Функция для загрузки инвентаря из базы данных
  const loadInventoryFromDatabase = async (telegramId: number) => {
    try {
      setLoading(true);
      const dbItems = await InventoryService.getUserInventory(telegramId);
      
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
        obtained_at: dbItem.obtained_at
      }));

      setItems(convertedItems);
    } catch (error) {
      console.error('Failed to load inventory from database:', error);
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

  // Инициализация при загрузке
  useEffect(() => {
    const telegramId = profile?.telegram_id;
    if (telegramId) {
      // Проверяем, есть ли данные в localStorage для миграции
      const localInventory = localStorage.getItem('vaultory_inventory');
      if (localInventory) {
        migrateLocalStorage(telegramId);
      } else {
        loadInventoryFromDatabase(telegramId);
      }
    }
  }, [profile]);

  // Сохраняем данные в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('vaultory_inventory', JSON.stringify(items));
  }, [items]);

  // Сохраняем остальные данные в localStorage
  useEffect(() => {
    localStorage.setItem('vaultory_cases_opened', String(casesOpened));
  }, [casesOpened]);
  useEffect(() => {
    localStorage.setItem('vaultory_spent', String(spent));
  }, [spent]);
  useEffect(() => {
    localStorage.setItem('vaultory_purchased', String(purchased));
  }, [purchased]);

  const addItem = async (item: InventoryItem & { spent?: number; purchased?: boolean }) => {
    try {
      // Получаем telegram_id из профиля пользователя
      const telegramId = profile?.telegram_id;
      if (!telegramId) {
        console.error('Telegram ID not found in profile');
        return;
      }

      // Добавляем предмет в базу данных
      const newItemId = await InventoryService.addItemToInventory(telegramId, item);
      
      if (newItemId) {
        // Обновляем локальное состояние
        const newItem = { ...item, id: newItemId, status: 'new' as const };
        setItems(prev => [...prev, newItem]);
        setCasesOpened(prev => prev + 1);
        if (item.spent) setSpent(prev => prev + item.spent);
        if (item.purchased) setPurchased(prev => prev + 1);
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
      const item = items[index];
      if (!item || item.status === 'sold' || !item.id) return 0;

      const telegramId = profile?.telegram_id;
      if (!telegramId) {
        console.error('Telegram ID not found in profile');
        return 0;
      }

      // Продаем предмет через базу данных
      const sellPrice = await InventoryService.sellItem(item.id, telegramId);
      
      if (sellPrice > 0) {
        // Удаляем предмет из локального состояния
        setItems(prev => prev.filter((_, i) => i !== index));
        return sellPrice;
      }
      
      return 0;
    } catch (error) {
      console.error('Failed to sell item:', error);
      return 0;
    }
  };

  const withdrawItem = async (index: number) => {
    try {
      const item = items[index];
      if (!item || !item.id) return;

      const telegramId = profile?.telegram_id;
      if (!telegramId) {
        console.error('Telegram ID not found in profile');
        return;
      }

      // Выводим предмет через базу данных
      const success = await InventoryService.withdrawItem(item.id, telegramId);
      
      if (success) {
        // Удаляем предмет из локального состояния
        setItems(prev => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Failed to withdraw item:', error);
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
  };

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