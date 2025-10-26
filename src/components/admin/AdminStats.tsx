
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Package, ShoppingCart, TrendingUp, DollarSign, Gift } from 'lucide-react';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCases: 0,
    totalCaseOpenings: 0,
    totalDeposited: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Получаем статистику пользователей
      const { data: usersData } = await supabase
        .from('user_stats')
        .select('*');

      // Получаем количество продуктов
      const { data: productsData } = await supabase
        .from('products')
        .select('id', { count: 'exact' });

      // Получаем статистику заказов
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount');

      // Получаем количество кейсов
      const { data: casesData } = await supabase
        .from('cases')
        .select('id', { count: 'exact' });

      // Получаем статистику открытий кейсов
      const { data: caseOpeningsData } = await supabase
        .from('case_openings')
        .select('total_cost');

      const totalUsers = usersData?.length || 0;
      const activeUsers = usersData?.filter(u => u.status === 'active').length || 0;
      const bannedUsers = usersData?.filter(u => u.status === 'banned').length || 0;
      const totalProducts = productsData?.length || 0;
      const totalOrders = ordersData?.length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const totalCases = casesData?.length || 0;
      const totalCaseOpenings = caseOpeningsData?.length || 0;
      const totalCaseRevenue = caseOpeningsData?.reduce((sum, opening) => sum + (opening.total_cost || 0), 0) || 0;
      
      const totalDeposited = usersData?.reduce((sum, user) => sum + (user.total_deposited || 0), 0) || 0;
      const totalSpent = usersData?.reduce((sum, user) => sum + (user.total_spent || 0), 0) || 0;

      setStats({
        totalUsers,
        activeUsers,
        bannedUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue + totalCaseRevenue,
        totalCases,
        totalCaseOpenings,
        totalDeposited,
        totalSpent
      });

    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить статистику",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-sm sm:text-base">Загрузка статистики...</div>;
  }

  const statCards = [
    {
      title: "Пользователи",
      value: stats.totalUsers,
      subtitle: `Активных: ${stats.activeUsers} | Забанено: ${stats.bannedUsers}`,
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Товары",
      value: stats.totalProducts,
      subtitle: "Всего товаров в каталоге",
      icon: Package,
      color: "text-green-400"
    },
    {
      title: "Заказы",
      value: stats.totalOrders,
      subtitle: "Всего заказов",
      icon: ShoppingCart,
      color: "text-purple-400"
    },
    {
      title: "Кейсы",
      value: stats.totalCases,
      subtitle: `Открытий: ${stats.totalCaseOpenings}`,
      icon: Gift,
      color: "text-orange-400"
    },
    {
      title: "Общий доход",
      value: `${stats.totalRevenue}₴`,
      subtitle: "От заказов и кейсов",
      icon: TrendingUp,
      color: "text-yellow-400"
    },
    {
      title: "Депозиты",
      value: `${stats.totalDeposited}₴`,
      subtitle: `Потрачено: ${stats.totalSpent}₴`,
      icon: DollarSign,
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Статистика</h2>
        <button
          onClick={fetchStats}
          className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Обновить
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className={`text-lg sm:text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Дополнительная статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-white text-base sm:text-lg">Финансовая сводка</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs sm:text-sm">Общий доход:</span>
              <span className="text-green-400 font-bold text-xs sm:text-sm">{stats.totalRevenue}₴</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs sm:text-sm">Внесено пользователями:</span>
              <span className="text-blue-400 font-bold text-xs sm:text-sm">{stats.totalDeposited}₴</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs sm:text-sm">Потрачено пользователями:</span>
              <span className="text-red-400 font-bold text-xs sm:text-sm">{stats.totalSpent}₴</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-600 pt-3 sm:pt-4">
              <span className="text-gray-300 text-xs sm:text-sm">Прибыль:</span>
              <span className="text-yellow-400 font-bold text-xs sm:text-sm">
                {stats.totalDeposited - stats.totalSpent}₴
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-white text-base sm:text-lg">Активность</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs sm:text-sm">Активные пользователи:</span>
              <span className="text-green-400 font-bold text-xs sm:text-sm">
                {stats.activeUsers} ({((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs sm:text-sm">Забанено:</span>
              <span className="text-red-400 font-bold text-xs sm:text-sm">
                {stats.bannedUsers} ({((stats.bannedUsers / stats.totalUsers) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs sm:text-sm">Средний доход с пользователя:</span>
              <span className="text-purple-400 font-bold text-xs sm:text-sm">
                {stats.totalUsers > 0 ? Math.round(stats.totalRevenue / stats.totalUsers) : 0}₴
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs sm:text-sm">Среднее открытий кейсов:</span>
              <span className="text-orange-400 font-bold text-xs sm:text-sm">
                {stats.totalUsers > 0 ? Math.round(stats.totalCaseOpenings / stats.totalUsers) : 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStats;
