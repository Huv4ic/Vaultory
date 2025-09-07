import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Loader2, Users, DollarSign, Calendar, Shield } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Доступ запрещен</h2>
          <p className="text-gray-400">Необходимы права администратора</p>
          <div className="mt-4 text-sm text-gray-500">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Всего пользователей</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400">{users.length}</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Активные пользователи</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <Badge className="bg-green-600 text-xs sm:text-sm">Активны</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Заблокированные</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-400">
                  {users.filter(u => u.status === 'blocked').length}
                </p>
              </div>
              <Badge className="bg-red-600 text-xs sm:text-sm">Заблокированы</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Общий баланс</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">
                  {users.reduce((sum, user) => sum + (user.balance || 0), 0).toFixed(2)}₴
                </p>
              </div>
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      

      
      {/* Users Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Пользователи</span>
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
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs border-green-600 text-green-400 hover:bg-green-900/20"
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
                          variant="outline"
                          size="sm"
                          className={`h-6 px-2 text-xs ${
                            user.status === 'active' 
                              ? 'border-red-600 text-red-400 hover:bg-red-900/20' 
                              : 'border-green-600 text-green-400 hover:bg-green-900/20'
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
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Админ панель</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-gray-400 text-xs sm:text-sm hidden sm:block">Администратор</span>
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                <AvatarImage src={telegramUser?.photo_url} />
                <AvatarFallback className="bg-gray-700 text-white text-xs sm:text-sm">
                  {telegramUser?.first_name?.[0] || 'A'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Навигация по разделам */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex flex-wrap sm:flex-nowrap space-x-2 sm:space-x-4 mb-6 sm:mb-8 overflow-x-auto">
          <button
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 border-b-2 text-xs sm:text-sm whitespace-nowrap ${activeTab === 'users' ? 'border-blue-500 text-blue-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={() => setActiveTab('users')}
          >
            Пользователи
          </button>
          <button
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 border-b-2 text-xs sm:text-sm whitespace-nowrap ${activeTab === 'products' ? 'border-green-500 text-green-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={() => setActiveTab('products')}
          >
            Товары
          </button>
          <button
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 border-b-2 text-xs sm:text-sm whitespace-nowrap ${activeTab === 'cases' ? 'border-purple-500 text-purple-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={() => setActiveTab('cases')}
          >
            Кейсы
          </button>
          <button
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 border-b-2 text-xs sm:text-sm whitespace-nowrap ${activeTab === 'withdrawals' ? 'border-orange-500 text-orange-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={() => setActiveTab('withdrawals')}
          >
            Запросы на вывод
          </button>
          <button
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 border-b-2 text-xs sm:text-sm whitespace-nowrap ${activeTab === 'roles' ? 'border-amber-500 text-amber-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={() => setActiveTab('roles')}
          >
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
            Роли
          </button>
          <button
            className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-200 border-b-2 text-xs sm:text-sm whitespace-nowrap ${activeTab === 'telegram' ? 'border-blue-500 text-blue-400 bg-gray-800' : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={() => setActiveTab('telegram')}
          >
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
            Telegram
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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