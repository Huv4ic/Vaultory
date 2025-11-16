import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, User, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/hooks/useNotification';
import Notification from '@/components/ui/Notification';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarUpdate: (avatarUrl: string) => void;
}

export default function EditProfileModal({ isOpen, onClose, onAvatarUpdate }: EditProfileModalProps) {
  const { telegramUser, profile } = useAuth();
  const { showSuccess, showError, notification, hideNotification } = useNotification();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        showError('Пожалуйста, выберите изображение');
        return;
      }
      
      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Размер файла должен быть меньше 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Создаем превью
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !telegramUser) return;

    setUploading(true);
    try {
      console.log('Начинаем загрузку аватара:', {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        userId: telegramUser.id
      });

      // Загружаем файл в Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${telegramUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      console.log('Пытаемся загрузить файл:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Ошибка загрузки в Storage:', uploadError);
        throw new Error(`Ошибка загрузки файла: ${uploadError.message}`);
      }

      console.log('Файл успешно загружен:', uploadData);

      // Получаем публичную ссылку
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Получен публичный URL:', publicUrl);

      // Обновляем профиль в базе данных
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        } as any)
        .eq('telegram_id', telegramUser.id);

      if (updateError) {
        console.error('Ошибка обновления профиля:', updateError);
        throw new Error(`Ошибка обновления профиля: ${updateError.message}`);
      }

      console.log('Профиль обновлен успешно');

      // Вызываем callback для обновления UI
      onAvatarUpdate(publicUrl);
      
      // Закрываем модальное окно
      onClose();
      
      // Очищаем состояние
      setSelectedFile(null);
      setPreviewUrl('');
      
              showSuccess('Аватар успешно загружен!');
      
    } catch (error) {
      console.error('Детальная ошибка загрузки аватара:', error);
      
      let errorMessage = 'Неизвестная ошибка при загрузке аватара';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
              showError(`Ошибка при загрузке аватара: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!telegramUser) return;

    try {
      // Убираем аватар из профиля
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null } as any)
        .eq('telegram_id', telegramUser.id);

      if (error) throw error;

      // Вызываем callback для обновления UI
      onAvatarUpdate('');
      
      // Очищаем состояние
      setSelectedFile(null);
      setPreviewUrl('');
      
    } catch (error) {
      console.error('Ошибка удаления аватара:', error);
              showError('Ошибка при удалении аватара. Попробуйте еще раз.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-black/90 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/30">
        <CardHeader className="border-b border-amber-500/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Camera className="w-5 h-5 mr-2 text-amber-400" />
              Изменить аватар
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Текущий аватар */}
            <div className="text-center">
              <h3 className="text-gray-300 text-sm mb-3">Текущий аватар</h3>
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center border border-amber-500/30 overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Current Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-amber-400" />
                )}
              </div>
            </div>

            {/* Загрузка нового файла */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#FFD700]/20 rounded-lg p-6 text-center hover:border-[#FFD700] transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="bg-transparent border-[#FFD700]/20 text-[#a0a0a0] hover:bg-[#FFD700]/20 hover:border-[#FFD700]/50 hover:text-[#FFD700]"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Выбрать изображение
                </Button>
                <p className="text-[#a0a0a0] text-xs mt-2">
                  PNG, JPG до 5MB
                </p>
              </div>

              {/* Превью выбранного файла */}
              {previewUrl && (
                <div className="text-center">
                  <h4 className="text-[#f0f0f0] text-sm mb-2">Предварительный просмотр</h4>
                  <div className="mx-auto w-20 h-20 rounded-full overflow-hidden border-2 border-[#FFD700]">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1 bg-[#FFD700] hover:bg-[#FFC107] text-[#121212] hover-lift font-bold"
              >
                {uploading ? 'Загрузка...' : 'Сохранить'}
              </Button>
              
              <Button
                onClick={handleRemoveAvatar}
                variant="outline"
                className="px-4 bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30 hover:border-red-500/50"
              >
                Убрать
              </Button>
            </div>

            <div className="text-center">
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Отмена
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Красивые уведомления */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        autoHide={notification.autoHide}
        duration={notification.duration}
      />
    </div>
  );
}
