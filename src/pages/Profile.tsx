import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  Download
} from 'lucide-react';

const TELEGRAM_BOT = 'vaultory_notify_bot';

const Profile = () => {
  const { telegramUser, balance, signOutTelegram, setBalance, profile, setTelegramUser } = useAuth();
  const { items, casesOpened, spent, purchased, getTotalValue, sellItem, withdrawItem, getCasesOpened } = useInventory();
  const { toast } = useToast();
  const [sellingItem, setSellingItem] = useState<number | null>(null);
  const tgWidgetRef = useRef<HTMLDivElement>(null);

  // Вставка Telegram Login Widget (как в Header)
  useEffect(() => {
    if (telegramUser) return;
    if (tgWidgetRef.current) {
      tgWidgetRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?7';
      script.setAttribute('data-telegram-login', TELEGRAM_BOT);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-userpic', 'true');
      script.setAttribute('data-radius', '10');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.async = true;
      tgWidgetRef.current.appendChild(script);
    }
    (window as any).onTelegramAuth = function(user: any) {
      window.dispatchEvent(new CustomEvent('tg-auth', { detail: user }));
    };
    function handleTgAuth(e: any) {
      setTelegramUser(e.detail);
    }
    window.addEventListener('tg-auth', handleTgAuth);
    return () => window.removeEventListener('tg-auth', handleTgAuth);
  }, [telegramUser, setTelegramUser]);

  if (!telegramUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Войдите в аккаунт</h1>
          <p className="text-gray-400 mb-8 max-w-md text-center">
            Для просмотра профиля необходимо войти через Telegram
          </p>
          <div ref={tgWidgetRef} />
          <Link to="/" className="mt-8">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться на главную
            </Button>
          </Link>
        </div>
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
        description: `Вы получили ${soldAmount}₴ за продажу предмета`,
      });
  };

  const handleWithdrawItem = (index: number) => {
    withdrawItem(index);
    toast({
      title: "Заявка на вывод отправлена!",
      description: `Предмет будет обработан и выдан в ближайшее время`,
    });
  };

  // Формирование имени пользователя
  const displayName = telegramUser.first_name || telegramUser.last_name
    ? `${telegramUser.first_name || ''} ${telegramUser.last_name || ''}`.trim()
    : 'Пользователь Telegram';
  const displayUsername = telegramUser.username ? `@${telegramUser.username}` : '';

  return (
    <div className="min-h-screen bg-gray-900">
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
              <div className="flex items-center">
                <span className="text-xs text-gray-300 mr-2"></span>
                <span className="ml-0">
                  {/* Баланс в стиле шапки */}
                  <div className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-4 py-1 rounded-lg shadow border border-green-500 text-base flex items-center gap-1">
                    Баланс&nbsp;{balance}₽
                  </div>
                </span>
              </div>
            </span>
            <Button
              onClick={signOutTelegram}
              className="bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold px-6 py-2 rounded-lg border-none shadow hover:from-red-600 hover:to-purple-700 transition-all duration-200"
            >
              Выйти
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center min-h-[110px] min-w-[140px]">
              <span className="text-gray-400 text-base mb-1">Потрачено за всё время</span>
              <span className="text-2xl font-extrabold text-green-400">{spent}₽</span>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center min-h-[110px] min-w-[140px]">
              <span className="text-gray-400 text-base mb-1">Открыто кейсов</span>
              <span className="text-2xl font-extrabold text-blue-400">{casesOpened}</span>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 flex flex-col items-center min-h-[110px] min-w-[140px]">
              <span className="text-gray-400 text-base mb-1">Куплено товаров</span>
              <span className="text-2xl font-extrabold text-pink-400">{purchased}</span>
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
              </CardTitle>
              <div className="flex items-center gap-4 mt-4">
                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">{items.length} предметов</span>
                <span className="text-green-300 font-bold">Сумма: {getTotalValue()}₽</span>
                <span className="text-blue-400 font-bold">Открыто кейсов: {casesOpened}</span>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
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
                  {items.map((item, index) => (
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
                        <div className="text-green-400 font-bold text-lg mb-2">{item.price}₴</div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="primary"
                            className="w-1/2"
                            onClick={() => handleSellItem(index)}
                          >
                            Продать за {item.price}₴
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleWithdrawItem(index)}
                            disabled={item.status === 'withdrawn' || item.status === 'sold'}
                            className={`w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-none flex items-center justify-center gap-1 ${item.status === 'withdrawn' ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            {item.status === 'withdrawn' ? 'Получено' : (
                              <>
                                <Download className="w-3 h-3" />
                                Получить
                              </>
                            )}
                          </Button>
                        </div>
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
  );
};

export default Profile; 