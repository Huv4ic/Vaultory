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

type User = Tables<'user_stats'> & Tables<'profiles'>;

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data || []).map((user: any) => ({
        ...user,
        role: user.role ?? 'user',
        updated_at: user.updated_at ?? user.created_at ?? '',
      })));
    } catch (error) {
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
      const { error } = await supabase
        .from('profiles')
        .update({ balance: parseInt(balance) })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Баланс обновлен",
      });
      
      setEditingBalance(null);
      fetchUsers();
    } catch (error) {
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

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    if (!confirm(`Вы уверены, что хотите ${newRole === 'admin' ? 'назначить администратором' : 'снять с роли администратора'} этого пользователя?`)) {
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
        description: `Роль изменена на ${newRole === 'admin' ? 'администратор' : 'пользователь'}`,
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
    return <div className="text-white">Загрузка пользователей...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление пользователями</h2>
        <div className="text-gray-300">
          Всего пользователей: {users.length} | Активных: {users.filter(u => u.status === 'active').length} | Забанено: {users.filter(u => u.status === 'banned').length}
        </div>
      </div>

      {/* Фильтры и поиск */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по имени или ID пользователя..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="banned">Забанены</option>
            </select>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Пользователи ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Пользователь</TableHead>
                  <TableHead className="text-gray-300">Статус</TableHead>
                  <TableHead className="text-gray-300">Баланс</TableHead>
                  <TableHead className="text-gray-300">Кейсы</TableHead>
                  <TableHead className="text-gray-300">Потрачено</TableHead>
                  <TableHead className="text-gray-300">Внесено</TableHead>
                  <TableHead className="text-gray-300">Заказы</TableHead>
                  <TableHead className="text-gray-300">Регистрация</TableHead>
                  <TableHead className="text-gray-300">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-white">
                      <div className="flex items-center space-x-2">
                        {user.role === 'admin' ? (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <User className="w-4 h-4 text-gray-400" />
                        )}
                        <div>
                          <div>{user.username || 'Без имени'}</div>
                          <div className="text-xs text-gray-400">{user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {user.status === 'active' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Ban className="w-4 h-4 text-red-500" />
                        )}
                        <span className={user.status === 'active' ? 'text-green-400' : 'text-red-400'}>
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
                            className="w-24 bg-gray-700 border-gray-600 text-white"
                          />
                          <Button
                            size="sm"
                            onClick={() => updateBalance(user.id, newBalance)}
                          >
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBalance(null)}
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400">{user.balance}₽</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingBalance(user.id);
                              setNewBalance(user.balance?.toString() || '0');
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCases === user.id ? (
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            value={newCasesCount}
                            onChange={(e) => setNewCasesCount(e.target.value)}
                            className="w-24 bg-gray-700 border-gray-600 text-white"
                          />
                          <Button
                            size="sm"
                            onClick={() => updateCasesOpened(user.id, newCasesCount)}
                          >
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingCases(null)}
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-400">{user.cases_opened || 0}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingCases(user.id);
                              setNewCasesCount(user.cases_opened?.toString() || '0');
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-red-400">
                      {user.total_spent || 0}₽
                    </TableCell>
                    <TableCell className="text-green-400">
                      {user.total_deposited || 0}₽
                    </TableCell>
                    <TableCell className="text-purple-400">
                      {user.total_orders || 0} ({user.orders_total || 0}₽)
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={user.status === 'banned' ? 'default' : 'destructive'}
                          onClick={() => toggleUserStatus(user.id, user.status)}
                        >
                          {user.status === 'banned' ? 'Разбанить' : 'Забанить'}
                        </Button>
                        <Button
                          size="sm"
                          variant={user.role === 'admin' ? 'destructive' : 'default'}
                          onClick={() => toggleRole(user.id, user.role)}
                        >
                          {user.role === 'admin' ? 'Снять админа' : 'Сделать админом'}
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
