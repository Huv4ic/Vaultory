import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  User, 
  Wallet, 
  ShoppingBag, 
  Gift, 
  TrendingUp, 
  Star, 
  Award, 
  Settings, 
  LogOut,
  CreditCard,
  Shield,
  History
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useOrders } from '../hooks/useOrders';
import { useAchievements } from '../hooks/useAchievements';
import EditProfileModal from '../components/EditProfileModal';
import TopUpModal from '../components/TopUpModal';

const Profile = () => {
  const navigate = useNavigate();
  const { telegramUser, signOutTelegram, balance, profile, updateProfile } = useAuth();

  // Функция для форматирования числа с разделителями
  const formatNumber = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const { t } = useLanguage();
  const { getUserStatistics } = useOrders();
  const { achievements, loading: achievementsLoading, getAchievementStatus, getProgress, formatProgress } = useAchievements();
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    casesOpened: 0,
    itemsSold: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!telegramUser) return;
      
      try {
        // Загружаем реальную статистику пользователя
        const userStats = await getUserStatistics();
        
        // Загружаем количество проданных предметов из инвентаря
        const { data: soldItems, error: soldError } = await supabase
          .from('user_inventory')
          .select('id')
          .eq('telegram_id', telegramUser.id)
          .eq('status', 'sold');

        if (soldError) {
          console.error('Ошибка получения проданных предметов:', soldError);
        }

        const itemsSoldCount = soldItems ? soldItems.length : 0;
        
        if (userStats) {
          setStats({
            totalPurchases: (userStats as any).total_orders || 0,
            totalSpent: (userStats as any).total_spent || 0,
            casesOpened: (userStats as any).cases_opened || 0,
            itemsSold: itemsSoldCount
          });
        }
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [telegramUser, getUserStatistics]);

  // Синхронизация баланса в реальном времени
  useEffect(() => {
    if (telegramUser) {
      const interval = setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('balance')
            .eq('telegram_id', telegramUser.id)
            .single();
          
          if (!error && data?.balance !== undefined) {
            // Обновляем профиль только если баланс изменился
            // if (profile?.balance !== data.balance) { // This line is removed as per the new_code
            //   setProfile(prev => prev ? { ...prev, balance: data.balance } : null); // This line is removed as per the new_code
            // } // This line is removed as per the new_code
          }
        } catch (error) {
          console.error('Ошибка обновления баланса:', error);
        }
      }, 5000); // Проверяем каждые 5 секунд

      return () => clearInterval(interval);
    }
  }, [telegramUser, profile?.balance]);

  const handleLogout = () => {
    signOutTelegram();
    navigate('/');
  };

  const handleTopUp = () => {
    setShowTopUpModal(true);
  };

  const handleAvatarUpdate = async (avatarUrl: string) => {
    // Обновляем профиль в контексте аутентификации
    try {
      // Обновляем профиль в контексте
      if (updateProfile) {
        updateProfile({ avatar_url: avatarUrl });
      }
      
      console.log('Аватар обновлен:', avatarUrl);
    } catch (error) {
      console.error('Ошибка обновления аватара:', error);
    }
  };

  const refreshBalance = async () => {
    if (!telegramUser) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('telegram_id', telegramUser.id)
        .single();
      
      if (!error && data?.balance !== undefined) {
        // setProfile(prev => prev ? { ...prev, balance: data.balance } : null); // This line is removed as per the new_code
      }
    } catch (error) {
      console.error('Ошибка обновления баланса:', error);
    }
  };

  // Обновляем баланс при загрузке страницы
  useEffect(() => {
    if (telegramUser) {
      refreshBalance();
    }
  }, [telegramUser]);

  if (!telegramUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">{t('Войдите в аккаунт')}</h1>
          <p className="text-gray-300 mb-6 max-w-md">
            {t('Для просмотра профиля необходимо войти через Telegram')}
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
          >
            {t('Войти в аккаунт')}
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-amber-400/30 mx-auto mb-4"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-amber-400 mx-auto"></div>
          </div>
          <p className="text-gray-300 text-xl">{t('Загрузка профиля...')}</p>
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce animation-delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
            👤 {t('Профиль')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Добро пожаловать в ваш личный кабинет! Здесь вы можете управлять аккаунтом, 
            просматривать статистику и совершать покупки.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-32 right-20 w-12 h-12 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Основная информация профиля */}
        <div className="mb-6 sm:mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Аватар и основная информация */}
                <div className="text-center lg:text-left">
                  <div className="mx-auto lg:mx-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-2xl shadow-amber-500/30 overflow-hidden">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {profile?.username || telegramUser.first_name}
                  </h2>
                  <p className="text-gray-300 mb-2 sm:mb-3 text-xs sm:text-sm">@{telegramUser.username || 'user'}</p>
                  
                  {/* Роль пользователя */}
                  {profile?.role === 'admin' && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 mb-2 sm:mb-3 text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Администратор
                    </Badge>
                  )}
                  
                  {/* Статус */}
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Активен
                  </Badge>
                </div>

                {/* Баланс */}
                <div className="text-center lg:text-left">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 flex items-center justify-center lg:justify-start">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-400" />
                    Баланс
                  </h3>
                  <div className="text-xl sm:text-2xl font-bold text-amber-400 mb-2 sm:mb-3">
                    {balance || 0}₴
                  </div>
                  <Button
                    onClick={handleTopUp}
                    className="w-full lg:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 text-xs sm:text-sm"
                  >
                    <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    пополнить
                  </Button>
                </div>

                {/* Быстрые действия */}
                <div className="text-center lg:text-left">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Быстрые действия</h3>
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate('/catalog')}
                      variant="outline"
                      className="w-full py-2 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-lg text-xs sm:text-sm"
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Каталог
                    </Button>
                    <Button
                      onClick={() => navigate('/cases')}
                      variant="outline"
                      className="w-full py-2 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-lg text-xs sm:text-sm"
                    >
                      <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Кейсы
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Статистика */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-4 sm:mb-6">
            Ваша статистика
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-2 sm:mb-3 border border-amber-500/30">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-1 text-xs sm:text-sm">Покупки</h3>
                <p className="text-lg sm:text-xl font-bold text-amber-400">{stats.totalPurchases}</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 border border-amber-500/30">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm">Потрачено</h3>
                <p className="text-xl font-bold text-amber-400">{formatNumber(stats.totalSpent)}₴</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 border border-amber-500/30">
                  <Gift className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm">Кейсы открыто</h3>
                <p className="text-xl font-bold text-amber-400">{stats.casesOpened}</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 border border-amber-500/30">
                  <Star className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-1 text-sm">Предметы продано</h3>
                <p className="text-xl font-bold text-amber-400">{stats.itemsSold}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Достижения и настройки */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-6 h-6 mr-3 text-amber-400" />
                  Достижения
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievementsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-400 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {achievements.map((achievement) => {
                      const status = getAchievementStatus(achievement);
                      const progress = getProgress(achievement);
                      
                      return (
                        <div key={achievement.id} className="p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-amber-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-amber-500/30 rounded-full flex items-center justify-center">
                                {achievement.icon}
                              </div>
                              <div>
                                <span className="text-gray-300 font-medium">{achievement.title}</span>
                                <p className="text-gray-500 text-xs">{achievement.description}</p>
                              </div>
                            </div>
                            <Badge className={status.className}>
                              {status.label}
                            </Badge>
                          </div>
                          
                          {/* Прогресс бар */}
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-400">{formatProgress(achievement)}</span>
                              <span className="text-xs text-gray-400">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  achievement.completed 
                                    ? 'bg-green-500' 
                                    : achievement.current > 0 
                                      ? 'bg-amber-500' 
                                      : 'bg-gray-600'
                                }`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-amber-400" />
                  Настройки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() => navigate('/transaction-history')}
                    variant="outline"
                    className="w-full bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
                  >
                    <History className="w-4 h-4 mr-2" />
                    История транзакций
                  </Button>
                  
                  <Button
                    onClick={() => setShowEditModal(true)}
                    variant="outline"
                    className="w-full bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Редактировать профиль
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="px-8 py-3 bg-black/60 backdrop-blur-sm border border-red-500/40 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-red-200 transition-all duration-300 shadow-lg shadow-red-500/20 rounded-xl"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Выйти из аккаунта
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="px-8 py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
            >
              <Shield className="w-5 h-5 mr-2" />
              Вернуться на главную
            </Button>
          </div>
        </div>
      </div>
      <EditProfileModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        onAvatarUpdate={handleAvatarUpdate}
      />
      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
      />
    </div>
  );
};

export default Profile; 