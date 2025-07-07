import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Shield, Users, Package, BarChart3, Settings, ShoppingCart, FolderOpen, Gift, Gamepad2 } from 'lucide-react';
import AdminCases from '@/components/admin/AdminCases';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminStats from '@/components/admin/AdminStats';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminCategories from '@/components/admin/AdminCategories';
import AdminGames from '@/components/admin/AdminGames';

const sections = [
  { key: 'stats', label: 'Статистика', icon: BarChart3 },
  { key: 'games', label: 'Игры', icon: Gamepad2 },
  { key: 'products', label: 'Товары', icon: Package },
  { key: 'categories', label: 'Категории', icon: FolderOpen },
  { key: 'orders', label: 'Заказы', icon: ShoppingCart },
  { key: 'cases', label: 'Кейсы', icon: Gift },
  { key: 'users', label: 'Пользователи', icon: Users },
  { key: 'settings', label: 'Настройки', icon: Settings },
];

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('stats');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col py-8 px-4">
        <div className="mb-10 flex items-center gap-3 px-2">
          <Shield className="w-7 h-7 text-purple-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Vaultory Admin</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          {sections.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-lg font-medium hover:bg-gray-800/80 focus:outline-none ${activeSection === key ? 'bg-gradient-to-r from-purple-700 to-pink-700 text-white shadow-lg' : 'text-gray-300'}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 px-8 py-10 bg-gray-950 min-h-screen">
        {activeSection === 'stats' && <AdminStats />}
        {activeSection === 'games' && <AdminGames />}
        {activeSection === 'products' && <AdminProducts />}
        {activeSection === 'categories' && <AdminCategories />}
        {activeSection === 'orders' && <AdminOrders />}
        {activeSection === 'cases' && <AdminCases />}
        {activeSection === 'users' && <AdminUsers />}
        {activeSection === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};

export default Admin;
