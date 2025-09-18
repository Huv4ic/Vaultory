// Тест Telegram бота API
// Запустите: node test-telegram-bot.js

const BOT_TOKEN = '8079495251:AAF5h2-x5SHUzy5TUFvTrdc5-gTBaAO1i8U';
const CHANNEL_USERNAME = 'vaultorysell';

async function testBotAPI() {
  console.log('🤖 Тестирование Telegram бота API...\n');

  try {
    // 1. Проверяем информацию о боте
    console.log('1️⃣ Проверка информации о боте...');
    const botInfoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const botInfo = await botInfoResponse.json();
    
    if (botInfo.ok) {
      console.log('✅ Бот найден:', botInfo.result.first_name);
      console.log('   Username:', botInfo.result.username);
      console.log('   ID:', botInfo.result.id);
    } else {
      console.log('❌ Ошибка получения информации о боте:', botInfo.description);
      return;
    }

    console.log('\n2️⃣ Проверка информации о канале...');
    const channelInfoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=@${CHANNEL_USERNAME}`);
    const channelInfo = await channelInfoResponse.json();
    
    if (channelInfo.ok) {
      console.log('✅ Канал найден:', channelInfo.result.title);
      console.log('   Username:', channelInfo.result.username);
      console.log('   Тип:', channelInfo.result.type);
      if (channelInfo.result.members_count) {
        console.log('   Подписчиков:', channelInfo.result.members_count);
      } else {
        console.log('   ⚠️ Количество подписчиков недоступно (бот не администратор?)');
      }
    } else {
      console.log('❌ Ошибка получения информации о канале:', channelInfo.description);
      console.log('   Возможные причины:');
      console.log('   - Бот не добавлен в канал');
      console.log('   - Бот не является администратором канала');
      console.log('   - Канал приватный');
    }

    console.log('\n3️⃣ Проверка прав бота в канале...');
    const chatMemberResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=@${CHANNEL_USERNAME}&user_id=${botInfo.result.id}`);
    const chatMember = await chatMemberResponse.json();
    
    if (chatMember.ok) {
      console.log('✅ Статус бота в канале:', chatMember.result.status);
      if (chatMember.result.status === 'administrator') {
        console.log('✅ Бот является администратором канала');
      } else {
        console.log('⚠️ Бот не является администратором канала');
      }
    } else {
      console.log('❌ Не удалось проверить права бота:', chatMember.description);
    }

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  }
}

// Запускаем тест
testBotAPI();
