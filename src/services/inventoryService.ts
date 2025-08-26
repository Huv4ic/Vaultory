import { supabase } from '../integrations/supabase/client';
import { InventoryItem } from '../hooks/useInventory';

export interface DatabaseInventoryItem {
  id: string;
  item_name: string;
  item_price: number;
  item_rarity: string;
  item_type?: string;
  case_id?: string;
  case_name?: string;
  item_image?: string;
  item_image_url?: string;
  status: 'new' | 'sold' | 'withdrawn';
  obtained_at: string;
  sold_at?: string;
  withdrawn_at?: string;
}

export class InventoryService {
  // Получить инвентарь пользователя
  static async getUserInventory(telegramId: number): Promise<DatabaseInventoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('telegram_id', telegramId)
        .eq('status', 'new')
        .order('obtained_at', { ascending: false });

      if (error) {
        console.error('Error fetching user inventory:', error);
        throw error;
      }

      // Приводим типы к правильному формату
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'new' | 'sold' | 'withdrawn'
      }));
    } catch (error) {
      console.error('Failed to fetch user inventory:', error);
      return [];
    }
  }

  // Добавить предмет в инвентарь
  static async addItemToInventory(
    telegramId: number,
    item: InventoryItem
  ): Promise<string | null> {
    try {
      console.log('🔍 InventoryService.addItemToInventory вызван с данными:', {
        telegramId,
        item: {
          name: item.name,
          price: item.price,
          rarity: item.rarity,
          type: item.type,
          caseId: item.caseId,
          case_name: item.case_name,
          image: item.image,
          image_url: item.image_url
        }
      });

      const insertData = {
        telegram_id: telegramId,
        item_name: item.name,
        item_price: item.price,
        item_rarity: item.rarity,
        item_type: item.type,
        case_id: item.caseId,
        case_name: item.case_name,
        item_image: item.image,
        item_image_url: item.image_url,
        status: 'new',
        obtained_at: new Date().toISOString()
      };

      console.log('📤 Отправляем данные в БД:', insertData);

      const { data, error } = await supabase
        .from('user_inventory')
        .insert(insertData)
        .select('id')
        .single();

      if (error) {
        console.error('❌ Error adding item to inventory:', error);
        throw error;
      }

      console.log('✅ Предмет добавлен в БД с ID:', data?.id);
      return data?.id || null;
    } catch (error) {
      console.error('❌ Failed to add item to inventory:', error);
      return null;
    }
  }

  // Продать предмет
  static async sellItem(
    itemId: string,
    telegramId: number
  ): Promise<number> {
    try {
      console.log('🔄 Продаем предмет:', { itemId, telegramId });
      
      // Сначала получаем данные предмета
      const { data: itemData, error: fetchError } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('id', itemId)
        .eq('telegram_id', telegramId)
        .eq('status', 'new')
        .single();

      if (fetchError || !itemData) {
        console.error('❌ Error fetching item for sale:', fetchError);
        console.error('🔍 Item data:', itemData);
        return 0;
      }

      console.log('✅ Предмет найден:', itemData);
      const itemPrice = itemData.item_price;

      // Обновляем статус предмета на 'sold'
      const { error: updateError } = await supabase
        .from('user_inventory')
        .update({ 
          status: 'sold', 
          sold_at: new Date().toISOString() 
        })
        .eq('id', itemId)
        .eq('telegram_id', telegramId);

      if (updateError) {
        console.error('❌ Error updating item status:', updateError);
        throw updateError;
      }

      console.log('✅ Статус предмета обновлен на "sold"');

      // Добавляем деньги на баланс пользователя
      // Сначала получаем текущий баланс
      const { data: currentProfile, error: fetchBalanceError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('telegram_id', telegramId)
        .single();

      if (fetchBalanceError || !currentProfile) {
        console.error('❌ Error fetching current balance:', fetchBalanceError);
        console.log('💰 Возвращаем цену предмета без обновления баланса:', itemPrice);
        return itemPrice;
      }

      const newBalance = (currentProfile.balance || 0) + itemPrice;
      console.log('💰 Обновляем баланс:', { old: currentProfile.balance, new: newBalance });

      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ 
          balance: newBalance 
        })
        .eq('telegram_id', telegramId);

      if (balanceError) {
        console.error('❌ Error updating balance:', balanceError);
        // Не бросаем ошибку, так как предмет уже продан
      } else {
        console.log('✅ Баланс успешно обновлен');
      }

      console.log('🎉 Предмет успешно продан за:', itemPrice);
      return itemPrice;
    } catch (error) {
      console.error('❌ Failed to sell item:', error);
      return 0;
    }
  }

  // Вывести предмет
  static async withdrawItem(
    itemId: string,
    telegramId: number
  ): Promise<boolean> {
    try {
      console.log('🔄 Выводим предмет:', { itemId, telegramId });
      
      const { error } = await supabase
        .from('user_inventory')
        .update({ 
          status: 'withdrawn', 
          withdrawn_at: new Date().toISOString() 
        })
        .eq('id', itemId)
        .eq('telegram_id', telegramId)
        .eq('status', 'new');

      if (error) {
        console.error('❌ Error withdrawing item:', error);
        throw error;
      }

      console.log('✅ Предмет успешно выведен');
      return true;
    } catch (error) {
      console.error('❌ Failed to withdraw item:', error);
      return false;
    }
  }

  // Мигрировать существующий localStorage в базу данных
  static async migrateLocalStorageToDatabase(telegramId: number): Promise<void> {
    try {
      // Получаем данные из localStorage
      const localInventory = localStorage.getItem('vaultory_inventory');
      if (!localInventory) return;

      const items: InventoryItem[] = JSON.parse(localInventory);
      
      // Фильтруем только активные предметы
      const activeItems = items.filter(item => 
        item.status && item.status !== 'sold' && item.status !== 'withdrawn'
      );

      if (activeItems.length === 0) return;

      // Добавляем каждый предмет в базу данных
      for (const item of activeItems) {
        await this.addItemToInventory(telegramId, item);
      }
      
      console.log(`Migrated ${activeItems.length} items from localStorage to database`);
      
      // Очищаем localStorage после успешной миграции
      localStorage.removeItem('vaultory_inventory');
    } catch (error) {
      console.error('Failed to migrate localStorage to database:', error);
    }
  }
}
