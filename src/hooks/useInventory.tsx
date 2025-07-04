import React, { createContext, useContext, useState, useEffect } from 'react';

export interface InventoryItem {
  name: string;
  price: number;
  rarity: string;
  caseId?: string;
  image?: string;
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  removeItem: (index: number) => void;
  sellItem: (index: number) => number; // возвращает сумму продажи
  clear: () => void;
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
    setItems(prev => [...prev, item]);
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const sellItem = (index: number) => {
    const item = items[index];
    if (!item) return 0;
    setItems(prev => prev.filter((_, i) => i !== index));
    return Math.floor(item.price * 0.8);
  };

  const clear = () => setItems([]);

  return (
    <InventoryContext.Provider value={{ items, addItem, removeItem, sellItem, clear }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}; 