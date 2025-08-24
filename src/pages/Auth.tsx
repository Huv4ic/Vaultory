import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setTelegramUser, telegramUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Перенаправляем пользователя, если он уже авторизован
  useEffect(() => {
    if (telegramUser) {
      const redirectTo = localStorage.getItem('vaultory_redirect_to') || '/';
      localStorage.removeItem('vaultory_redirect_to');
      navigate(redirectTo);
    }
  }, [telegramUser, navigate]);

  // Сохраняем путь возврата, если пришли не с главной
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirectTo') || (location.state && location.state.from) || '/';
    localStorage.setItem('vaultory_redirect_to', redirectTo);
  }, [location]);

  const handleTelegramAuth = async (user: any) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user || !user.id) {
        throw new Error('Invalid Telegram response');
      }

      await setTelegramUser(user);
      // Перенаправление произойдет через useEffect выше
    } catch (error) {
      console.error('Telegram auth error:', error);
      setError('Ошибка авторизации через Telegram. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  // Создаем Telegram Login Widget
  useEffect(() => {
    if (telegramUser) return; // Если уже авторизован, не показываем виджет

    // Глобальная функция для обработки авторизации
    (window as any).onTelegramAuth = handleTelegramAuth;

    // Создаем скрипт для Telegram виджета
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', 'vaultory_notify_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-radius', '10');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    // Добавляем скрипт в head
    document.head.appendChild(script);

    // Очистка при размонтировании
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if ((window as any).onTelegramAuth) {
        delete (window as any).onTelegramAuth;
      }
    };
  }, [telegramUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white mb-2">
            🔐 Авторизация
          </CardTitle>
          <CardDescription className="text-gray-300">
            Войдите в свой аккаунт через Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
              <p className="text-white">Авторизация...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Попробовать снова
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Нажмите кнопку ниже для авторизации
                </p>
                <div id="telegram-login-vaultory_notify_bot" className="flex justify-center"></div>
              </div>
              
              <div className="text-xs text-gray-400 mt-6">
                <p>Нажимая кнопку, вы соглашаетесь с нашими</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <button 
                    onClick={() => navigate('/terms')}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Условиями использования
                  </button>
                  <span>и</span>
                  <button 
                    onClick={() => navigate('/privacy')}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Политикой конфиденциальности
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;