import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  category_id: string | null;
  game_id: string | null;
  images: string[] | null;
  is_available: boolean | null;
  is_featured: boolean | null;
  stock_quantity: number | null;
  sort_order: number | null;
  tags: string[] | null;
  video_url: string | null;
  created_at: string;
  categories?: { name: string };
  games?: { name: string };
  total_sales: number;
  total_revenue: number;
  total_quantity: number;
  category_name: string;
  game_name: string;
}

const AdminProducts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    discount_price: null as number | null,
    category_id: '',
    images: [] as string[],
    video_url: '',
    stock_quantity: 0,
    is_available: true,
    is_featured: false,
    sort_order: 0,
    tags: [] as string[]
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<any[]> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          games(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Получаем статистику по покупкам
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('product_id, total_amount, quantity');

      if (ordersError) throw ordersError;

      // Объединяем данные
      return data.map(product => {
        const productOrders = ordersData.filter(o => o.product_id === product.id);
        const totalSales = productOrders.length;
        const totalRevenue = productOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const totalQuantity = productOrders.reduce((sum, o) => sum + (o.quantity || 1), 0);

        return {
          ...product,
          total_sales: totalSales,
          total_revenue: totalRevenue,
          total_quantity: totalQuantity,
          category_name: product.categories?.name || 'Без категории',
          game_name: product.games?.name || 'Неизвестная игра'
        };
      });
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (productData: any) => {
      const { error } = await supabase
        .from('products')
        .insert([productData]);
      
      if (error) throw error;
      
      await supabase.rpc('log_admin_action', {
        p_action: 'CREATE_PRODUCT',
        p_target_type: 'product',
        p_details: { name: productData.name }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Товар создан успешно' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Ошибка создания товара', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...productData }: any) => {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id);
      
      if (error) throw error;
      
      await supabase.rpc('log_admin_action', {
        p_action: 'UPDATE_PRODUCT',
        p_target_type: 'product',
        p_target_id: id,
        p_details: { name: productData.name }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Товар обновлен успешно' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Ошибка обновления товара', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await supabase.rpc('log_admin_action', {
        p_action: 'DELETE_PRODUCT',
        p_target_type: 'product',
        p_target_id: id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Товар удален успешно' });
    },
    onError: (error) => {
      toast({ title: 'Ошибка удаления товара', description: error.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      discount_price: null,
      category_id: '',
      images: [],
      video_url: '',
      stock_quantity: 0,
      is_available: true,
      is_featured: false,
      sort_order: 0,
      tags: []
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      discount_price: product.discount_price,
      category_id: product.category_id || '',
      images: product.images || [],
      video_url: product.video_url || '',
      stock_quantity: product.stock_quantity,
      is_available: product.is_available,
      is_featured: product.is_featured,
      sort_order: product.sort_order,
      tags: product.tags || []
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleAvailability = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_available: !product.is_available })
      .eq('id', product.id);
    
    if (error) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } else {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: `Товар ${!product.is_available ? 'включен' : 'отключен'}` });
    }
  };

  if (isLoading) {
    return <div className="text-white">Загрузка товаров...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление товарами</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Добавить товар
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Цена</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Категория</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stock">Количество</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                  />
                  <Label htmlFor="available">В наличии</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="featured">Рекомендуемый</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {editingProduct ? 'Обновить' : 'Создать'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Список товаров</CardTitle>
          <CardDescription className="text-gray-400">
            Всего товаров: {products?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Название</TableHead>
                <TableHead className="text-gray-300">Категория</TableHead>
                <TableHead className="text-gray-300">Игра</TableHead>
                <TableHead className="text-gray-300">Цена</TableHead>
                <TableHead className="text-gray-300">Количество</TableHead>
                <TableHead className="text-gray-300">Статус</TableHead>
                <TableHead className="text-gray-300">Продаж</TableHead>
                <TableHead className="text-gray-300">Доход</TableHead>
                <TableHead className="text-gray-300">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-white font-medium">
                    {product.name}
                    {product.is_featured && (
                      <Badge className="ml-2 bg-yellow-600">Топ</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {product.category_name}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {product.game_name}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {product.discount_price ? (
                      <div>
                        <span className="line-through text-gray-500">{product.price}₽</span>
                        <span className="ml-2 text-green-400">{product.discount_price}₽</span>
                      </div>
                    ) : (
                      `${product.price}₽`
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">{product.stock_quantity}</TableCell>
                  <TableCell>
                    <Badge variant={product.is_available ? 'default' : 'destructive'}>
                      {product.is_available ? 'В наличии' : 'Нет в наличии'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium text-lg">{product.total_sales}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium text-lg text-green-600">
                        {product.total_revenue.toLocaleString()} ₽
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAvailability(product)}
                      >
                        {product.is_available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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

export default AdminProducts;
