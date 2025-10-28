import { supabase } from '../integrations/supabase/client';
import { InventoryItem } from '../hooks/useInventory';
import { refreshAchievements } from '../utils/achievementUtils';

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
  withdrawal_status: 'available' | 'withdrawal_requested' | 'withdrawn' | 'withdrawal_rejected';
  obtained_at: string;
  sold_at?: string;
  withdrawn_at?: string;
}

export class InventoryService {
  // Получить инвентарь пользователя (только доступные предметы)
  static async getUserInventory(telegramId: number): Promise<DatabaseInventoryItem[]> {
    try {
      console.log('🔍 Загружаем инвентарь для пользователя:', telegramId);
      
      const { data, error } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('telegram_id', telegramId)
        .eq('status', 'new')
        .in('withdrawal_status', ['available', 'withdrawal_rejected']) // Показываем только доступные предметы и отклоненные запросы
        .order('obtained_at', { ascending: false });

      if (error) {
        console.error('Error fetching user inventory:', error);
        throw error;
      }

      console.log('✅ Инвентарь загружен, предметов:', (data || []).length);
      console.log('📋 Фильтр: status=new, withdrawal_status IN (available, withdrawal_rejected)');

      // Приводим типы к правильному формату
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'new' | 'sold' | 'withdrawn',
        withdrawal_status: item.withdrawal_status as 'available' | 'withdrawal_requested' | 'withdrawn' | 'withdrawal_rejected'
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

      // ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА ДАННЫХ
      console.log('🔍 ПРОВЕРКА ВХОДНЫХ ДАННЫХ:');
      console.log('- Telegram ID:', telegramId, typeof telegramId);
      console.log('- Название предмета:', item.name, typeof item.name, 'Длина:', item.name?.length);
      console.log('- Цена:', item.price, typeof item.price);
      console.log('- Редкость:', item.rarity, typeof item.rarity);
      console.log('- Case ID:', item.caseId, typeof item.caseId, 'Длина:', item.caseId?.length);
      console.log('- Case Name:', item.case_name, typeof item.case_name);
      
      // Проверяем, не был ли предмет уже продан
      if (item.status === 'sold') {
        console.log('🚫 Предмет уже был продан, пропускаем добавление в БД');
        return null;
      }

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
        withdrawal_status: 'available', // Новые предметы всегда доступны
        obtained_at: new Date().toISOString()
      };

      console.log('📤 ФИНАЛЬНЫЕ ДАННЫЕ ДЛЯ БД:', insertData);

      const { data, error } = await supabase
        .from('user_inventory')
        .insert(insertData)
        .select('id')
        .single();

      if (error) {
        console.error('❌ ОШИБКА ПРИ ДОБАВЛЕНИИ В БД:', error);
        console.error('❌ Код ошибки:', error.code);
        console.error('❌ Сообщение:', error.message);
        console.error('❌ Детали:', error.details);
        console.error('❌ Подсказка:', error.hint);
        throw error;
      }

      console.log('✅ УСПЕШНО ДОБАВЛЕН В БД с ID:', data?.id);
      console.log('✅ Полные данные ответа:', data);
      return data?.id || null;
    } catch (error) {
      console.error('❌ КРИТИЧЕСКАЯ ОШИБКА в addItemToInventory:', error);
      console.error('❌ Тип ошибки:', typeof error);
      console.error('❌ Стек ошибки:', error instanceof Error ? error.stack : 'Нет стека');
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

      // Обновляем статистику проданных предметов
      try {
        // Используем функцию для обновления статистики проданных предметов
        const { error: statsError } = await supabase.rpc('increment_user_items_sold', {
          user_telegram_id: telegramId
        });

        if (statsError) {
          console.error('❌ Error updating items sold statistics:', statsError);
        } else {
          console.log('✅ Статистика проданных предметов обновлена');
        }
      } catch (error) {
        console.error('❌ Failed to update items sold statistics:', error);
      }

      // Добавляем деньги на баланс пользователя
      const { error: balanceError } = await supabase.rpc('update_user_balance', {
        user_id: telegramId,
        amount: itemPrice,
        description: 'Продажа предмета из инвентаря'
      });

      if (balanceError) {
        console.error('❌ Error updating balance:', balanceError);
        // Не бросаем ошибку, так как предмет уже продан
      } else {
        console.log('✅ Баланс успешно обновлен');
      }

      console.log('🎉 Предмет успешно продан за:', itemPrice);
      
      // Обновляем достижения
      await refreshAchievements();
      
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
