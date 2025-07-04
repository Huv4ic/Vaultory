
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit, Crown, User } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBalance, setEditingBalance] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
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
                        <span className="text-green-400">{user.balance}₽</span>
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
                  <TableCell className="text-gray-300">
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={user.role === 'admin' ? 'destructive' : 'default'}
                      onClick={() => toggleRole(user.id, user.role)}
                    >
                      {user.role === 'admin' ? 'Снять админа' : 'Сделать админом'}
                    </Button>
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
