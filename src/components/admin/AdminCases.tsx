
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Search, BarChart3 } from 'lucide-react';
import CaseForm from './CaseForm';

const AdminCases = () => {
  const [cases, setCases] = useState([]);
  const [caseStats, setCaseStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' или 'table'
  const { toast } = useToast();

  useEffect(() => {
    fetchCases();
    fetchCaseStats();
  }, []);

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          games (name),
          case_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить кейсы",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCaseStats = async () => {
    try {
      const { data, error } = await supabase
        .from('case_stats')
        .select('*')
        .order('total_openings', { ascending: false });

      if (error) throw error;
      setCaseStats(data || []);
    } catch (error) {
      console.error('Ошибка загрузки статистики кейсов:', error);
    }
  };

  const deleteCase = async (id, name) => {
    if (!confirm(`Вы уверены, что хотите удалить кейс "${name}"? Это действие нельзя отменить.`)) return;

    try {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Кейс удален",
      });
      fetchCases();
      fetchCaseStats();
    } catch (error) {
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
    fetchCaseStats();
  };

  const filteredCases = cases.filter(caseItem =>
    caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.games?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-white">Загрузка кейсов...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление кейсами</h2>
        <div className="flex space-x-4">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            Карточки
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Статистика
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить кейс
          </Button>
        </div>
      </div>

      {/* Поиск */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Поиск кейсов по названию или игре..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {viewMode === 'grid' ? (
        // Режим карточек
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseItem) => (
            <Card key={caseItem.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>{caseItem.name}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingCase(caseItem);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCase(caseItem.id, caseItem.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-300">
                  <p>Игра: {caseItem.games?.name}</p>
                  <p>Цена: {caseItem.price}₽</p>
                  <p>Предметов: {caseItem.case_items?.length || 0}</p>
                  <p>Статус: {caseItem.is_active ? 'Активен' : 'Неактивен'}</p>
                  {caseItem.image && (
                    <div className="mt-2">
                      <img 
                        src={caseItem.image} 
                        alt={caseItem.name}
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Режим таблицы со статистикой
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Статистика кейсов</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Кейс</TableHead>
                    <TableHead className="text-gray-300">Цена</TableHead>
                    <TableHead className="text-gray-300">Открытий</TableHead>
                    <TableHead className="text-gray-300">Уникальных пользователей</TableHead>
                    <TableHead className="text-gray-300">Доход</TableHead>
                    <TableHead className="text-gray-300">Предметы</TableHead>
                    <TableHead className="text-gray-300">Статус</TableHead>
                    <TableHead className="text-gray-300">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((caseItem) => {
                    const stats = caseStats.find(stat => stat.id === caseItem.id);
                    return (
                      <TableRow key={caseItem.id}>
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{caseItem.name}</div>
                            <div className="text-sm text-gray-400">{caseItem.games?.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-green-400">
                          {caseItem.price}₽
                        </TableCell>
                        <TableCell className="text-blue-400">
                          {stats?.total_openings || 0}
                        </TableCell>
                        <TableCell className="text-purple-400">
                          {stats?.unique_users || 0}
                        </TableCell>
                        <TableCell className="text-yellow-400">
                          {stats?.total_revenue || 0}₽
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {caseItem.case_items?.length || 0}
                        </TableCell>
                        <TableCell>
                          <span className={caseItem.is_active ? 'text-green-400' : 'text-red-400'}>
                            {caseItem.is_active ? 'Активен' : 'Неактивен'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingCase(caseItem);
                                setShowForm(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteCase(caseItem.id, caseItem.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <CaseForm
          caseData={editingCase}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default AdminCases;
