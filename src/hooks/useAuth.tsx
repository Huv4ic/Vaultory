import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState<{
    id?: string;
    telegram_id?: number;
    username?: string;
    role?: 'user' | 'admin' | 'support' | 'youtuber';
    status?: string;
    balance?: number;
    avatar_url?: string;
    block_reason?: string;
    cases_opened?: number;
    total_deposited?: number;
    total_spent?: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: any; // Allow additional fields
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUserState] = useState(() => {
    const saved = localStorage.getItem('vaultory_telegram_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [balance, setBalance] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  // Проверяем администратора: либо по роли в профиле, либо по Telegram ID
  const isAdmin = (profile?.role as any) === 'admin' || 
                  (profile?.role as any) === 'support' || 
                  (telegramUser?.id === 936111949);
  
  // Проверяем может ли пользователь получить доступ к админке
  const canAccessAdmin = (profile?.role as any) === 'admin' || 
                        (profile?.role as any) === 'support' || 
                        (telegramUser?.id === 936111949);
  
  // Проверяем блокировку пользователя
  const checkUserBlock = () => {
    if (profile?.status === 'blocked') {
      setIsBlocked(true);
      setBlockReason(profile?.block_reason || 'Нарушение правил сайта');
      return true;
    } else {
      setIsBlocked(false);
      setBlockReason('');
      return false;
    }
  };
  
  // Отладочная информация
  console.log('Auth Debug:', {
    telegramUser,
    telegramUserId: telegramUser?.id,
    profile,
    profileRole: profile?.role,
    profileStatus: profile?.status,
    isAdmin,
    isBlocked,
    user
  });

  const signOutTelegram = () => {
    setTelegramUserState(null);
    setBalance(0);
    localStorage.removeItem('vaultory_telegram_user');
    // Здесь можно добавить логику выхода из Telegram
  };

  // Функция обновления баланса
  const refreshBalance = async () => {
    if (!telegramUser?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('telegram_id', telegramUser.id)
        .single();
      
      if (!error && data?.balance !== undefined) {
        setBalance(data.balance);
        setProfile(prev => prev ? { ...prev, balance: data.balance } : null);
      }
    } catch (error) {
      console.error('Ошибка обновления баланса:', error);
    }
  };

  const fetchProfile = async (telegramId: number) => {
    try {
      // Используем telegram_id вместо id
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();
      if (error) throw error;
      setProfile(data);
      if (data?.balance) {
        setBalance(data.balance);
      }
      // Проверяем блокировку после загрузки профиля
      checkUserBlock();
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      setBalance(0);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (telegramUser) {
      await fetchProfile(telegramUser.id);
    }
  };

  const updateProfile = async (updates: Partial<typeof profile>) => {
    if (profile && telegramUser) {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
    }
  };

  const setTelegramUser = async (tgUser: TelegramUser) => {
    try {
      console.log('Setting Telegram user:', tgUser);
      
      setTelegramUserState(tgUser);
      localStorage.setItem('vaultory_telegram_user', JSON.stringify(tgUser));
      
      // Проверяем, есть ли профиль в Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('telegram_id', tgUser.id)
        .single();
      
      console.log('Existing profile check:', { data, error });
      
      if (!data) {
        // Определяем роль: admin для вашего Telegram ID, user для остальных
        const userRole = tgUser.id === 936111949 ? 'admin' : 'user';
        
        console.log('Creating new profile with role:', userRole);
        
        const { data: newProfile, error: insertError } = await supabase.from('profiles').insert({
          telegram_id: tgUser.id,
          username: tgUser.username || tgUser.first_name,
          balance: 0,
          cases_opened: 0,
          total_deposited: 0,
          total_spent: 0,
          role: userRole,
          status: 'active',
        } as any).select().single();
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw new Error(`Ошибка создания профиля: ${insertError.message}`);
        }
        
        console.log('New profile created:', newProfile);
        setProfile(newProfile);
        setBalance(0);
      } else {
        console.log('Profile already exists:', data);
        
        if (data.status !== 'active') {
          await supabase.from('profiles').update({ status: 'active' }).eq('telegram_id', tgUser.id);
        }
        
        // Обновляем роль на admin, если это ваш Telegram ID
        if (tgUser.id === 936111949 && data.role !== 'admin') {
          await supabase.from('profiles').update({ role: 'admin' }).eq('telegram_id', tgUser.id);
        }
        
        setProfile(data);
        if (data?.balance) setBalance(data.balance);
        // Проверяем блокировку после загрузки профиля
        checkUserBlock();
      }
      
      console.log('Telegram user set successfully');
    } catch (error) {
      console.error('Error in setTelegramUser:', error);
      // Убираем пользователя из состояния при ошибке
      setTelegramUserState(null);
      localStorage.removeItem('vaultory_telegram_user');
      throw error; // Пробрасываем ошибку дальше
    }
  };

  const fetchProfileByTelegramId = async (telegramId: number) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();
      if (error) throw error;
      setProfile(data);
      if (data?.balance) setBalance(data.balance);
      // Проверяем блокировку после загрузки профиля
      checkUserBlock();
    } catch (error) {
      setProfile(null);
      setBalance(0);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Проверяем, есть ли профиль в Supabase по id
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (!profileData) {
            // Создаём профиль для любого пользователя
            await supabase.from('profiles').insert({
              id: session.user.id,
              username: session.user?.user_metadata?.username || session.user?.email?.split('@')[0] || '',
              balance: 0,
              cases_opened: 0,
              total_deposited: 0,
              total_spent: 0,
              role: 'user',
              status: 'active',
            } as any);
          }
          setTimeout(() => {
            // Убираем вызов fetchProfile для session.user.id
            // fetchProfileByTelegramId(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Проверяем, есть ли профиль в Supabase по id
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData }) => {
            if (!profileData) {
              supabase.from('profiles').insert({
                id: session.user.id,
                username: session.user?.user_metadata?.username || session.user?.email?.split('@')[0] || '',
                balance: 0,
                cases_opened: 0,
                total_deposited: 0,
                total_spent: 0,
                role: 'user',
                status: 'active',
              } as any);
            }
          });
        // Убираем вызов fetchProfile для session.user.id
        // fetchProfileByTelegramId(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Загружаем профиль для Telegram пользователей
  useEffect(() => {
    if (telegramUser && !profile) {
      console.log('Loading profile for Telegram user:', telegramUser.id);
      fetchProfileByTelegramId(telegramUser.id);
    }
  }, [telegramUser, profile]);

  // Подписываемся на изменения профиля для real-time обновления баланса
  useEffect(() => {
    if (!telegramUser?.id) return;

    console.log('🔄 Устанавливаем real-time подписку на баланс для telegram_id:', telegramUser.id);

    const subscription = supabase
      .channel('profile_balance_sync')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `telegram_id=eq.${telegramUser.id}`
        },
        (payload) => {
          console.log('🔄 REAL-TIME: Профиль обновлен:', payload);
          const newProfile = payload.new as any;
          
          if (newProfile?.balance !== undefined && newProfile.balance !== balance) {
            console.log('💰 REAL-TIME: Обновляем баланс:', { old: balance, new: newProfile.balance });
            setBalance(newProfile.balance);
            setProfile(prev => prev ? { ...prev, balance: newProfile.balance } : newProfile);
          }
        }
      )
      .subscribe((status) => {
        console.log('🔄 Real-time subscription status:', status);
      });

    return () => {
      console.log('🔄 Отключаем real-time подписку на баланс');
      subscription.unsubscribe();
    };
  }, [telegramUser?.id]);

  // Периодическая синхронизация баланса каждые 30 секунд
  useEffect(() => {
    if (!telegramUser?.id) return;

    const interval = setInterval(async () => {
      try {
        console.log('🔄 Периодическая синхронизация баланса...');
        await refreshBalance();
      } catch (error) {
        console.error('❌ Ошибка периодической синхронизации баланса:', error);
      }
    }, 30000); // 30 секунд

    return () => {
      clearInterval(interval);
    };
  }, [telegramUser?.id, refreshBalance]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, username: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: username
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isAdmin,
      canAccessAdmin,
      loading,
      telegramUser,
      balance,
      setBalance,
      isBlocked,
      blockReason,
      signOutTelegram,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      updateProfile,
      setTelegramUser,
      refreshBalance
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
