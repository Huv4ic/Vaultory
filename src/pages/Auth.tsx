import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { Eye, EyeOff } from 'lucide-react';
import { FaTelegramPlane } from 'react-icons/fa';
import TelegramLoginButton from 'react-telegram-login';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, profile, isAdmin, user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Перенаправляем админа в админку после успешной авторизации
  useEffect(() => {
    if (user && profile && isAdmin) {
      navigate('/admin');
    } else if (user && profile && !isAdmin) {
      navigate('/');
    }
  }, [user, profile, isAdmin, navigate]);

  // Сохраняем путь возврата, если пришли не с главной
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirectTo') || (location.state && location.state.from) || '/';
    localStorage.setItem('vaultory_redirect_to', redirectTo);
  }, [location]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: t("Ошибка входа"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("Успешный вход"),
        description: t("Добро пожаловать!"),
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(email, password, username);
    
    if (error) {
      toast({
        title: t("Ошибка регистрации"),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("Регистрация успешна"),
        description: t("Проверьте почту для подтверждения аккаунта"),
      });
    }
    setLoading(false);
  };

  const handleTelegramResponse = async (user) => {
    // user: { id, first_name, last_name, username, photo_url, auth_date, hash }
    // 1. Сохраняем Telegram-данные в useAuth
    // 2. Создаём профиль в Supabase, если его нет
    // 3. Перенаправляем пользователя на главную
    try {
      // Сохраняем Telegram-данные в useAuth (например, через setTelegramUser)
      // await setTelegramUser(user);
      // Проверяем/создаём профиль в Supabase
      // ...
      window.location.href = '/';
    } catch (e) {
      alert(t('Ошибка Telegram авторизации'));
    }
  };

  // После успешной авторизации:
  const handleLoginSuccess = () => {
    const redirectTo = localStorage.getItem('vaultory_redirect_to') || '/';
    localStorage.removeItem('vaultory_redirect_to');
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
            {t('Вход в аккаунт')}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t('Войдите в свой аккаунт')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700">
              <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-purple-600">
                {t('Войти')}
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-purple-600">
                {t('Регистрация')}
              </TabsTrigger>
            </TabsList>

            {/* Вход */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder={t('Email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('Пароль')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700"
                >
                  {loading ? '...' : t('Войти')}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-gray-400 mb-4">{t('Или войдите через')}</p>
                <Button
                  type="button"
                  onClick={() => handleTelegramResponse({})}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FaTelegramPlane className="w-4 h-4 mr-2" />
                  {t('Войти через Telegram')}
                </Button>
              </div>

              <div className="text-center text-sm">
                <span className="text-gray-400">{t('Нет аккаунта?')} </span>
                <Link to="/auth?tab=register" className="text-red-400 hover:text-red-300">
                  {t('Создать аккаунт')}
                </Link>
              </div>
            </TabsContent>

            {/* Регистрация */}
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder={t('Имя пользователя')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder={t('Email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('Пароль')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700"
                >
                  {loading ? '...' : t('Зарегистрироваться')}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-gray-400">{t('Уже есть аккаунт?')} </span>
                <Link to="/auth?tab=login" className="text-red-400 hover:text-red-300">
                  {t('Войти в аккаунт')}
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
