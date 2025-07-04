
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Image, Upload, Gamepad2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Game {
  id: string;
  name: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const AdminGames = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    sort_order: 0,
    is_active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: games, isLoading } = useQuery({
    queryKey: ['admin-games'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Game[];
    }
  });

  const uploadToImgur = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 546c25a59c58ad7' // Публичный Client ID
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки изображения');
    }

    const data = await response.json();
    return data.data.link;
  };

  const createMutation = useMutation({
    mutationFn: async (gameData: any) => {
      let iconUrl = gameData.icon;
      
      if (imageFile) {
        setIsUploading(true);
        try {
          iconUrl = await uploadToImgur(imageFile);
        } catch (error) {
          throw new Error('Ошибка загрузки изображения');
        } finally {
          setIsUploading(false);
        }
      }

      const { error } = await supabase
        .from('games')
        .insert([{ ...gameData, icon: iconUrl }]);
      
      if (error) throw error;
      
      await supabase.rpc('log_admin_action', {
        p_action: 'CREATE_GAME',
        p_target_type: 'game',
        p_details: { name: gameData.name }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-games'] });
      toast({ title: 'Игра создана успешно' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Ошибка создания игры', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...gameData }: any) => {
      let iconUrl = gameData.icon;
      
      if (imageFile) {
        setIsUploading(true);
        try {
          iconUrl = await uploadToImgur(imageFile);
        } catch (error) {
          throw new Error('Ошибка загрузки изображения');
        } finally {
          setIsUploading(false);
        }
      }

      const { error } = await supabase
        .from('games')
        .update({ ...gameData, icon: iconUrl })
        .eq('id', id);
      
      if (error) throw error;
      
      await supabase.rpc('log_admin_action', {
        p_action: 'UPDATE_GAME',
        p_target_type: 'game',
        p_target_id: id,
        p_details: { name: gameData.name }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-games'] });
      toast({ title: 'Игра обновлена успешно' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Ошибка обновления игры', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await supabase.rpc('log_admin_action', {
        p_action: 'DELETE_GAME',
        p_target_type: 'game',
        p_target_id: id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-games'] });
      toast({ title: 'Игра удалена успешно' });
    },
    onError: (error) => {
      toast({ title: 'Ошибка удаления игры', description: error.message, variant: 'destructive' });
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('games')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-games'] });
      toast({ title: 'Статус игры изменен' });
    },
    onError: (error) => {
      toast({ title: 'Ошибка изменения статуса', description: error.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '',
      sort_order: 0,
      is_active: true
    });
    setEditingGame(null);
    setImageFile(null);
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      icon: game.icon || '',
      sort_order: game.sort_order,
      is_active: game.is_active
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGame) {
      updateMutation.mutate({ id: editingGame.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Ошибка', description: 'Выберите изображение', variant: 'destructive' });
        return;
      }
      
      // Проверяем размер (максимум 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'Ошибка', description: 'Размер файла не должен превышать 10MB', variant: 'destructive' });
        return;
      }
      
      setImageFile(file);
    }
  };

  if (isLoading) {
    return <div className="text-white">Загрузка игр...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление играми</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Добавить игру
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingGame ? 'Редактировать игру' : 'Добавить новую игру'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Название игры</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-700 border-gray-600"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="icon">Изображение игры</Label>
                <div className="space-y-2">
                  <Input
                    id="icon-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="bg-gray-700 border-gray-600"
                  />
                  {imageFile && (
                    <p className="text-sm text-green-400">
                      Выбран файл: {imageFile.name}
                    </p>
                  )}
                  <Input
                    id="icon"
                    placeholder="Или введите URL изображения"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="bg-gray-700 border-gray-600"
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
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="active">Активная</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending || isUploading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUploading ? 'Загрузка...' : editingGame ? 'Обновить' : 'Создать'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games?.map((game) => (
          <Card key={game.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gamepad2 className="w-5 h-5 text-blue-400" />
                  <CardTitle className="text-white text-lg">{game.name}</CardTitle>
                </div>
                <Switch
                  checked={game.is_active}
                  onCheckedChange={(checked) => 
                    toggleActiveMutation.mutate({ id: game.id, is_active: checked })
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                {game.icon ? (
                  <img
                    src={game.icon}
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Image className="w-8 h-8 mb-2" />
                    <span className="text-sm">Нет изображения</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Порядок: {game.sort_order}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  game.is_active 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {game.is_active ? 'Активна' : 'Скрыта'}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(game)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Редактировать
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(game.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {games?.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <Gamepad2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Нет игр</h3>
            <p className="text-gray-400 mb-4">Создайте первую игру для начала работы</p>
            <Button onClick={() => {resetForm(); setIsDialogOpen(true);}} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Добавить игру
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminGames;
