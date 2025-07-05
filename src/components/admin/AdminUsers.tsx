import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit, Crown, User } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBalance, setEditingBalance] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Получаем пользователей с аналитикой
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          role,
          balance,
          created_at,
          is_banned
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Получаем статистику по кейсам
      const { data: casesData, error: casesError } = await supabase
        .from('case_openings')
        .select('user_id, total_cost');

      if (casesError) throw casesError;

      // Получаем статистику по покупкам
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total_amount');

      if (ordersError) throw ordersError;

      // Получаем статистику по транзакциям
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('user_id, amount, type');

      if (transactionsError) throw transactionsError;

      // Объединяем данные
      const usersWithAnalytics = usersData.map(user => {
        const userCases = casesData.filter(c => c.user_id === user.id);
        const userOrders = ordersData.filter(o => o.user_id === user.id);
        const userTransactions = transactionsData.filter(t => t.user_id === user.id);

        const totalSpent = userCases.reduce((sum, c) => sum + (c.total_cost || 0), 0) +
                          userOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        
        const totalDeposit = userTransactions
          .filter(t => t.type === 'deposit')
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        return {
          ...user,
          cases_opened: userCases.length,
          products_bought: userOrders.length,
          total_spent: totalSpent,
          total_deposit: totalDeposit
        };
      });

      setUsers(usersWithAnalytics);
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

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
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

  if (loading) {
    return <div className="text-white">Загрузка пользователей...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Управление пользователями</h2>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Все пользователи ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Пользователь</TableHead>
                <TableHead className="text-gray-300">Роль</TableHead>
                <TableHead className="text-gray-300">Баланс</TableHead>
                <TableHead className="text-gray-300">Пополнено</TableHead>
                <TableHead className="text-gray-300">Потрачено</TableHead>
                <TableHead className="text-gray-300">Открыто кейсов</TableHead>
                <TableHead className="text-gray-300">Куплено товаров</TableHead>
                <TableHead className="text-gray-300">Статус</TableHead>
                <TableHead className="text-gray-300">Дата регистрации</TableHead>
                <TableHead className="text-gray-300">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-white">
                    {user.username || 'Без имени'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {user.role === 'admin' ? (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <User className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={user.role === 'admin' ? 'text-yellow-500' : 'text-gray-300'}>
                        {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
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
                        <span className="text-green-400 font-bold">{user.balance}₽</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingBalance(user.id);
                            setNewBalance(user.balance.toString());
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-blue-400 font-semibold">{user.total_deposit ?? 0}₽</TableCell>
                  <TableCell className="text-red-400 font-semibold">{user.total_spent ?? 0}₽</TableCell>
                  <TableCell className="text-purple-400 font-semibold">{user.cases_opened ?? 0}</TableCell>
                  <TableCell className="text-yellow-400 font-semibold">{user.products_bought ?? 0}</TableCell>
                  <TableCell>
                    {user.is_banned ? (
                      <span className="text-red-500 font-bold">Забанен</span>
                    ) : (
                      <span className="text-green-400 font-bold">Активен</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await supabase
                            .from('profiles')
                            .update({ role: user.role === 'admin' ? 'user' : 'admin' })
                            .eq('id', user.id);
                          fetchUsers();
                        }}
                      >
                        {user.role === 'admin' ? 'Снять админа' : 'Сделать админом'}
                      </Button>
                      <Button
                        size="sm"
                        variant={user.is_banned ? 'default' : 'destructive'}
                        onClick={async () => {
                          await supabase
                            .from('profiles')
                            .update({ is_banned: !user.is_banned })
                            .eq('id', user.id);
                          fetchUsers();
                        }}
                      >
                        {user.is_banned ? 'Разбанить' : 'Забанить'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
