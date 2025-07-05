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
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('vaultory_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vaultory_inventory', JSON.stringify(items));
  }, [items]);

  const addItem = (item: InventoryItem) => {
    setItems(prev => [...prev, { ...item, status: 'new' }]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const sellItem = (index: number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, status: 'sold' } : item));
    const item = items[index];
    if (!item || item.status === 'sold') return 0;
    return Math.floor(item.price * 0.8);
  };

  const withdrawItem = (index: number) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, status: 'withdrawn' } : item));
  };

  const getTotalValue = () => {
    return items.filter(item => item.status !== 'sold').reduce((sum, item) => sum + item.price, 0);
  };

  const getCasesOpened = () => {
    return items.length;
  };

  const clear = () => setItems([]);

  return (
    <InventoryContext.Provider value={{ items, addItem, removeItem, sellItem, withdrawItem, clear, getTotalValue, getCasesOpened }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}; 