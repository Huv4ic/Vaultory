import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { FaTelegramPlane } from 'react-icons/fa';
import { supabase } from '@/integrations/supabase/client';

const TELEGRAM_BOT = 'vaultory_notify_bot';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { setTelegramUser, telegramUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const tgWidgetRef = useRef<HTMLDivElement>(null);

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

  // Проверяем подключение к базе данных
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Проверяем, существует ли таблица profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        if (error) {
          setDebugInfo(`Ошибка подключения к БД: ${error.message}`);
        } else {
          setDebugInfo('База данных подключена успешно');
        }
      } catch (err) {
        setDebugInfo(`Ошибка проверки БД: ${err}`);
      }
    };

    checkDatabase();
  }, []);

  // Вставка Telegram Login Widget
  useEffect(() => {
    if (telegramUser) return; // Если уже авторизован, не показываем виджет
    
    // Очищаем предыдущий виджет
    if (tgWidgetRef.current) {
      tgWidgetRef.current.innerHTML = '';
    }

    // Создаем новый виджет
    const createTelegramWidget = () => {
      if (!tgWidgetRef.current) return;

      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?7';
      script.setAttribute('data-telegram-login', TELEGRAM_BOT);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-userpic', 'true');
      script.setAttribute('data-radius', '10');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.async = true;
      
      // Обработчик ошибок загрузки скрипта
      script.onerror = () => {
        setError('Ошибка загрузки Telegram виджета. Проверьте интернет-соединение.');
      };

      tgWidgetRef.current.appendChild(script);
    };

    // Глобальная функция для обработки авторизации Telegram
    (window as any).onTelegramAuth = async function(user: any) {
      try {
        setLoading(true);
        setError(null);
        console.log('Telegram auth response:', user);
        setDebugInfo(`Получен ответ от Telegram: ${JSON.stringify(user)}`);
        
        if (!user || !user.id) {
          throw new Error('Неверный ответ от Telegram');
        }

        await setTelegramUser(user);
        console.log('Telegram user set successfully');
        setDebugInfo('Пользователь успешно авторизован');
        
        // Успешная авторизация - useEffect выше перенаправит пользователя
      } catch (error) {
        console.error('Ошибка Telegram авторизации:', error);
        setError('Ошибка авторизации через Telegram. Попробуйте еще раз.');
        setDebugInfo(`Ошибка авторизации: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    // Создаем виджет с небольшой задержкой
    const timer = setTimeout(createTelegramWidget, 100);

    // Очистка при размонтировании
    return () => {
      clearTimeout(timer);
      if ((window as any).onTelegramAuth) {
        delete (window as any).onTelegramAuth;
      }
    };
  }, [telegramUser, setTelegramUser]);

  // Функция для повторной попытки
  const retryAuth = () => {
    setError(null);
    setDebugInfo('Повторная попытка загрузки виджета...');
    if (tgWidgetRef.current) {
      tgWidgetRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?7';
      script.setAttribute('data-telegram-login', TELEGRAM_BOT);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-userpic', 'true');
      script.setAttribute('data-radius', '10');
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.async = true;
      script.onerror = () => {
        setError('Ошибка загрузки Telegram виджета. Проверьте интернет-соединение.');
      };
      tgWidgetRef.current.appendChild(script);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700 flex items-center justify-center p-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            🔐 {t('Авторизация')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Войдите в свой аккаунт через Telegram для доступа к платформе Vaultory
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full animate-spin"></div>
      </div>

      {/* Форма авторизации */}
      <div className="relative z-20 w-full max-w-md">
        <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center mb-6">
              <FaTelegramPlane className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">
              Вход через Telegram
            </CardTitle>
            <CardDescription className="text-amber-300">
              Безопасная и быстрая авторизация
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {loading ? (
              <div className="py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
                <p className="text-white/80">Выполняется авторизация...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {error ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                    <Button
                      onClick={retryAuth}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      Попробовать снова
                    </Button>
                  </div>
                ) : (
                  <div ref={tgWidgetRef} className="flex justify-center"></div>
                )}
                
                {/* Отладочная информация */}
                {debugInfo && (
                  <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-amber-500/20">
                    <p className="text-amber-300 text-xs">{debugInfo}</p>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-white/60 text-sm mb-4">
                    Нажимая кнопку выше, вы соглашаетесь с нашими условиями использования
                  </p>
                  
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300"
                  >
                    Вернуться на главную
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
