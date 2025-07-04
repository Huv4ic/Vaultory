
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, Trash2 } from 'lucide-react';

const CaseForm = ({ caseData, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    game_id: '',
    price: '',
    image: '',
    gradient: ''
  });
  const [items, setItems] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
    if (caseData) {
      setFormData({
        name: caseData.name,
        game_id: caseData.game_id,
        price: caseData.price.toString(),
        image: caseData.image || '',
        gradient: caseData.gradient || ''
      });
      setItems(caseData.case_items || []);
    }
  }, [caseData]);

  const fetchGames = async () => {
    const { data } = await supabase.from('games').select('*');
    setGames(data || []);
  };

  const addItem = () => {
    setItems([...items, { name: '', price: '', rarity: 'common', chance: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const casePayload = {
        name: formData.name,
        game_id: formData.game_id,
        price: parseInt(formData.price),
        image: formData.image,
        gradient: formData.gradient
      };

      let caseId;
      if (caseData) {
        const { error: updateError } = await supabase
          .from('cases')
          .update(casePayload)
          .eq('id', caseData.id);
        if (updateError) throw updateError;
        caseId = caseData.id;

        // Удаляем старые предметы
        await supabase.from('case_items').delete().eq('case_id', caseId);
      } else {
        const { data: newCase, error: insertError } = await supabase
          .from('cases')
          .insert(casePayload)
          .select()
          .single();
        if (insertError) throw insertError;
        caseId = newCase.id;
      }

      // Добавляем предметы
      if (items.length > 0) {
        const itemsPayload = items.map(item => ({
          case_id: caseId,
          name: item.name,
          price: parseInt(item.price),
          rarity: item.rarity,
          chance: parseFloat(item.chance)
        }));

        const { error: itemsError } = await supabase
          .from('case_items')
          .insert(itemsPayload);
        if (itemsError) throw itemsError;
      }

      toast({
        title: "Успех",
        description: caseData ? "Кейс обновлен" : "Кейс создан",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">
            {caseData ? 'Редактировать кейс' : 'Создать кейс'}
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Название кейса"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
              
              <Select 
                value={formData.game_id} 
                onValueChange={(value) => setFormData({...formData, game_id: value})}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Выберите игру" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Цена"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />

              <Input
                placeholder="URL изображения"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
              />

              <Input
                placeholder="CSS градиент (например: from-red-500 to-blue-500)"
                value={formData.gradient}
                onChange={(e) => setFormData({...formData, gradient: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white md:col-span-2"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Предметы в кейсе</h3>
                <Button type="button" onClick={addItem} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить предмет
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-4 bg-gray-700 rounded">
                  <Input
                    placeholder="Название предмета"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                  <Input
                    type="number"
                    placeholder="Цена"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                  <Select
                    value={item.rarity}
                    onValueChange={(value) => updateItem(index, 'rarity', value)}
                  >
                    <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Обычный</SelectItem>
                      <SelectItem value="rare">Редкий</SelectItem>
                      <SelectItem value="epic">Эпический</SelectItem>
                      <SelectItem value="legendary">Легендарный</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Шанс %"
                    value={item.chance}
                    onChange={(e) => updateItem(index, 'chance', e.target.value)}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
                {loading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseForm;
