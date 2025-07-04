
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import CaseForm from './CaseForm';

const AdminCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCases();
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

  const deleteCase = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот кейс?')) return;

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
  };

  if (loading) {
    return <div className="text-white">Загрузка кейсов...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление кейсами</h2>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить кейс
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
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
                    onClick={() => deleteCase(caseItem.id)}
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
