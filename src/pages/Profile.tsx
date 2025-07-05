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
  ArrowLeft, 
  LogOut,
  Crown,
  Star,
  Zap,
  Gem
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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'epic': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'rare': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Crown className="w-4 h-4" />;
      case 'epic': return <Gem className="w-4 h-4" />;
      case 'rare': return <Star className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-white">Профиль</h1>
          </div>
          {/* Баланс и кнопка выйти */}
          <div className="flex items-center space-x-4">
            <span className="bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold px-4 py-2 rounded-lg shadow text-lg">{balance}₽</span>
            <Button
              onClick={signOutTelegram}
              className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 border-none text-base"
            >
              Выйти
            </Button>
          </div>
        </div>
        <div className="max-w-xl mx-auto bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white rounded-2xl shadow-2xl p-8 mt-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {telegramUser?.photo_url ? (
                <img
                  src={telegramUser.photo_url}
                  alt={telegramUser.username || telegramUser.first_name}
                  className="w-16 h-16 rounded-full border-4 border-purple-500 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center border-4 border-purple-500">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div>
                <div className="text-2xl font-bold">{telegramUser?.first_name} {telegramUser?.last_name || ''}</div>
                {telegramUser?.username && (
                  <div className="text-gray-200">@{telegramUser.username}</div>
                )}
              </div>
            </div>
            <Button
              onClick={signOutTelegram}
              className="px-6 py-2 rounded-lg bg-white text-gray-900 font-bold border border-gray-300 shadow hover:bg-gray-100 transition-all duration-200"
            >
              Выйти
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mb-6">
            <div className="flex-1">
              <div className="text-xl font-semibold mb-2">Баланс</div>
              <div className="flex items-center bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold text-2xl px-6 py-3 rounded-lg shadow-lg animate-fade-in">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/></svg>
                {balance}₽
              </div>
            </div>
            <div className="flex-1 mt-6 md:mt-0">
              <div className="text-xl font-semibold mb-2">Открыто кейсов</div>
              <div className="flex items-center bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-2xl px-6 py-3 rounded-lg shadow-lg animate-fade-in">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>
                {profile?.cases_opened ?? 0}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <a
              href="https://t.me/Vaultory_manager"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-gray-900 font-bold px-6 py-2 rounded-lg border border-gray-300 shadow hover:bg-gray-100 transition-all duration-200"
            >
              Telegram поддержка
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Информация о пользователе */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Аватарка */}
                <div className="flex justify-center">
                  {telegramUser?.photo_url ? (
                    <img
                      src={telegramUser.photo_url}
                      alt={telegramUser.username || telegramUser.first_name}
                      className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center border-4 border-purple-500">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                {/* Имя пользователя */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {telegramUser?.first_name} {telegramUser?.last_name || ''}
                  </h2>
                  {telegramUser?.username && (
                    <p className="text-gray-400">@{telegramUser.username}</p>
                  )}
                </div>
                {/* Статистика */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Предметов в инвентаре</span>
                    <span className="font-semibold text-white">{inventoryItems.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Инвентарь */}
          <div className="lg:col-span-2">
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
                            className={`absolute top-2 right-2 ${getRarityColor(item.rarity)} border`}
                          >
                            {getRarityIcon(item.rarity)}
                            <span className="ml-1 capitalize">{item.rarity}</span>
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
      </div>
      <Footer />
    </div>
  );
};

export default Profile; 