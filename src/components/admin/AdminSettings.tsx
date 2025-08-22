import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

interface SiteSetting {
  id: string;
  key: string;
  value: string;
}

type Game = Tables<'games'>;

const AdminSettings = () => {
  const [newGameName, setNewGameName] = useState('');
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isGameDialogOpen, setIsGameDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data as SiteSetting[];
    }
  });

  const { data: games } = useQuery({
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

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value }, { onConflict: 'key' });
      
      if (error) throw error;
      
      await supabase.rpc('log_admin_action', {
        p_action: 'UPDATE_SETTING',
        p_target_type: 'setting',
        p_details: { key, value }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({ title: 'Настройка обновлена' });
    },
    onError: (error) => {
      toast({ title: 'Ошибка обновления настройки', description: error.message, variant: 'destructive' });
    }
  });

  const createGameMutation = useMutation({
    mutationFn: async (gameData: { name: string }) => {
      const { error } = await supabase
        .from('games')
        .insert([{ 
          name: gameData.name,
          is_active: true,
          sort_order: 0
        }]);
      
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
      setNewGameName('');
      setIsGameDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: 'Ошибка создания игры', description: error.message, variant: 'destructive' });
    }
  });

  const updateGameMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from('games')
        .update({ name })
        .eq('id', id);
      
      if (error) throw error;
      
      await supabase.rpc('log_admin_action', {
        p_action: 'UPDATE_GAME',
        p_target_type: 'game',
        p_target_id: id,
        p_details: { name }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-games'] });
      toast({ title: 'Игра обновлена успешно' });
      setEditingGame(null);
      setIsGameDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: 'Ошибка обновления игры', description: error.message, variant: 'destructive' });
    }
  });

  const toggleGameStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('games')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
      
      await supabase.rpc('log_admin_action', {
        p_action: 'TOGGLE_GAME_STATUS',
        p_target_type: 'game',
        p_target_id: id,
        p_details: { is_active }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-games'] });
      toast({ title: 'Статус игры изменен' });
    },
    onError: (error) => {
      toast({ title: 'Ошибка изменения статуса', description: error.message, variant: 'destructive' });
    }
  });

  const deleteGameMutation = useMutation({
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

  const handleUpdateSetting = (key: string, value: string) => {
    updateSettingMutation.mutate({ key, value });
  };

  const handleCreateGame = () => {
    if (!newGameName.trim()) return;
    createGameMutation.mutate({ name: newGameName.trim() });
  };

  const handleUpdateGame = () => {
    if (!editingGame || !editingGame.name.trim()) return;
    updateGameMutation.mutate({ id: editingGame.id, name: editingGame.name.trim() });
  };

  const handleEditGame = (game: Game) => {
    setEditingGame({ ...game });
    setIsGameDialogOpen(true);
  };

  const resetGameDialog = () => {
    setEditingGame(null);
    setNewGameName('');
    setIsGameDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Настройки системы</h2>

      <Tabs defaultValue="site" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="site">Настройки сайта</TabsTrigger>
          <TabsTrigger value="games">Управление играми</TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Основные настройки</CardTitle>
              <CardDescription className="text-gray-400">
                Общие настройки сайта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_name" className="text-white">Название сайта</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="site_name"
                    defaultValue={settings?.find(s => s.key === 'site_name')?.value || 'Vaultory'}
                    className="bg-gray-700 border-gray-600 text-white"
                    onBlur={(e) => handleUpdateSetting('site_name', e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById('site_name') as HTMLInputElement;
                      handleUpdateSetting('site_name', input.value);
                    }}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="site_description" className="text-white">Описание сайта</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="site_description"
                    defaultValue={settings?.find(s => s.key === 'site_description')?.value || 'Магазин игровых аккаунтов'}
                    className="bg-gray-700 border-gray-600 text-white"
                    onBlur={(e) => handleUpdateSetting('site_description', e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById('site_description') as HTMLInputElement;
                      handleUpdateSetting('site_description', input.value);
                    }}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="support_email" className="text-white">Email поддержки</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="support_email"
                    type="email"
                    defaultValue={settings?.find(s => s.key === 'support_email')?.value || 'vaultorypoderjka@gmail.com'}
                    className="bg-gray-700 border-gray-600 text-white"
                    onBlur={(e) => handleUpdateSetting('support_email', e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById('support_email') as HTMLInputElement;
                      handleUpdateSetting('support_email', input.value);
                    }}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Управление играми</h3>
            <Dialog open={isGameDialogOpen} onOpenChange={setIsGameDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetGameDialog} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить игру
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>
                    {editingGame ? 'Редактировать игру' : 'Добавить новую игру'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="game_name">Название игры</Label>
                    <Input
                      id="game_name"
                      value={editingGame ? editingGame.name : newGameName}
                      onChange={(e) => editingGame 
                        ? setEditingGame({ ...editingGame, name: e.target.value })
                        : setNewGameName(e.target.value)
                      }
                      className="bg-gray-700 border-gray-600"
                      placeholder="Введите название игры"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={editingGame ? handleUpdateGame : handleCreateGame}
                      disabled={editingGame ? !editingGame.name.trim() : !newGameName.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {editingGame ? 'Обновить' : 'Создать'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetGameDialog}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Список игр</CardTitle>
              <CardDescription className="text-gray-400">
                Всего игр: {games?.length || 0}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Название</TableHead>
                    <TableHead className="text-gray-300">Статус</TableHead>
                    <TableHead className="text-gray-300">Дата создания</TableHead>
                    <TableHead className="text-gray-300">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {games?.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell className="text-white font-medium">
                        {game.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={game.is_active ? 'default' : 'destructive'}>
                          {game.is_active ? 'Активна' : 'Неактивна'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(game.created_at).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Switch
                            checked={game.is_active}
                            onCheckedChange={(checked) => 
                              toggleGameStatusMutation.mutate({ id: game.id, is_active: checked })
                            }
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditGame(game)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteGameMutation.mutate(game.id)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
