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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Анимированные элементы фона */}
      <div className="absolute inset-0">
        {/* Основные анимированные круги */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500/10 rounded-full animate-bounce blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-amber-400/10 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-amber-500/10 rounded-full animate-spin blur-xl"></div>
        
        {/* Дополнительные декоративные элементы */}
        <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-amber-400/5 rounded-full animate-pulse blur-lg"></div>
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-amber-500/5 rounded-full animate-bounce blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-amber-500/5 to-amber-400/5 rounded-full animate-pulse blur-2xl"></div>
        
        {/* Плавающие частицы */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-amber-300/20 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-amber-400/20 rounded-full animate-ping animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Анимированный заголовок */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
              🔐 {t('Авторизация')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full animate-pulse"></div>
          </div>
          
          {/* Подзаголовок с анимацией */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Войдите в свой аккаунт через Telegram для доступа к платформе Vaultory
          </p>
          
          {/* Дополнительная информация */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-gray-300 text-sm">Безопасно</p>
            </div>
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-gray-300 text-sm">Быстро</p>
            </div>
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">🛡️</div>
              <p className="text-gray-300 text-sm">Надежно</p>
            </div>
          </div>
        </div>
      </div>

      {/* Форма авторизации */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        <div className="flex justify-center">
          <Card className="w-full max-w-lg bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-500 hover:scale-105">
            <CardHeader className="text-center pb-8">
              {/* Анимированная иконка Telegram */}
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-2xl shadow-amber-500/30">
                <FaTelegramPlane className="w-12 h-12 text-white animate-bounce" />
              </div>
              
              <CardTitle className="text-3xl text-white font-bold mb-3">
                Вход через Telegram
              </CardTitle>
              <CardDescription className="text-amber-300 text-lg">
                Безопасная и быстрая авторизация
              </CardDescription>
              
              {/* Декоративная линия */}
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4"></div>
            </CardHeader>
            
            <CardContent className="text-center px-8 pb-8">
              {loading ? (
                <div className="py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400/30 mx-auto mb-6"></div>
                    <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-amber-400 mx-auto"></div>
                  </div>
                  <p className="text-gray-300 text-lg font-medium">Выполняется авторизация...</p>
                  <div className="flex justify-center space-x-1 mt-4">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce animation-delay-100"></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce animation-delay-200"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {error ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-red-500/20 border border-red-500/40 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-8 h-8 bg-red-500/30 rounded-full flex items-center justify-center mr-3">
                            <span className="text-red-400 text-xl">⚠️</span>
                          </div>
                          <p className="text-red-400 font-medium">Ошибка авторизации</p>
                        </div>
                        <p className="text-red-300 text-sm">{error}</p>
                      </div>
                      
                      <Button
                        onClick={retryAuth}
                        className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-red-500/30"
                      >
                        <span className="mr-2">🔄</span>
                        Попробовать снова
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Telegram виджет */}
                      <div ref={tgWidgetRef} className="flex justify-center transform hover:scale-105 transition-transform duration-300"></div>
                      
                      {/* Отладочная информация */}
                      {debugInfo && (
                        <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-2xl backdrop-blur-sm">
                          <div className="flex items-center justify-center mb-2">
                            <div className="w-6 h-6 bg-amber-500/30 rounded-full flex items-center justify-center mr-2">
                              <span className="text-amber-400 text-sm">✓</span>
                            </div>
                            <p className="text-amber-300 text-sm font-medium">Статус системы</p>
                          </div>
                          <p className="text-amber-200 text-xs">{debugInfo}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Дополнительная информация */}
                  <div className="space-y-6">
                    <div className="p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/20">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Нажимая кнопку выше, вы соглашаетесь с нашими{' '}
                        <span className="text-amber-400 hover:text-amber-300 cursor-pointer underline">
                          условиями использования
                        </span>{' '}
                        и{' '}
                        <span className="text-amber-400 hover:text-amber-300 cursor-pointer underline">
                          политикой конфиденциальности
                        </span>
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => navigate('/')}
                      variant="outline"
                      className="w-full py-3 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300 hover:scale-105"
                    >
                      <span className="mr-2">🏠</span>
                      Вернуться на главную
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
