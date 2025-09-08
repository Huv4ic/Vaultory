import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Loader2, Users, DollarSign, Calendar, Shield, Crown, Sparkles, Zap, Star, Gem, Flame } from 'lucide-react';
import AdminProducts from './AdminProducts';
import AdminCases from './AdminCases';
import AdminWithdrawalRequests from './AdminWithdrawalRequests';
import UserRoleManagement from './UserRoleManagement';
import AdminTelegramStats from './AdminTelegramStats';

interface User {
  id: string;
  telegram_id: number | null;
  username: string | null;
  balance: number | null;
  cases_opened: number | null;
  total_deposited: number | null;
  total_spent: number | null;
  role: 'user' | 'admin' | null;
  status: string | null;
  block_reason?: string | null;
  blocked_at?: string | null;
  blocked_by?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function AdminPanel() {
  const { user, profile, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'products' | 'cases' | 'withdrawals' | 'roles' | 'telegram'>('users');


  useEffect(() => {
    // Загружаем пользователей при монтировании компонента
    fetchUsers();
    
    // Подписываемся на изменения в реальном времени
    const subscription = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          // Обновляем список пользователей при любых изменениях
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Ошибка при загрузке пользователей: ' + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserBalance = async (userId: string, newBalance: number) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (error) {
        throw error;
      }


      
      // Обновляем локальное состояние
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, balance: newBalance } : user
      ));
    } catch (err) {
      console.error('Error updating balance:', err);
      setError('Ошибка при обновлении баланса: ' + (err as any).message);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      setError(null);
      
      let newStatus: string;
      let blockReason: string | null = null;
      
      if (currentStatus === 'active') {
        newStatus = 'blocked';
        blockReason = prompt('Укажите причину блокировки:') || 'Нарушение правил сайта';
        if (blockReason === null) return; // Пользователь отменил
      } else {
        newStatus = 'active';
        blockReason = null;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: newStatus,
          block_reason: blockReason,
          blocked_at: newStatus === 'blocked' ? new Date().toISOString() : null,
          blocked_by: newStatus === 'blocked' ? profile?.telegram_id?.toString() : null
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Обновляем локальное состояние
      setUsers(prev => prev.map(user => 
        user.id === userId ? { 
          ...user, 
          status: newStatus,
          block_reason: blockReason,
          blocked_at: newStatus === 'blocked' ? new Date().toISOString() : null,
          blocked_by: newStatus === 'blocked' ? profile?.telegram_id?.toString() : null
        } : user 
      ));
      
      // Показываем уведомление
      if (newStatus === 'blocked') {
        alert(`Пользователь заблокирован. Причина: ${blockReason}`);
      } else {
        alert('Пользователь разблокирован');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Ошибка при обновлении статуса: ' + (err as any).message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Проверяем авторизацию через Telegram
  let telegramUser = null;
  try {
    telegramUser = JSON.parse(localStorage.getItem('vaultory_telegram_user') || 'null');
  } catch (error) {
    console.error('Error parsing Telegram user:', error);
  }
  
  if (!telegramUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400 rounded-full opacity-80"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-orange-400 rounded-full animate-bounce opacity-40"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black/80 backdrop-blur-xl rounded-full mb-6 border border-red-500/30 shadow-2xl shadow-red-500/30">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-white">ДОСТУП ЗАПРЕЩЕН</h2>
          <p className="text-lg text-gray-300 mb-8">Необходимы права администратора</p>
          <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6 text-sm text-gray-400">
            <p>User: {user ? 'Да' : 'Нет'}</p>
            <p>IsAdmin: {isAdmin ? 'Да' : 'Нет'}</p>
            <p>Profile Role: {profile?.role || 'Нет'}</p>
            <p>Telegram ID: {profile?.telegram_id || 'Нет'}</p>
            <p>Telegram User: {telegramUser ? 'Да' : 'Нет'}</p>
            <p>Telegram User ID: {telegramUser?.id || 'Нет'}</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Весь JSX пользователей вынесен в отдельную переменную ---
  const usersTab = (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="group relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <Card className="relative bg-black/90 backdrop-blur-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Всего пользователей</p>
                  <p className="text-3xl font-black text-blue-400">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-black/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-blue-500/30 shadow-xl shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="group relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <Card className="relative bg-black/90 backdrop-blur-xl border border-green-500/30 hover:border-green-400/50 transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Активные пользователи</p>
                  <p className="text-3xl font-black text-green-400">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-black/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-green-500/30 shadow-xl shadow-green-500/20 group-hover:rotate-12 transition-transform duration-500">
                  <Star className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="group relative">
          <div className="absolute inset-0 bg-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <Card className="relative bg-black/90 backdrop-blur-xl border border-red-500/30 hover:border-red-400/50 transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Заблокированные</p>
                  <p className="text-3xl font-black text-red-400">
                    {users.filter(u => u.status === 'blocked').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-black/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-red-500/30 shadow-xl shadow-red-500/20 group-hover:rotate-12 transition-transform duration-500">
                  <Shield className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="group relative">
          <div className="absolute inset-0 bg-yellow-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <Card className="relative bg-black/90 backdrop-blur-xl border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Общий баланс</p>
                  <p className="text-3xl font-black text-yellow-400">
                    {users.reduce((sum, user) => sum + (user.balance || 0), 0).toFixed(2)}₴
                  </p>
                </div>
                <div className="w-12 h-12 bg-black/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-yellow-500/30 shadow-xl shadow-yellow-500/20 group-hover:rotate-12 transition-transform duration-500">
                  <DollarSign className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      

      
      {/* Users Table */}
      <div className="group relative">
        <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        <Card className="relative bg-black/90 backdrop-blur-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center space-x-3 text-2xl font-black">
              <div className="w-8 h-8 bg-black/80 backdrop-blur-xl rounded-xl flex items-center justify-center border border-purple-500/30 shadow-xl shadow-purple-500/20">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-white">ПОЛЬЗОВАТЕЛИ</span>
            </CardTitle>
          </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400 text-sm sm:text-base">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">Пользователь</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm hidden sm:table-cell">Telegram ID</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">Баланс</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">Статус</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm hidden lg:table-cell">Дата регистрации</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                            <AvatarFallback className="bg-gray-600 text-white text-xs sm:text-sm">
                              {user.username?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-xs sm:text-sm">
                              {user.username || `User ${user.id.slice(0, 8)}`}
                            </p>
                            <p className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm hidden sm:table-cell">
                        {user.telegram_id}
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                          <span className="font-medium text-green-400 text-xs sm:text-sm">{(user.balance || 0).toFixed(2)}₴</span>
                          <Button
                            size="sm"
                            className="h-7 px-3 text-xs bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25"
                            onClick={() => {
                              const newBalance = prompt(`Введите новый баланс для ${user.username || 'пользователя'}:`, (user.balance || 0).toString());
                              if (newBalance !== null) {
                                const balance = parseFloat(newBalance);
                                if (!isNaN(balance) && balance >= 0) {
                                  updateUserBalance(user.id, balance);
                                } else {
                                  alert('Введите корректную сумму (больше или равно 0)');
                                }
                              }
                            }}
                          >
                            💰 Изменить
                          </Button>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <div className="flex flex-col space-y-1">
                          <Badge 
                            className={`text-xs ${user.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}
                          >
                            {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                          </Badge>
                          {user.status === 'blocked' && user.block_reason && (
                            <Badge className="bg-red-800 text-xs max-w-xs truncate" title={user.block_reason}>
                              🚫 {user.block_reason}
                            </Badge>
                          )}
                          {user.role && user.role !== 'user' && (
                            <Badge className="bg-purple-600 text-xs">
                              {user.role === 'admin' ? '👑 Админ' : user.role}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm hidden lg:table-cell">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                          <span>{user.created_at ? formatDate(user.created_at) : 'Не указано'}</span>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4">
                        <Button
                          size="sm"
                          className={`h-7 px-3 text-xs font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg ${
                            user.status === 'active' 
                              ? 'bg-red-500 hover:bg-red-400 text-black shadow-red-500/25' 
                              : 'bg-green-500 hover:bg-green-400 text-black shadow-green-500/25'
                          }`}
                          onClick={() => {
                            const action = user.status === 'active' ? 'заблокировать' : 'разблокировать';
                            if (confirm(`Вы уверены, что хотите ${action} пользователя ${user.username || 'ID: ' + user.id.slice(0, 8)}?`)) {
                              toggleUserStatus(user.id, user.status!);
                            }
                          }}
                        >
                          {user.status === 'active' ? '🚫 Заблокировать' : '✅ Разблокировать'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-8 sm:py-12 text-gray-400">
                  <Users className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">Пользователи не найдены</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        </Card>
        </div>
    </>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-green-400 rounded-full opacity-90"></div>
        <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-50"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-cyan-500/30 bg-black/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black/80 backdrop-blur-xl rounded-xl flex items-center justify-center border border-cyan-500/30 shadow-xl shadow-cyan-500/20">
                <Crown className="h-6 w-6 text-cyan-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">АДМИН ПАНЕЛЬ</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-cyan-400 text-sm font-bold hidden sm:block">Администратор</span>
              <Avatar className="h-8 w-8 border border-cyan-500/30">
                <AvatarImage src={telegramUser?.photo_url} />
                <AvatarFallback className="bg-black/80 backdrop-blur-xl text-cyan-400 text-sm font-bold">
                  {telegramUser?.first_name?.[0] || 'A'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Навигация по разделам */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-wrap sm:flex-nowrap space-x-3 mb-8 overflow-x-auto">
          <button
            className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 text-sm whitespace-nowrap hover:scale-105 ${
              activeTab === 'users' 
                ? 'bg-blue-500 text-black shadow-2xl shadow-blue-500/25' 
                : 'bg-black/80 backdrop-blur-xl border border-blue-500/30 text-blue-400 hover:border-blue-400/50 hover:bg-blue-500/10'
            }`}
            onClick={() => setActiveTab('users')}
          >
            👥 Пользователи
          </button>
          <button
            className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 text-sm whitespace-nowrap hover:scale-105 ${
              activeTab === 'products' 
                ? 'bg-green-500 text-black shadow-2xl shadow-green-500/25' 
                : 'bg-black/80 backdrop-blur-xl border border-green-500/30 text-green-400 hover:border-green-400/50 hover:bg-green-500/10'
            }`}
            onClick={() => setActiveTab('products')}
          >
            📦 Товары
          </button>
          <button
            className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 text-sm whitespace-nowrap hover:scale-105 ${
              activeTab === 'cases' 
                ? 'bg-purple-500 text-black shadow-2xl shadow-purple-500/25' 
                : 'bg-black/80 backdrop-blur-xl border border-purple-500/30 text-purple-400 hover:border-purple-400/50 hover:bg-purple-500/10'
            }`}
            onClick={() => setActiveTab('cases')}
          >
            🎁 Кейсы
          </button>
          <button
            className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 text-sm whitespace-nowrap hover:scale-105 ${
              activeTab === 'withdrawals' 
                ? 'bg-orange-500 text-black shadow-2xl shadow-orange-500/25' 
                : 'bg-black/80 backdrop-blur-xl border border-orange-500/30 text-orange-400 hover:border-orange-400/50 hover:bg-orange-500/10'
            }`}
            onClick={() => setActiveTab('withdrawals')}
          >
            💸 Запросы на вывод
          </button>
          <button
            className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 text-sm whitespace-nowrap hover:scale-105 ${
              activeTab === 'roles' 
                ? 'bg-yellow-500 text-black shadow-2xl shadow-yellow-500/25' 
                : 'bg-black/80 backdrop-blur-xl border border-yellow-500/30 text-yellow-400 hover:border-yellow-400/50 hover:bg-yellow-500/10'
            }`}
            onClick={() => setActiveTab('roles')}
          >
            🛡️ Роли
          </button>
          <button
            className={`px-6 py-3 rounded-2xl font-black transition-all duration-300 text-sm whitespace-nowrap hover:scale-105 ${
              activeTab === 'telegram' 
                ? 'bg-pink-500 text-black shadow-2xl shadow-pink-500/25' 
                : 'bg-black/80 backdrop-blur-xl border border-pink-500/30 text-pink-400 hover:border-pink-400/50 hover:bg-pink-500/10'
            }`}
            onClick={() => setActiveTab('telegram')}
          >
            📱 Telegram
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'users' && usersTab}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'cases' && <AdminCases />}
        {activeTab === 'withdrawals' && <AdminWithdrawalRequests />}
        {activeTab === 'roles' && <UserRoleManagement />}
        {activeTab === 'telegram' && <AdminTelegramStats />}
      </div>
    </div>
  );
} 