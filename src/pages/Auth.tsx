import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { FaTelegramPlane } from 'react-icons/fa';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Home } from 'lucide-react';

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

  const handleTelegramLogin = () => {
    setError(null);
    setDebugInfo('Попытка авторизации через Telegram виджет...');
    if (tgWidgetRef.current) {
      tgWidgetRef.current.innerHTML = ''; // Очищаем предыдущий виджет
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
      <div className="relative z-10 container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Анимированный заголовок */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
              🔐 {t('Авторизация')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full animate-pulse"></div>
          </div>
          
          {/* Подзаголовок с анимацией */}
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in px-4">
            Войдите в свой аккаунт через Telegram для доступа к платформе Vaultory
          </p>
          
          {/* Дополнительная информация */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
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
      <div className="relative z-20 container mx-auto px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="p-8">
              {!loading && !error ? (
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-6 border border-amber-500/30">
                    <FaTelegramPlane className="w-10 h-10 text-amber-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Войти через Telegram
                  </h2>
                  
                  <p className="text-base text-gray-300 mb-8">
                    Нажмите кнопку ниже, чтобы войти в свой аккаунт Telegram
                  </p>
                  
                  <Button
                    onClick={handleTelegramLogin}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/30 text-base"
                  >
                    <FaTelegramPlane className="w-5 h-5 mr-2" />
                    {loading ? 'Загрузка...' : 'Войти через Telegram'}
                  </Button>
                  
                  {/* Скрытый div для Telegram виджета */}
                  <div 
                    ref={tgWidgetRef} 
                    className="mt-4 opacity-0 pointer-events-none"
                    style={{ height: '0', overflow: 'hidden' }}
                  ></div>
                  
                  <div className="mt-8 text-sm text-gray-400">
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
              ) : loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-6"></div>
                  <h3 className="text-xl font-semibold text-white mb-2">Авторизация...</h3>
                  <p className="text-base text-gray-300">Пожалуйста, подождите</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
                    <div className="text-red-400 text-2xl">⚠️</div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Ошибка авторизации
                  </h3>
                  
                  <p className="text-base text-gray-300 mb-6">
                    {error}
                  </p>
                  
                  {debugInfo && (
                    <div className="mb-6 p-4 bg-black/60 backdrop-blur-sm rounded-xl border border-amber-500/30">
                      <p className="text-sm text-amber-300 font-mono">
                        <span className="text-amber-400">Debug:</span> {debugInfo}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-row gap-4">
                    <Button
                      onClick={retryAuth}
                      className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 text-base"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Попробовать снова
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="px-6 py-4 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl text-base"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      На главную
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;