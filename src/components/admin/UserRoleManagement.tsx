import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Shield, 
  Crown, 
  Headphones, 
  Video, 
  User, 
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  telegram_id: number;
  username: string;
  role: string; // Используем string для гибкости
  status: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export default function UserRoleManagement() {
  const { telegramUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Загружаем всех пользователей
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      setMessage({ type: 'error', text: 'Ошибка загрузки пользователей' });
    } finally {
      setLoading(false);
    }
  };

  // Изменяем роль пользователя
  const changeUserRole = async (userId: string, newRole: string) => {
    if (!telegramUser) return;

    try {
      setChangingRole(userId);
      
      // Обновляем роль пользователя напрямую
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole as any, 
          updated_at: new Date().toISOString() 
        })
        .eq('telegram_id', parseInt(userId));

      if (error) throw error;

      setMessage({ type: 'success', text: 'Роль пользователя успешно изменена' });
      // Обновляем список пользователей
      await fetchUsers();
    } catch (error) {
      console.error('Ошибка изменения роли:', error);
      setMessage({ type: 'error', text: 'Ошибка изменения роли пользователя' });
    } finally {
      setChangingRole(null);
    }
  };

  // Получаем иконку для роли
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4" />;
      case 'support':
        return <Headphones className="w-4 h-4" />;
      case 'youtuber':
        return <Video className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  // Получаем цвет для роли
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'support':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'youtuber':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Получаем название роли на русском
  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'support':
        return 'Поддержка';
      case 'youtuber':
        return 'Ютубер';
      default:
        return 'Пользователь';
    }
  };

  // Проверяем может ли пользователь получить доступ к админке
  const canAccessAdmin = (role: string) => {
    return role === 'admin' || role === 'support';
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Автоматически скрываем сообщения через 5 секунд
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-amber-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Управление ролями пользователей</h2>
            <p className="text-gray-400">Изменение ролей и прав доступа пользователей</p>
          </div>
        </div>
        <Button
          onClick={fetchUsers}
          variant="outline"
          className="bg-black/60 backdrop-blur-sm border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Обновить
        </Button>
      </div>

      {/* Сообщения */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/20 border-green-500/30 text-green-400' 
            : 'bg-red-500/20 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Статистика ролей */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30">
          <CardContent className="p-4 text-center">
            <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-3 border border-red-500/30">
              <Crown className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Администраторы</h3>
            <p className="text-xl font-bold text-red-400">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30">
          <CardContent className="p-4 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-3 border border-blue-500/30">
              <Headphones className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Поддержка</h3>
            <p className="text-xl font-bold text-blue-400">
              {users.filter(u => u.role === 'support').length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30">
          <CardContent className="p-4 text-center">
            <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-3 border border-purple-500/30">
              <Video className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Ютуберы</h3>
            <p className="text-xl font-bold text-purple-400">
              {users.filter(u => u.role === 'youtuber').length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30">
          <CardContent className="p-4 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center mb-3 border border-gray-500/30">
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-white font-semibold mb-1">Пользователи</h3>
            <p className="text-xl font-bold text-gray-400">
              {users.filter(u => u.role === 'user').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Список пользователей */}
      <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-6 h-6 mr-3 text-amber-400" />
            Список пользователей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-amber-500/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center border border-amber-500/30">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      {user.username || `User ${user.telegram_id}`}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      ID: {user.telegram_id} • Баланс: {user.balance || 0}₴
                    </p>
                    <p className="text-gray-500 text-xs">
                      Создан: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Текущая роль */}
                  <Badge className={`${getRoleColor(user.role)} border`}>
                    {getRoleIcon(user.role)}
                    <span className="ml-2">{getRoleName(user.role)}</span>
                  </Badge>

                  {/* Доступ к админке */}
                  {canAccessAdmin(user.role) && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Доступ к админке
                    </Badge>
                  )}

                  {/* Выбор новой роли */}
                  <Select
                    value={user.role}
                    onValueChange={(newRole) => changeUserRole(user.telegram_id.toString(), newRole)}
                    disabled={changingRole === user.telegram_id.toString()}
                  >
                    <SelectTrigger className="w-40 bg-black/60 backdrop-blur-sm border-amber-500/40 text-amber-300">
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-amber-500/30">
                      <SelectItem value="user">Пользователь</SelectItem>
                      <SelectItem value="youtuber">Ютубер</SelectItem>
                      <SelectItem value="support">Поддержка</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Индикатор загрузки */}
                  {changingRole === user.telegram_id.toString() && (
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
