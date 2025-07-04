
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminCases from '@/components/admin/AdminCases';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminStats from '@/components/admin/AdminStats';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminCategories from '@/components/admin/AdminCategories';
import AdminGames from '@/components/admin/AdminGames';
import { Shield, Users, Package, BarChart3, Settings, ShoppingCart, FolderOpen, Gift, Gamepad2 } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();

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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent flex items-center">
            <Shield className="mr-3" />
            Панель администратора
          </h1>
          <p className="text-gray-400">Управление всем контентом Vaultory</p>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-8 bg-gray-800">
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Статистика</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Игры</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Товары</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <FolderOpen className="w-4 h-4" />
              <span>Категории</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Заказы</span>
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center space-x-2">
              <Gift className="w-4 h-4" />
              <span>Кейсы</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Пользователи</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Настройки</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="stats">
              <AdminStats />
            </TabsContent>
            
            <TabsContent value="games">
              <AdminGames />
            </TabsContent>
            
            <TabsContent value="products">
              <AdminProducts />
            </TabsContent>
            
            <TabsContent value="categories">
              <AdminCategories />
            </TabsContent>
            
            <TabsContent value="orders">
              <AdminOrders />
            </TabsContent>
            
            <TabsContent value="cases">
              <AdminCases />
            </TabsContent>
            
            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>
            
            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
