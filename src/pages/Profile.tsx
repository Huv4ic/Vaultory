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
  const { telegramUser, balance, signOutTelegram, setBalance, profile } = useAuth();
  const { items: inventoryItems, sellItem } = useInventory();
  const { toast } = useToast();
  const [sellingItem, setSellingItem] = useState<number | null>(null);

  if (!telegramUser) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Войдите в аккаунт</h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Для просмотра профиля необходимо войти через Telegram
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться на главную
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSellItem = async (index: number) => {
    setSellingItem(index);
    
    // Имитация процесса продажи
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
          
          <Button
            onClick={signOutTelegram}
            className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all duration-200 transform hover:scale-105 border-none text-base"
          >
            Выйти
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Информация о пользователе */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Аватарка */}
                <div className="flex justify-center">
                  {telegramUser.photo_url ? (
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
                    {telegramUser.first_name} {telegramUser.last_name || ''}
                  </h2>
                  {telegramUser.username && (
                    <p className="text-gray-400">@{telegramUser.username}</p>
                  )}
                </div>

                {/* Баланс */}
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="text-white font-semibold">Баланс</span>
                    </div>
                    <span className="text-2xl font-bold text-green-400">{balance}₽</span>
                  </div>
                </div>

                {/* Статистика */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Предметов в инвентаре</span>
                    <span className="font-semibold text-white">{inventoryItems.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Всего открыто кейсов</span>
                    <span className="font-semibold text-white">{profile?.cases_opened ?? 0}</span>
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