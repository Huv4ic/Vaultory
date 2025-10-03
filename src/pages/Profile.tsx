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
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden flex items-center justify-center">
        <div className="text-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">{t('Войдите в аккаунт')}</h1>
          <p className="text-gray-300 mb-6 max-w-md">
            {t('Для просмотра профиля необходимо войти через Telegram')}
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
          >
            {t('Войти в аккаунт')}
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        {/* Плавающие частицы */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-red-400 rounded-full opacity-90"></div>
        <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
        
        {/* Светящиеся линии */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Главный заголовок с анимацией */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl rounded-full mb-6 border border-amber-500/30 shadow-2xl shadow-amber-500/30">
              <User className="w-10 h-10 md:w-12 md:h-12 text-amber-400" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white text-center">
              ПРОФИЛЬ
            </h1>
            <div className="w-32 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Описание */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Добро пожаловать, <span className="text-amber-400 font-bold">{profile?.username || telegramUser?.first_name}</span>! 
            Здесь вы можете <span className="text-blue-400 font-bold">управлять своим аккаунтом</span> и просматривать статистику.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Основная информация профиля */}
        <div className="mb-8 sm:mb-12">
          <div className="group relative">
            {/* Внешнее свечение */}
            <div className="absolute -inset-1 bg-amber-500/20 rounded-3xl blur-xl"></div>
            
            {/* Основная карточка */}
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-amber-500/30 p-8 hover:border-amber-400/50 transition-all duration-500 hover:scale-105">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Аватар и основная информация */}
                <div className="text-center lg:text-left">
                  <div className="relative mx-auto lg:mx-0 w-24 h-24 sm:w-28 sm:h-28 mb-6">
                    <div className="w-full h-full rounded-full overflow-hidden shadow-2xl shadow-amber-500/40">
                      <div className="w-full h-full bg-amber-500 flex items-center justify-center">
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
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-black animate-pulse shadow-lg shadow-green-500/50"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      {profile?.username || telegramUser.first_name}
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base font-medium">@{telegramUser.username || 'user'}</p>
                    
                    {/* Роли и статус */}
                    <div className="flex flex-col items-center lg:items-start space-y-2">
                      {profile?.role === 'admin' && (
                        <Badge className="bg-amber-500 text-white border-0 px-4 py-2 text-sm font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:scale-105 transition-transform duration-300">
                          <Shield className="w-4 h-4 mr-2" />
                          Администратор
                        </Badge>
                      )}
                      
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 text-sm font-bold rounded-xl hover:scale-105 transition-transform duration-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Активен
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Баланс */}
                <div className="text-center lg:text-left">
                  <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300">
                    <div className="flex items-center justify-center lg:justify-start mb-4">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mr-3 border border-amber-500/30">
                        <Wallet className="w-5 h-5 text-amber-400 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Баланс</h3>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-3xl sm:text-4xl font-black text-amber-400">
                        {formatNumber(balance || 0)}₴
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Доступно для покупок</div>
                    </div>
                    
                    <Button
                      onClick={handleTopUp}
                      className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 text-sm"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Пополнить баланс
                    </Button>
                  </div>
                </div>

                {/* Быстрые действия */}
                <div className="text-center lg:text-left">
                  <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <h3 className="text-xl font-bold text-white mb-6">Быстрые действия</h3>
                    <div className="space-y-4">
                      <Button
                        onClick={() => navigate('/catalog')}
                        variant="outline"
                        className="w-full py-3 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/40 backdrop-blur-sm border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-white transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl text-sm font-medium hover:scale-105"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Каталог товаров
                      </Button>
                      <Button
                        onClick={() => navigate('/cases')}
                        variant="outline"
                        className="w-full py-3 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/40 backdrop-blur-sm border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white transition-all duration-300 shadow-lg shadow-purple-500/20 rounded-xl text-sm font-medium hover:scale-105"
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
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Ваша статистика
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Покупки */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-amber-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 text-center border border-amber-500/30 hover:border-amber-400/50 transition-all duration-500 hover:scale-105">
                <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/30 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-amber-500/20">
                  <ShoppingBag className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 mb-2">{stats.totalPurchases}</div>
                <p className="text-sm text-gray-300 font-medium">Покупки</p>
              </div>
            </div>

            {/* Потрачено */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-green-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 text-center border border-green-500/30 hover:border-green-400/50 transition-all duration-500 hover:scale-105">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 border border-green-500/30 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-green-500/20">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-green-400 mb-2">{formatNumber(stats.totalSpent)}₴</div>
                <p className="text-sm text-gray-300 font-medium">Потрачено</p>
              </div>
            </div>

            {/* Кейсы открыто */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-purple-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 text-center border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500 hover:scale-105">
                <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/30 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-purple-500/20">
                  <Gift className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-400 mb-2">{stats.casesOpened}</div>
                <p className="text-sm text-gray-300 font-medium">Кейсы открыто</p>
              </div>
            </div>

            {/* Предметы продано */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 text-center border border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 hover:scale-105">
                <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-blue-500/20">
                  <Star className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-400 mb-2">{stats.itemsSold}</div>
                <p className="text-sm text-gray-300 font-medium">Предметы продано</p>
              </div>
            </div>
          </div>
        </div>

        {/* Достижения и настройки */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative">
              <div className="absolute -inset-1 bg-amber-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-amber-500/30 p-8 hover:border-amber-400/50 transition-all duration-500 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mr-4 border border-amber-500/30 shadow-xl shadow-amber-500/20 group-hover:rotate-12 transition-all duration-500">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Достижения</h3>
                </div>
                
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
                        <div key={achievement.id} className="p-4 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl rounded-2xl border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                                {achievement.icon}
                              </div>
                              <div>
                                <span className="text-gray-300 font-bold">{achievement.title}</span>
                                <p className="text-gray-500 text-sm">{achievement.description}</p>
                              </div>
                            </div>
                            <Badge className={status.className}>
                              {status.label}
                            </Badge>
                          </div>
                          
                          {/* Прогресс бар */}
                          <div className="mt-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">{formatProgress(achievement)}</span>
                              <span className="text-sm text-gray-400">{progress.toFixed(0)}%</span>
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
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-blue-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-8 hover:border-blue-400/50 transition-all duration-500 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mr-4 border border-blue-500/30 shadow-xl shadow-blue-500/20 group-hover:rotate-12 transition-all duration-500">
                    <Settings className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Настройки</h3>
                </div>
                
                <div className="space-y-4">
                  <Button
                    onClick={() => navigate('/transaction-history')}
                    variant="outline"
                    className="w-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-xl font-medium hover:scale-105"
                  >
                    <History className="w-4 h-4 mr-2" />
                    История транзакций
                  </Button>
                  
                  <Button
                    onClick={() => setShowEditModal(true)}
                    variant="outline"
                    className="w-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/20 rounded-xl font-medium hover:scale-105"
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
              className="px-8 py-3 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl border border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-white transition-all duration-300 shadow-lg shadow-red-500/20 rounded-xl font-medium hover:scale-105"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Выйти из аккаунта
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="px-8 py-3 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-white transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl font-medium hover:scale-105"
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