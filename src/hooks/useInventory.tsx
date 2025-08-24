import React, { createContext, useContext, useState, useEffect } from 'react';

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
  addItem: (item: InventoryItem) => void; // убираю Promise
  removeItem: (index: number) => void;
  sellItem: (index: number) => number; // возвращает число, не Promise
  withdrawItem: (index: number) => void;
  clear: () => void;
  refreshItems: () => void; // убираю Promise
  getTotalValue: () => number; // убираю Promise
  getCasesOpened: () => number; // убираю Promise
  casesOpened: number;
  spent: number;
  purchased: number;
  syncInventory: () => void; // убираю Promise
  loading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
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

  // Инициализация при загрузке
  useEffect(() => {
    // Загружаем данные из localStorage
    const saved = localStorage.getItem('vaultory_inventory');
    if (saved) {
      const arr = JSON.parse(saved);
      const filtered = arr.filter((item: any) => item.status && item.status !== 'sold' && item.status !== 'withdrawn');
      setItems(filtered);
    }
  }, []);

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

  const addItem = (item: InventoryItem & { spent?: number; purchased?: boolean }) => {
    const newItem = {
      ...item,
      status: 'new' as const,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setItems(prev => [...prev, newItem]);
    setCasesOpened(prev => prev + 1);
    if (item.spent) setSpent(prev => prev + item.spent);
    if (item.purchased) setPurchased(prev => prev + 1);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const sellItem = (index: number) => {
    const item = items[index];
    if (!item || item.status === 'sold') return 0;
    const sellPrice = item.price;
    setItems(prev => prev.filter((_, i) => i !== index));
    return sellPrice;
  };

  const withdrawItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const refreshItems = () => {
    // Простое обновление из localStorage
    const saved = localStorage.getItem('vaultory_inventory');
    if (saved) {
      const arr = JSON.parse(saved);
      const filtered = arr.filter((item: any) => item.status && item.status !== 'sold' && item.status !== 'withdrawn');
      setItems(filtered);
    }
  };

  const syncInventory = () => {
    refreshItems();
  };

  const getTotalValue = () => {
    return items.filter(item => item.status !== 'sold').reduce((sum, item) => sum + item.price, 0);
  };

  const getCasesOpened = () => casesOpened;

  const clear = () => {
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