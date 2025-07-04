import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Eye, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  status: string;
  payment_method: string;
  account_data: any;
  replacement_requested: boolean;
  replacement_reason: string;
  created_at: string;
  profiles: { username: string };
  products: { name: string };
}

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          profiles(username),
          products(name)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Order[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      await supabase.rpc('log_admin_action', {
        p_action: 'UPDATE_ORDER_STATUS',
        p_target_type: 'order',
        p_target_id: orderId,
        p_details: { status }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Статус заказа обновлен' });
    },
    onError: (error) => {
      toast({ title: 'Ошибка обновления статуса', description: error.message, variant: 'destructive' });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Ожидает</Badge>;
      case 'processing':
        return <Badge variant="default">Обработка</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Выполнен</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Отменен</Badge>;
      case 'refunded':
        return <Badge variant="outline">Возврат</Badge>;
      default:
        return <Badge variant="secondary">Ожидает</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-white">Загрузка заказов...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление заказами</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-gray-700 border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все заказы</SelectItem>
            <SelectItem value="pending">Ожидают</SelectItem>
            <SelectItem value="processing">В обработке</SelectItem>
            <SelectItem value="completed">Выполнены</SelectItem>
            <SelectItem value="cancelled">Отменены</SelectItem>
            <SelectItem value="refunded">Возвраты</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Всего заказов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{orders?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Ожидают</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {orders?.filter(o => o.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Выполнены</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {orders?.filter(o => o.status === 'completed').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Общая сумма</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0}₽
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Список заказов</CardTitle>
          <CardDescription className="text-gray-400">
            Управление всеми заказами пользователей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">ID</TableHead>
                <TableHead className="text-gray-300">Пользователь</TableHead>
                <TableHead className="text-gray-300">Товар</TableHead>
                <TableHead className="text-gray-300">Сумма</TableHead>
                <TableHead className="text-gray-300">Статус</TableHead>
                <TableHead className="text-gray-300">Дата</TableHead>
                <TableHead className="text-gray-300">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-white font-mono text-sm">
                    {order.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {order.profiles?.username || 'Неизвестен'}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {order.products?.name || 'Товар удален'}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {order.total_amount}₽
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                    {order.replacement_requested && (
                      <Badge variant="outline" className="ml-2">
                        Замена
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-white">
                          <DialogHeader>
                            <DialogTitle>Детали заказа</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold">Информация о заказе</h4>
                                <p>ID: {selectedOrder.id}</p>
                                <p>Пользователь: {selectedOrder.profiles?.username}</p>
                                <p>Товар: {selectedOrder.products?.name}</p>
                                <p>Количество: {selectedOrder.quantity}</p>
                                <p>Сумма: {selectedOrder.total_amount}₽</p>
                                <p>Способ оплаты: {selectedOrder.payment_method || 'Не указан'}</p>
                              </div>
                              
                              {selectedOrder.account_data && (
                                <div>
                                  <h4 className="font-semibold">Данные аккаунта</h4>
                                  <pre className="bg-gray-700 p-2 rounded text-sm">
                                    {JSON.stringify(selectedOrder.account_data, null, 2)}
                                  </pre>
                                </div>
                              )}
                              
                              {selectedOrder.replacement_requested && (
                                <div>
                                  <h4 className="font-semibold">Запрос на замену</h4>
                                  <p>Причина: {selectedOrder.replacement_reason}</p>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="font-semibold">Изменить статус</h4>
                                <Select
                                  value={selectedOrder.status}
                                  onValueChange={(status) => 
                                    updateStatusMutation.mutate({ orderId: selectedOrder.id, status })
                                  }
                                >
                                  <SelectTrigger className="bg-gray-700 border-gray-600">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Ожидает</SelectItem>
                                    <SelectItem value="processing">В обработке</SelectItem>
                                    <SelectItem value="completed">Выполнен</SelectItem>
                                    <SelectItem value="cancelled">Отменен</SelectItem>
                                    <SelectItem value="refunded">Возврат</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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

export default AdminOrders;
