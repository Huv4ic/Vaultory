import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit, Crown, User, Ban, CheckCircle, Search } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

type User = (Tables<'user_stats'> & Tables<'profiles'>) & { role: 'user' | 'admin' | 'superadmin' };

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBalance, setEditingBalance] = useState(null);
  const [editingCases, setEditingCases] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [newCasesCount, setNewCasesCount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const { telegramUser, refreshProfile, profile } = useAuth();

  useEffect(() => {
    fetchUsers();
    
    // Подписываемся на изменения в таблице profiles для real-time обновления
    const subscription = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile change detected:', payload);
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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUsers((data || []).map((user: any) => ({
        ...user,
        role: user.role ?? 'user',
        updated_at: user.updated_at ?? user.created_at ?? '',
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить пользователей",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = async (userId, balance) => {
    try {
      const newBalance = parseInt(balance);
      if (isNaN(newBalance) || newBalance < 0) {
        toast({
          title: "Ошибка",
          description: "Баланс должен быть положительным числом",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Успех",
        description: `Баланс обновлен на $${newBalance}`,
      });
      setEditingBalance(null);
      setNewBalance('');
      
      // Обновляем локальное состояние немедленно
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, balance: newBalance }
            : user
        )
      );
      
      // Если это текущий пользователь, обновляем его профиль
      if (profile && userId === profile.id) {
        await refreshProfile();
      }
    } catch (error) {
      console.error('Ошибка при обновлении баланса:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить баланс",
        variant: "destructive",
      });
    }
  };

  const updateCasesOpened = async (userId, casesCount) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ cases_opened: parseInt(casesCount) })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Количество кейсов обновлено",
      });
      
      setEditingCases(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить количество кейсов",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
    
    if (!confirm(`Вы уверены, что хотите ${newStatus === 'banned' ? 'забанить' : 'разбанить'} этого пользователя?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Успех",
        description: `Пользователь ${newStatus === 'banned' ? 'забанен' : 'разбанен'}`,
      });
      
      fetchUsers();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус пользователя",
        variant: "destructive",
      });
    }
  };

  const toggleRole = async (userId, newRole) => {
    if (!confirm(`Вы уверены, что хотите назначить роль: ${newRole}?`)) {
      return;
    }
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      if (error) throw error;
      toast({
        title: "Успех",
        description: `Роль изменена на ${newRole}`,
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить роль",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="text-white text-sm sm:text-base">Загрузка пользователей...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Управление пользователями</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button
            onClick={async () => {
              try {
                // 1а создаём пользователя через Supabase Auth
                const email = `test${Date.now()}@test.com`;
                const password = 'testpassword123';
                console.log('Creating user with email:', email);
                
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
                  email, 
                  password,
                  options: {
                    data: {
                      username: `test-user-${Date.now()}`
                    }
                  }
                });
                
                if (signUpError) {
                  console.error('SignUp error:', signUpError);
                  toast({
                    title: "Ошибка",
                    description: `Не удалось создать пользователя в auth: ${signUpError.message}`,
                    variant: "destructive",
                  });
                  return;
                }
                
                if (!signUpData?.user) {
                  console.error('No user in signUpData:', signUpData);
                  toast({
                    title: "Ошибка",
                    description: "Не удалось создать пользователя: нет user в ответе",
                    variant: "destructive",
                  });
                  return;
                }
                
                console.log('User created successfully:',signUpData.user.id);
                
                // 2. Затем создаём профиль с тем же id
                const testUser = {
                  id: signUpData.user.id,
                  username: `test-user-${Date.now()}`,
                  balance: 10,
                  cases_opened: 0,
                  role: "user" as "user",
                  status: "active",
                };
                
                console.log('Creating profile with data:', testUser);
                
                const { error: profileError } = await supabase
                  .from('profiles')
                  .insert([testUser]);
                
                if (profileError) {
                  console.error('Profile creation error:', profileError);
                  toast({
                    title: "Ошибка",
                    description: `Не удалось создать профиль: ${profileError.message}`,
                    variant: "destructive",
                  });
                  return;
                }
                
                console.log('Profile created successfully');
                
                toast({
                  title: "Успех",
                  description: "Тестовый пользователь создан",
                });
                fetchUsers();
              } catch (error) {
                console.error('Unexpected error:', error);
                toast({
                  title: "Ошибка",
                  description: "Неожиданная ошибка при создании пользователя",
                  variant: "destructive",
                });
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
          >
            Создать тестового пользователя
          </Button>
          <div className="text-gray-300 text-xs sm:text-sm">
            Всего пользователей: {users.length} | Активных: {users.filter(u => u.status === 'active').length} | Забанено: {users.filter(u => u.status === 'banned').length}
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по имени или ID пользователя..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pl-10 text-sm sm:text-base"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2 text-sm sm:text-base"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="banned">Забанены</option>
            </select>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white text-lg sm:text-xl">Пользователи ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ScrollArea className="h-[400px] sm:h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300 text-xs sm:text-sm">Пользователь</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm hidden sm:table-cell">Статус</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm">Баланс</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm hidden lg:table-cell">Кейсы</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm hidden xl:table-cell">Потрачено</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm hidden xl:table-cell">Внесено</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm hidden lg:table-cell">Заказы</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">Регистрация</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm">Роль</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-white">
                      <div className="flex items-center space-x-2">
                        {String(user.role) === 'superadmin' ? (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        ) : String(user.role) === 'admin' ? (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <User className="w-4 h-4 text-gray-400" />
                        )}
                        <div>
                          <div className="text-xs sm:text-sm">{user.username || 'Без имени'}</div>
                          <div className="text-xs text-gray-400">{user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center space-x-2">
                        {user.status === 'active' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Ban className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-xs sm:text-sm ${user.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                          {user.status === 'active' ? 'Активен' : 'Забанен'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingBalance === user.id ? (
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                            className="w-20 sm:w-24 bg-gray-700 border-gray-600 text-white text-xs sm:text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => updateBalance(user.id, newBalance)}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                          >
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBalance(null)}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 text-xs sm:text-sm">${user.balance}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingBalance(user.id);
                              setNewBalance(user.balance?.toString() || '0');
                            }}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {editingCases === user.id ? (
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            value={newCasesCount}
                            onChange={(e) => setNewCasesCount(e.target.value)}
                            className="w-20 sm:w-24 bg-gray-700 border-gray-600 text-white text-xs sm:text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => updateCasesOpened(user.id, newCasesCount)}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                          >
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingCases(null)}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-400 text-xs sm:text-sm">{user.cases_opened || 0}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingCases(user.id);
                              setNewCasesCount(user.cases_opened?.toString() || '0');
                            }}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-red-400 text-xs sm:text-sm hidden xl:table-cell">
                      ${user.total_spent || 0}
                    </TableCell>
                    <TableCell className="text-green-400 text-xs sm:text-sm hidden xl:table-cell">
                      ${user.total_deposited || 0}
                    </TableCell>
                    <TableCell className="text-purple-400 text-xs sm:text-sm hidden lg:table-cell">
                      {user.total_orders || 0} (${user.orders_total || 0})
                    </TableCell>
                    <TableCell className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                      {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      {String(user.role) === 'superadmin' ? (
                        <span className="px-2 py-1 rounded bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs">superadmin</span>
                      ) : (
                        <Select
                          value={user.role}
                          onValueChange={async (value) => {
                            if (value !== user.role) {
                              await toggleRole(user.id, value);
                            }
                          }}
                          disabled={telegramUser?.username !== 'Hub4ic'}
                        >
                          <SelectTrigger className="w-[80px] sm:w-[110px] bg-gray-700 text-white text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">user</SelectItem>
                            <SelectItem value="admin">admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={user.status === 'banned' ? 'default' : 'destructive'}
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          className="text-xs sm:text-sm h-6 sm:h-8 px-2 sm:px-3"
                        >
                          {user.status === 'banned' ? 'Разбанить' : 'Забанить'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
