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
import { useInventory } from '../hooks/useInventory';
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
        // Загружаем индивидуальную статистику пользователя
        const userStats = await getUserStatistics();
        
        if (userStats) {
          console.log('📊 Загружена индивидуальная статистика пользователя:', userStats);
          setStats({
            totalPurchases: userStats.total_orders || 0,
            totalSpent: userStats.total_spent || 0,
            casesOpened: userStats.cases_opened || 0,
            itemsSold: userStats.items_sold || 0
          });
        } else {
          // Если статистика не найдена, инициализируем её
          console.log('📊 Статистика не найдена, инициализируем...');
          try {
            const { error: initError } = await supabase.rpc('initialize_user_statistics', {
              user_telegram_id: telegramUser.id
            });

            if (initError) {
              console.error('Ошибка инициализации статистики:', initError);
            } else {
              // Повторно загружаем статистику после инициализации
              const newUserStats = await getUserStatistics();
              if (newUserStats) {
                setStats({
                  totalPurchases: newUserStats.total_orders || 0,
                  totalSpent: newUserStats.total_spent || 0,
                  casesOpened: newUserStats.cases_opened || 0,
                  itemsSold: newUserStats.items_sold || 0
                });
              }
            }
          } catch (error) {
            console.error('Ошибка при инициализации статистики:', error);
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [telegramUser]);

  // Синхронизация баланса в реальном времени (упрощенная версия)
  useEffect(() => {
    if (telegramUser) {
      const interval = setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('balance')
            .eq('telegram_id', telegramUser.id)
            .single();
          
          // Просто проверяем, но не обновляем состояние автоматически
          if (!error && data?.balance !== undefined) {
            // Баланс обновляется через useAuth hook
            console.log('Баланс синхронизирован:', data.balance);
          }
        } catch (error) {
          console.error('Ошибка синхронизации баланса:', error);
        }
      }, 10000); // Проверяем каждые 10 секунд (реже)

      return () => clearInterval(interval);
    }
  }, [telegramUser]);

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
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center bg-[#181818] rounded-2xl p-8 border border-[#1c1c1c]">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-[#f0f0f0] mb-4">{t('Войдите в аккаунт')}</h1>
          <p className="text-[#a0a0a0] mb-6 max-w-md">
            {t('Для просмотра профиля необходимо войти через Telegram')}
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="px-8 py-4 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105"
          >
            {t('Войти в аккаунт')}
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-[#a31212] mx-auto mb-4"></div>
          <p className="text-[#a0a0a0] text-xl">{t('Загрузка профиля...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] relative">

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Главный заголовок */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-[#181818] rounded-full mb-6 border border-[#1c1c1c]">
              <User className="w-10 h-10 md:w-12 md:h-12 text-[#a31212]" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-[#f0f0f0] text-center">
              ПРОФИЛЬ
            </h1>
            <div className="w-32 h-1 bg-[#a31212] mx-auto rounded-full"></div>
          </div>
          
          {/* Описание */}
          <p className="text-lg md:text-xl lg:text-2xl text-[#a0a0a0] mb-12 max-w-4xl mx-auto leading-relaxed">
            Добро пожаловать, <span className="text-[#a31212] font-bold">{profile?.username || telegramUser?.first_name}</span>! 
            Здесь вы можете <span className="text-[#f0f0f0] font-bold">управлять своим аккаунтом</span> и просматривать статистику.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Основная информация профиля */}
        <div className="mb-8 sm:mb-12">
          <div className="group relative">
            {/* Основная карточка */}
            <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-8 hover:border-[#a31212] transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Аватар и основная информация */}
                <div className="text-center lg:text-left">
                  <div className="relative mx-auto lg:mx-0 w-24 h-24 sm:w-28 sm:h-28 mb-6">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <div className="w-full h-full bg-[#a31212] flex items-center justify-center">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                        )}
                      </div>
                    </div>
                    {/* Статус индикатор */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#181818]"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-black text-[#f0f0f0]">
                      {profile?.username || telegramUser.first_name}
                    </h2>
                    <p className="text-[#a0a0a0] text-sm sm:text-base font-medium">@{telegramUser.username || 'user'}</p>
                    
                    {/* Роли и статус */}
                    <div className="flex flex-col items-center lg:items-start space-y-2">
                      {profile?.role === 'admin' && (
                        <Badge className="bg-[#a31212] text-white border-0 px-4 py-2 text-sm font-bold rounded-xl">
                          <Shield className="w-4 h-4 mr-2" />
                          Администратор
                        </Badge>
                      )}
                      
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 text-sm font-bold rounded-xl">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        Активен
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Баланс */}
                <div className="text-center lg:text-left">
                  <div className="bg-[#181818] rounded-2xl p-6 border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300">
                    <div className="flex items-center justify-center lg:justify-start mb-4">
                      <div className="w-10 h-10 bg-[#a31212]/20 rounded-xl flex items-center justify-center mr-3 border border-[#a31212]/30">
                        <Wallet className="w-5 h-5 text-[#a31212]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#f0f0f0]">Баланс</h3>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-3xl sm:text-4xl font-black text-[#f0f0f0]">
                        ${formatNumber(balance || 0)}
                      </div>
                      <div className="text-sm text-[#a0a0a0] mt-1">Доступно для покупок</div>
                    </div>
                    
                    <Button
                      onClick={handleTopUp}
                      className="w-full px-6 py-3 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-black rounded-xl transition-all duration-300 text-sm"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Пополнить баланс
                    </Button>
                  </div>
                </div>

                {/* Быстрые действия */}
                <div className="text-center lg:text-left">
                  <div className="bg-[#181818] rounded-2xl p-6 border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300">
                    <h3 className="text-xl font-bold text-[#f0f0f0] mb-6">Быстрые действия</h3>
                    <div className="space-y-4">
                      <Button
                        onClick={() => navigate('/')}
                        variant="outline"
                        className="w-full py-3 bg-[#181818] border border-[#1c1c1c] text-[#f0f0f0] hover:bg-[#a31212] hover:border-[#a31212] hover:text-white transition-all duration-300 rounded-xl text-sm font-medium"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Каталог товаров
                      </Button>
                      <Button
                        onClick={() => navigate('/cases')}
                        variant="outline"
                        className="w-full py-3 bg-[#181818] border border-[#1c1c1c] text-[#f0f0f0] hover:bg-[#a31212] hover:border-[#a31212] hover:text-white transition-all duration-300 rounded-xl text-sm font-medium"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Открыть кейсы
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-[#f0f0f0] mb-4">
              Ваша статистика
            </h2>
            <div className="w-24 h-1 bg-[#a31212] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Покупки */}
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl p-6 text-center border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300">
                <div className="mx-auto w-16 h-16 bg-[#a31212]/20 rounded-2xl flex items-center justify-center mb-4 border border-[#a31212]/30">
                  <ShoppingBag className="w-8 h-8 text-[#a31212]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#f0f0f0] mb-2">{stats.totalPurchases}</div>
                <p className="text-sm text-[#a0a0a0] font-medium">Покупки</p>
              </div>
            </div>

            {/* Потрачено */}
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl p-6 text-center border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300">
                <div className="mx-auto w-16 h-16 bg-[#a31212]/20 rounded-2xl flex items-center justify-center mb-4 border border-[#a31212]/30">
                  <TrendingUp className="w-8 h-8 text-[#a31212]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#f0f0f0] mb-2">${formatNumber(stats.totalSpent)}</div>
                <p className="text-sm text-[#a0a0a0] font-medium">Потрачено</p>
              </div>
            </div>

            {/* Кейсы открыто */}
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl p-6 text-center border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300">
                <div className="mx-auto w-16 h-16 bg-[#a31212]/20 rounded-2xl flex items-center justify-center mb-4 border border-[#a31212]/30">
                  <Gift className="w-8 h-8 text-[#a31212]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#f0f0f0] mb-2">{stats.casesOpened}</div>
                <p className="text-sm text-[#a0a0a0] font-medium">Кейсы открыто</p>
              </div>
            </div>

            {/* Предметы продано */}
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl p-6 text-center border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300">
                <div className="mx-auto w-16 h-16 bg-[#a31212]/20 rounded-2xl flex items-center justify-center mb-4 border border-[#a31212]/30">
                  <Star className="w-8 h-8 text-[#a31212]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#f0f0f0] mb-2">{stats.itemsSold}</div>
                <p className="text-sm text-[#a0a0a0] font-medium">Предметы продано</p>
              </div>
            </div>
          </div>
        </div>

        {/* Достижения и настройки */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-8 hover:border-[#a31212] transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#a31212]/20 rounded-2xl flex items-center justify-center mr-4 border border-[#a31212]/30">
                    <Award className="w-6 h-6 text-[#a31212]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#f0f0f0]">Достижения</h3>
                </div>
                
                {achievementsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#a31212] border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {achievements.map((achievement) => {
                      const status = getAchievementStatus(achievement);
                      const progress = getProgress(achievement);
                      
                      return (
                        <div key={achievement.id} className="p-4 bg-[#181818] rounded-2xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[#a31212]/20 rounded-xl flex items-center justify-center border border-[#a31212]/30">
                                {achievement.icon}
                              </div>
                              <div>
                                <span className="text-[#f0f0f0] font-bold">{achievement.title}</span>
                                <p className="text-[#a0a0a0] text-sm">{achievement.description}</p>
                              </div>
                            </div>
                            <Badge className={status.className}>
                              {status.label}
                            </Badge>
                          </div>
                          
                          {/* Прогресс бар */}
                          <div className="mt-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-[#a0a0a0]">{formatProgress(achievement)}</span>
                              <span className="text-sm text-[#a0a0a0]">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-[#1c1c1c] rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  achievement.completed 
                                    ? 'bg-green-500' 
                                    : achievement.current > 0 
                                      ? 'bg-[#a31212]' 
                                      : 'bg-[#1c1c1c]'
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
              </div>
            </div>

            <div className="group relative">
              <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-8 hover:border-[#a31212] transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#a31212]/20 rounded-2xl flex items-center justify-center mr-4 border border-[#a31212]/30">
                    <Settings className="w-6 h-6 text-[#a31212]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#f0f0f0]">Настройки</h3>
                </div>
                
                <div className="space-y-4">
                  <Button
                    onClick={() => navigate('/transaction-history')}
                    variant="outline"
                    className="w-full bg-[#181818] border border-[#1c1c1c] text-[#f0f0f0] hover:bg-[#a31212] hover:border-[#a31212] hover:text-white transition-all duration-300 rounded-xl font-medium"
                  >
                    <History className="w-4 h-4 mr-2" />
                    История транзакций
                  </Button>
                  
                  <Button
                    onClick={() => setShowEditModal(true)}
                    variant="outline"
                    className="w-full bg-[#181818] border border-[#1c1c1c] text-[#f0f0f0] hover:bg-[#a31212] hover:border-[#a31212] hover:text-white transition-all duration-300 rounded-xl font-medium"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Редактировать профиль
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="px-8 py-3 bg-[#181818] border border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-white transition-all duration-300 rounded-xl font-medium"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Выйти из аккаунта
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="px-8 py-3 bg-[#181818] border border-[#1c1c1c] text-[#f0f0f0] hover:bg-[#a31212] hover:border-[#a31212] hover:text-white transition-all duration-300 rounded-xl font-medium"
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