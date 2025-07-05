import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminCases = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      
      // Получаем кейсы с аналитикой
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select(`
          *,
          games(name)
        `)
        .order('sort_order', { ascending: true });

      if (casesError) throw casesError;

      // Получаем статистику по открытиям
      const { data: openingsData, error: openingsError } = await supabase
        .from('case_openings')
        .select('case_id, total_cost');

      if (openingsError) throw openingsError;

      // Объединяем данные
      const casesWithAnalytics = casesData.map(caseItem => {
        const caseOpenings = openingsData.filter(o => o.case_id === caseItem.id);
        const totalOpenings = caseOpenings.length;
        const totalRevenue = caseOpenings.reduce((sum, o) => sum + (o.total_cost || 0), 0);

        return {
          ...caseItem,
          total_openings: totalOpenings,
          total_revenue: totalRevenue,
          game_name: caseItem.games?.name || 'Неизвестная игра'
        };
      });

      setCases(casesWithAnalytics);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить кейсы",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (caseData: any) => {
    try {
      if (editingCase) {
        await supabase
          .from('cases')
          .update(caseData)
          .eq('id', editingCase.id);
        toast({
          title: "Успешно",
          description: "Кейс обновлен",
        });
      } else {
        await supabase
          .from('cases')
          .insert(caseData);
        toast({
          title: "Успешно",
          description: "Кейс создан",
        });
      }
      setIsDialogOpen(false);
      setEditingCase(null);
      fetchCases();
    } catch (error) {
      console.error('Error saving case:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить кейс",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот кейс?')) return;
    
    try {
      await supabase
        .from('cases')
        .delete()
        .eq('id', id);
      toast({
        title: "Успешно",
        description: "Кейс удален",
      });
      fetchCases();
    } catch (error) {
      console.error('Error deleting case:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить кейс",
        variant: "destructive",
      });
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCase(null);
    fetchCases();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Управление кейсами</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
              <Plus className="w-4 h-4 mr-2" />
              Добавить кейс
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCase ? 'Редактировать кейс' : 'Создать кейс'}
              </DialogTitle>
            </DialogHeader>
            <CaseForm
              caseData={editingCase}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingCase(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список кейсов</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Игра</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Открытий</TableHead>
                <TableHead>Доход</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {caseItem.image && (
                        <img
                          src={caseItem.image}
                          alt={caseItem.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{caseItem.name}</div>
                        <div className="text-sm text-gray-500">
                          ID: {caseItem.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{caseItem.game_name}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{caseItem.price} ₽</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={caseItem.is_active ? "default" : "secondary"}>
                      {caseItem.is_active ? "Активен" : "Неактивен"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium text-lg">{caseItem.total_openings}</div>
                      <div className="text-sm text-gray-500">открытий</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium text-lg text-green-600">
                        {caseItem.total_revenue.toLocaleString()} ₽
                      </div>
                      <div className="text-sm text-gray-500">доход</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCase(caseItem);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(caseItem.id)}
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

const CaseForm = ({ caseData, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState({
    name: caseData?.name || '',
    price: caseData?.price || 0,
    description: caseData?.description || '',
    image: caseData?.image || '',
    gradient: caseData?.gradient || '',
    is_active: caseData?.is_active ?? true,
    sort_order: caseData?.sort_order || 0,
    game_id: caseData?.game_id || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Цена (₽)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
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
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="image">URL изображения</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="gradient">Градиент</Label>
          <Input
            id="gradient"
            value={formData.gradient}
            onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
            placeholder="linear-gradient(...)"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sort_order">Порядок сортировки</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="is_active">Активен</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
          {caseData ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
};

export default AdminCases;
