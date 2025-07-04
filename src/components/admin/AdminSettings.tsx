
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    site_name: 'Vaultory',
    maintenance_mode: false,
    total_revenue: '0'
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      const settingsObj = {};
      data?.forEach(setting => {
        settingsObj[setting.key] = setting.key === 'maintenance_mode' 
          ? setting.value === 'true' 
          : setting.value;
      });

      setSettings(prev => ({ ...prev, ...settingsObj }));
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить настройки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key,
          value: value.toString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Настройка обновлена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить настройку",
        variant: "destructive",
      });
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    updateSetting(key, value);
  };

  if (loading) {
    return <div className="text-white">Загрузка настроек...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Настройки сайта</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Основные настройки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Название сайта</label>
              <Input
                value={settings.site_name}
                onChange={(e) => handleSettingChange('site_name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Режим обслуживания</label>
              <Switch
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) => handleSettingChange('maintenance_mode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Финансовые настройки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Общая выручка (₽)</label>
              <Input
                type="number"
                value={settings.total_revenue}
                onChange={(e) => handleSettingChange('total_revenue', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Управление играми</CardTitle>
        </CardHeader>
        <CardContent>
          <GameManager />
        </CardContent>
      </Card>
    </div>
  );
};

const GameManager = () => {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({ name: '', icon: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const { data } = await supabase.from('games').select('*');
    setGames(data || []);
  };

  const addGame = async () => {
    if (!newGame.name) return;

    try {
      const { error } = await supabase
        .from('games')
        .insert([{ name: newGame.name, icon: newGame.icon }]);

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Игра добавлена",
      });
      
      setNewGame({ name: '', icon: '' });
      fetchGames();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить игру",
        variant: "destructive",
      });
    }
  };

  const deleteGame = async (id) => {
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успех",
        description: "Игра удалена",
      });
      fetchGames();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить игру",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Название игры"
          value={newGame.name}
          onChange={(e) => setNewGame({...newGame, name: e.target.value})}
          className="bg-gray-700 border-gray-600 text-white"
        />
        <Input
          placeholder="URL изображения"
          value={newGame.icon}
          onChange={(e) => setNewGame({...newGame, icon: e.target.value})}
          className="bg-gray-700 border-gray-600 text-white"
        />
        <Button onClick={addGame}>Добавить</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {games.map((game) => (
          <div key={game.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
            <span className="text-white">{game.name}</span>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteGame(game.id)}
            >
              Удалить
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSettings;
