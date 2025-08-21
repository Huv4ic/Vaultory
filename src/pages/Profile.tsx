import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Wallet, 
  ShoppingBag, 
  Gift, 
  Settings, 
  LogOut, 
  ArrowLeft,
  Crown,
  Star,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const navigate = useNavigate();
  const { telegramUser, signOutTelegram } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    casesOpened: 0,
    itemsSold: 0
  });

  // Убираем автоматическое обновление профиля - баланс не должен обновляться просто при просмотре профиля
  // useEffect(() => {
  //   if (telegramUser) {
  //     refreshTelegramProfile();
  //   }
  // }, [telegramUser, refreshTelegramProfile]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!telegramUser) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', telegramUser.id)
          .single();

        if (error) throw error;
        setProfile(data);
        
        // Здесь можно добавить загрузку статистики пользователя
        // Пока используем моковые данные
        setStats({
          totalPurchases: Math.floor(Math.random() * 50) + 10,
          totalSpent: Math.floor(Math.random() * 5000) + 1000,
          casesOpened: Math.floor(Math.random() * 100) + 20,
          itemsSold: Math.floor(Math.random() * 30) + 5
        });
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [telegramUser]);

  const handleLogout = () => {
    signOutTelegram();
    navigate('/');
  };

  const handleTopUp = () => {
    // Здесь должна быть логика пополнения баланса
    alert('Функция пополнения баланса будет доступна в ближайшее время!');
  };

  if (!telegramUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700 flex items-center justify-center">
        <div className="text-center bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">{t('Войдите в аккаунт')}</h1>
          <p className="text-white/80 mb-6 max-w-md">
            {t('Для просмотра профиля необходимо войти через Telegram')}
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
          >
            {t('Войти в аккаунт')}
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            👤 {t('Профиль')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Управляйте своим аккаунтом и отслеживайте активность
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация профиля */}
          <div className="lg:col-span-2 space-y-6">
            {/* Карточка профиля */}
            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-400 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">
                  {telegramUser.first_name} {telegramUser.last_name}
                </CardTitle>
                <CardDescription className="text-amber-300">
                  @{telegramUser.username || 'user'}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
                    <div className="text-2xl font-bold text-amber-400">{profile?.balance || 0}₴</div>
                    <div className="text-white/70 text-sm">Баланс</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20">
                    <div className="text-2xl font-bold text-emerald-400">{stats.totalPurchases}</div>
                    <div className="text-white/70 text-sm">Покупок</div>
                  </div>
                </div>
                
                <Button
                  onClick={handleTopUp}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  пополнить
                </Button>
              </CardContent>
            </Card>

            {/* Статистика */}
            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-amber-400" />
                  Статистика активности
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/20">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                    <div className="text-xl font-bold text-white">{stats.totalPurchases}</div>
                    <div className="text-white/70 text-sm">Покупок</div>
                  </div>
                  <div className="text-center p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/20">
                    <div className="text-2xl font-bold text-white mb-2">{stats.totalSpent}₴</div>
                    <div className="text-white/70 text-sm">Потрачено</div>
                  </div>
                  <div className="text-center p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/20">
                    <Gift className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                    <div className="text-xl font-bold text-white">{stats.casesOpened}</div>
                    <div className="text-white/70 text-sm">Кейсов</div>
                  </div>
                  <div className="text-center p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/20">
                    <Star className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <div className="text-xl font-bold text-white">{stats.itemsSold}</div>
                    <div className="text-white/70 text-sm">Продано</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Достижения */}
            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-amber-400" />
                  Достижения
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/20">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mr-4">
                      <ShoppingBag className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Первая покупка</div>
                      <div className="text-white/70 text-sm">Совершите первую покупку</div>
                    </div>
                    <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Получено
                    </Badge>
                  </div>
                  
                  <div className="flex items-center p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/20">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mr-4">
                      <Gift className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Открыватель кейсов</div>
                      <div className="text-white/70 text-sm">Откройте 10 кейсов</div>
                    </div>
                    <Badge className="ml-auto bg-amber-500/20 text-amber-400 border-amber-500/30">
                      {stats.casesOpened}/10
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Быстрые действия */}
            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white">Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate('/catalog')}
                  variant="outline"
                  className="w-full justify-start border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Перейти в каталог
                </Button>
                
                <Button
                  onClick={() => navigate('/cart')}
                  variant="outline"
                  className="w-full justify-start border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Корзина
                </Button>
                
                <Button
                  onClick={handleTopUp}
                  variant="outline"
                  className="w-full justify-start border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Пополнить баланс
                </Button>
              </CardContent>
            </Card>

            {/* Настройки */}
            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white">Настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки аккаунта
                </Button>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </CardContent>
            </Card>

            {/* Безопасность */}
            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                  Безопасность
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-emerald-500/20">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-emerald-400" />
                      <span className="text-white text-sm">Telegram авторизация</span>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Активна
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-amber-500/20">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-amber-400" />
                      <span className="text-white text-sm">Двухфакторная аутентификация</span>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      Рекомендуется
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-8 py-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 