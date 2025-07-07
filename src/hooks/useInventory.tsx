import React, { createContext, useContext, useState, useEffect } from 'react';

export interface InventoryItem {
  name: string;
  price: number;
  rarity: string;
  caseId?: string;
  image?: string;
  status?: 'new' | 'sold' | 'withdrawn';
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  removeItem: (index: number) => void;
  sellItem: (index: number) => number; // возвращает сумму продажи
  withdrawItem: (index: number) => void;
  clear: () => void;
  getTotalValue: () => number;
  getCasesOpened: () => number;
  casesOpened: number;
  spent: number;
  purchased: number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('vaultory_inventory');
    return saved ? JSON.parse(saved) : [];
  });
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

  useEffect(() => {
    localStorage.setItem('vaultory_inventory', JSON.stringify(items));
  }, [items]);
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
    setItems(prev => [...prev, { ...item, status: 'new' }]);
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
    const sellPrice = Math.floor(item.price * 0.8);
    setItems(prev => prev.filter((_, i) => i !== index)); // удаляем предмет
    return sellPrice;
  };

  const withdrawItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index)); // удаляем предмет
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
    <InventoryContext.Provider value={{ items, addItem, removeItem, sellItem, withdrawItem, clear, getTotalValue, getCasesOpened, casesOpened, spent, purchased }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}; 