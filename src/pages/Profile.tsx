import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useInventory } from '@/hooks/useInventory';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  DollarSign, 
  Package, 
  ArrowLeft
} from 'lucide-react';

const Profile = () => {
  const { telegramUser, balance, signOutTelegram, setBalance, profile, setTelegramUser } = useAuth();
  const { items: inventoryItems, sellItem } = useInventory();
  const { toast } = useToast();
  const [sellingItem, setSellingItem] = useState<number | null>(null);

  // Мок-функция для авторизации через Telegram (заменить на реальную интеграцию)
  const handleTelegramLogin = () => {
    setTelegramUser({
      id: 1,
      first_name: 'Имя',
      last_name: 'Фамилия',
      username: 'username',
      photo_url: '',
    });
  };

  if (!telegramUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Войдите в аккаунт</h1>
          <p className="text-gray-400 mb-8 max-w-md text-center">
            Для просмотра профиля необходимо войти через Telegram
          </p>
          <Button
            className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none text-lg px-8 py-3 font-bold"
            onClick={handleTelegramLogin}
          >
            Войти через Telegram
          </Button>
          <Link to="/" className="mt-8">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться на главную
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSellItem = async (index: number) => {
    setSellingItem(index);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const soldAmount = sellItem(index);
    setBalance(balance + soldAmount);
    setSellingItem(null);
    toast({
      title: "Предмет продан!",
      description: `Вы получили ${soldAmount}₽ за продажу предмета`,
    });
  };

  // Формирование имени пользователя
  const displayName = telegramUser.first_name || telegramUser.last_name
    ? `${telegramUser.first_name || ''} ${telegramUser.last_name || ''}`.trim()
    : 'Пользователь Telegram';
  const displayUsername = telegramUser.username ? `@${telegramUser.username}` : '';

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-gray-800/90 text-white rounded-2xl shadow-2xl p-8 mt-8 animate-fade-in flex flex-col items-center border border-gray-700">
          {/* Аватар и имя */}
          {telegramUser.photo_url ? (
            <img
              src={telegramUser.photo_url}
              alt={displayName}
              className="w-24 h-24 rounded-full border-4 border-purple-500 shadow-lg mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-4 border-purple-500 mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
          )}
          <div className="text-2xl font-bold mb-1">{displayName}</div>
          {displayUsername && <div className="text-gray-400 mb-2">{displayUsername}</div>}
          <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center">
              <span className="text-xs text-gray-300 mr-1">Баланс</span>
              <span className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-4 py-2 rounded-lg shadow border border-green-500 text-lg">{balance}₽</span>
            </span>
            <Button
              onClick={signOutTelegram}
              className="bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold px-6 py-2 rounded-lg border-none shadow hover:from-red-600 hover:to-purple-700 transition-all duration-200"
            >
              Выйти
            </Button>
          </div>
          <div className="w-full flex flex-col md:flex-row md:justify-between gap-4 mt-2">
            <div className="flex-1 bg-gray-900/80 rounded-xl p-4 flex flex-col items-center border border-gray-700">
              <span className="text-gray-400 text-sm mb-1">Потрачено за всё время</span>
              <span className="text-lg font-bold text-green-400">{profile?.total_spent ?? 0}₽</span>
            </div>
            <div className="flex-1 bg-gray-900/80 rounded-xl p-4 flex flex-col items-center border border-gray-700">
              <span className="text-gray-400 text-sm mb-1">Открыто кейсов</span>
              <span className="text-lg font-bold text-blue-400">{profile?.cases_opened ?? 0}</span>
            </div>
            <div className="flex-1 bg-gray-900/80 rounded-xl p-4 flex flex-col items-center border border-gray-700">
              <span className="text-gray-400 text-sm mb-1">Куплено товаров</span>
              <span className="text-lg font-bold text-purple-400">{profile?.total_orders ?? 0}</span>
            </div>
          </div>
        </div>
        {/* Инвентарь */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Инвентарь</span>
                <Badge variant="secondary" className="ml-2">
                  {inventoryItems.length} предметов
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {inventoryItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Инвентарь пуст</h3>
                  <p className="text-gray-400 mb-6">
                    Откройте кейсы, чтобы получить предметы в инвентарь
                  </p>
                  <Link to="/cases">
                    <Button className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none">
                      Открыть кейсы
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventoryItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-red-500/50 transition-all duration-300"
                    >
                      {/* Изображение предмета */}
                      <div className="relative mb-3">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Badge 
                          className={`absolute top-2 right-2 border text-white bg-gray-600`}
                        >
                          {item.rarity}
                        </Badge>
                      </div>
                      {/* Информация о предмете */}
                      <div className="space-y-2">
                        <h3 className="text-white font-semibold text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 font-bold">
                            {Math.floor(item.price * 0.8)}₽
                          </span>
                          <span className="text-gray-400 text-xs line-through">
                            {item.price}₽
                          </span>
                        </div>
                        {/* Кнопка продажи */}
                        <Button
                          size="sm"
                          onClick={() => handleSellItem(index)}
                          disabled={sellingItem === index}
                          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-none"
                        >
                          {sellingItem === index ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                              Продажа...
                            </div>
                          ) : (
                            <>
                              <DollarSign className="w-3 h-3 mr-1" />
                              Продать
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile; 