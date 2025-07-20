// Скрипт для проверки подключения к Supabase и установки роли администратора
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://qwnqkgykltjxrahrgejf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3bnFrZ3lrbHRqeHJhaHJnZWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTYwNzgsImV4cCI6MjA2ODAzMjA3OH0.ZasOto8PCGVMeFLRTFLKHlse1v0HJh0xGIXY-XCSstM";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkConnection() {
  console.log('🔍 Проверяем подключение к Supabase...');
  
  try {
    // Проверяем подключение, получая список пользователей
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Ошибка подключения:', error);
      return;
    }
    
    console.log('✅ Подключение успешно!');
    console.log(`📊 Найдено пользователей: ${data.length}`);
    
    // Показываем всех пользователей
    console.log('\n👥 Список пользователей:');
    data.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Telegram ID: ${user.telegram_id || 'Нет'}`);
      console.log(`   Username: ${user.username || 'Нет'}`);
      console.log(`   Role: ${user.role || 'user'}`);
      console.log(`   Status: ${user.status || 'active'}`);
      console.log(`   Balance: ${user.balance || 0}`);
      console.log('---');
    });
    
    // Проверяем, есть ли пользователь с Telegram ID 936111949
    const adminUser = data.find(user => user.telegram_id === 936111949);
    
    if (adminUser) {
      console.log('👑 Найден пользователь с Telegram ID 936111949:');
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Status: ${adminUser.status}`);
      
      if (adminUser.role !== 'admin') {
        console.log('⚠️  Пользователь не является администратором. Обновляем...');
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('telegram_id', 936111949);
        
        if (updateError) {
          console.error('❌ Ошибка обновления роли:', updateError);
        } else {
          console.log('✅ Роль успешно обновлена на admin!');
        }
      } else {
        console.log('✅ Пользователь уже является администратором!');
      }
    } else {
      console.log('❌ Пользователь с Telegram ID 936111949 не найден');
      console.log('💡 Создайте профиль через Telegram авторизацию');
    }
    
  } catch (err) {
    console.error('❌ Критическая ошибка:', err);
  }
}

// Запускаем проверку
checkConnection(); 