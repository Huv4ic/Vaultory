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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUserState] = useState(() => {
    const saved = localStorage.getItem('vaultory_telegram_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [balance, setBalance] = useState(1000);

  const isAdmin = profile?.role === 'admin';

  const signOutTelegram = () => {
    setTelegramUserState(null);
    setBalance(0);
    localStorage.removeItem('vaultory_telegram_user');
    // Здесь можно добавить логику выхода из Telegram
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
    if (data?.balance) {
      setBalance(data.balance);
    }
    return data;
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const setTelegramUser = async (tgUser: TelegramUser) => {
    setTelegramUserState(tgUser);
    localStorage.setItem('vaultory_telegram_user', JSON.stringify(tgUser));
    // Проверяем, есть ли профиль в Supabase
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', tgUser.id)
      .single();
    if (!data) {
      // Создаём профиль
      await supabase.from('profiles').insert({
        telegram_id: tgUser.id,
        username: tgUser.username,
        first_name: tgUser.first_name,
        last_name: tgUser.last_name,
        photo_url: tgUser.photo_url,
        balance: 1000,
        cases_opened: 0,
        role: tgUser.id === 936111949 ? 'superadmin' : tgUser.id === 725654623 ? 'admin' : 'user',
      } as any);
    } else if (tgUser.id === 936111949 && data.role !== 'superadmin') {
      await supabase.from('profiles').update({ role: 'superadmin' }).eq('telegram_id', tgUser.id);
    } else if (tgUser.id === 725654623 && data.role !== 'admin') {
      await supabase.from('profiles').update({ role: 'admin' }).eq('telegram_id', tgUser.id);
    }
    // Загружаем профиль
    await fetchProfileByTelegramId(tgUser.id);
  };

  const fetchProfileByTelegramId = async (telegramId: number) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();
    setProfile(data);
    if (data?.balance) setBalance(data.balance);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
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
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      loading,
      telegramUser,
      balance,
      setBalance,
      signOutTelegram,
      signIn,
      signUp,
      signOut,
      refreshProfile,
      setTelegramUser
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
