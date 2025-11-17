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
  console.log('Компонент Auth рендерится'); // Логируем рендер компонента
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { setTelegramUser, telegramUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const tgWidgetRef = useRef<HTMLDivElement>(null);
  
  console.log('Состояния компонента:', { loading, error, debugInfo, telegramUser }); // Логируем состояния

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
    console.log('useEffect для Telegram виджета запущен'); // Логируем запуск useEffect
    if (telegramUser) {
      console.log('Пользователь уже авторизован, выходим'); // Логируем если пользователь авторизован
      return;
    }
    
    console.log('Устанавливаем глобальную функцию onTelegramAuth'); // Логируем установку функции
    
    // Глобальная функция для обработки авторизации Telegram
    (window as any).onTelegramAuth = async function(user: any) {
      try {
        console.log('onTelegramAuth вызвана с пользователем:', user); // Логируем вызов функции
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

    // Автоматически загружаем виджет при монтировании
    const timer = setTimeout(() => {
      console.log('Автоматически загружаем Telegram виджет');
      handleTelegramLogin();
    }, 500);

    // Очистка при размонтировании
    return () => {
      console.log('Очистка useEffect для Telegram виджета'); // Логируем очистку
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
    handleTelegramLogin();
  };

  const handleTelegramLogin = () => {
    console.log('handleTelegramLogin вызвана!'); // Логируем вызов функции
    setError(null);
    setDebugInfo('Инициализация Telegram авторизации...');
    
    // Очищаем предыдущий виджет
    if (tgWidgetRef.current) {
      tgWidgetRef.current.innerHTML = '';
    }
    
    // Создаем новый виджет
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', TELEGRAM_BOT);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-radius', '10');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;
    
    script.onload = () => {
      console.log('Telegram скрипт загружен успешно'); // Логируем успешную загрузку
      setDebugInfo('Telegram виджет загружен успешно');
    };
    
    script.onerror = () => {
      console.error('Ошибка загрузки Telegram скрипта'); // Логируем ошибку
      setError('Ошибка загрузки Telegram виджета. Проверьте интернет-соединение.');
      setDebugInfo('Ошибка загрузки скрипта Telegram');
    };
    
    if (tgWidgetRef.current) {
      console.log('Добавляем скрипт в tgWidgetRef'); // Логируем добавление скрипта
      tgWidgetRef.current.appendChild(script);
    } else {
      console.error('tgWidgetRef.current равен null!'); // Логируем ошибку с ref
      setError('Ошибка: не удалось найти контейнер для виджета');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Анимированный заголовок */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold mb-4 text-[#f0f0f0]">
              🔐 {t('Авторизация')}
            </h1>
            <div className="w-24 h-1 bg-white/20 mx-auto rounded-full"></div>
          </div>
          
          {/* Подзаголовок с анимацией */}
          <p className="text-2xl text-[#a0a0a0] mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Войдите в свой аккаунт через Telegram для доступа к платформе Vaultory
          </p>
          
          {/* Дополнительная информация */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center p-4 glass rounded-xl border border-white/9">
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-[#a0a0a0] text-sm">Безопасно</p>
            </div>
            <div className="text-center p-4 glass rounded-xl border border-white/9">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-[#a0a0a0] text-sm">Быстро</p>
            </div>
            <div className="text-center p-4 glass rounded-xl border border-white/9">
              <div className="text-2xl mb-2">🛡️</div>
              <p className="text-[#a0a0a0] text-sm">Надежно</p>
            </div>
          </div>
        </div>
      </div>

      {/* Форма авторизации */}
      <div className="relative z-20 container mx-auto px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <Card className="glass border-white/9">
            <CardContent className="p-8">
              {!loading && !error ? (
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 glass rounded-full flex items-center justify-center mb-6 border border-white/9">
                    <FaTelegramPlane className="w-10 h-10 text-[#FFD700]" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-[#f0f0f0] mb-4">
                    Войти через Telegram
                  </h2>
                  
                  <p className="text-base text-[#a0a0a0] mb-8">
                    Нажмите кнопку ниже, чтобы войти в свой аккаунт Telegram
                  </p>
                  
                  <Button
                    onClick={() => {
                      console.log('Кнопка нажата! Перезагружаем виджет...'); // Логируем нажатие кнопки
                      handleTelegramLogin();
                    }}
                    disabled={loading}
                    className="w-full py-4 bg-[#FFD700] hover:bg-[#FFC107] text-[#121212] hover-lift font-semibold rounded-2xl transition-all duration-300 text-base"
                  >
                    <FaTelegramPlane className="w-5 h-5 mr-2" />
                    {loading ? 'Загрузка...' : 'Обновить виджет'}
                  </Button>
                  
                  {/* Видимый div для Telegram виджета */}
                  <div 
                    ref={tgWidgetRef} 
                    className="mt-4 flex justify-center"
                  ></div>
                  
                  {/* Debug информация */}
                  {debugInfo && (
                    <div className="mt-4 p-3 bg-black/60 backdrop-blur-sm rounded-lg border border-amber-500/30">
                      <p className="text-xs text-amber-300 font-mono">
                        <span className="text-amber-400">Debug:</span> {debugInfo}
                      </p>
                    </div>
                  )}
                  
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