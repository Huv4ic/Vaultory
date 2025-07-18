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
  const [balance, setBalance] = useState(0);

  const isAdmin = (profile?.role as any) === 'admin' || (profile?.role as any) === 'superadmin';

  const signOutTelegram = () => {
    setTelegramUserState(null);
    setBalance(0);
    localStorage.removeItem('vaultory_telegram_user');
    // Здесь можно добавить логику выхода из Telegram
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      setProfile(data);
      if (data?.balance) {
        setBalance(data.balance);
      }
      return data;
    } catch (error) {
      setProfile(null);
      setBalance(0);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const setTelegramUser = async (tgUser: TelegramUser) => {
    setTelegramUserState(tgUser);
    localStorage.setItem('vaultory_telegram_user', JSON.stringify(tgUser));
    
    try {
      // Проверяем, есть ли профиль в Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('telegram_id', tgUser.id)
        .single();
      
      if (!data) {
        const { data: newProfile, error: insertError } = await supabase.from('profiles').insert({
          telegram_id: tgUser.id,
          username: tgUser.username || tgUser.first_name,
          balance: 0,
          cases_opened: 0,
          total_deposited: 0,
          total_spent: 0,
          role: 'user',
          status: 'active',
        } as any).select().single();
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      } else {
        if (data.status !== 'active') {
          await supabase.from('profiles').update({ status: 'active' }).eq('telegram_id', tgUser.id);
        }
        if (tgUser.id === 725654623 && data.role !== 'admin') {
          await supabase.from('profiles').update({ role: 'admin' }).eq('telegram_id', tgUser.id);
        }
      }
      await fetchProfileByTelegramId(tgUser.id);
    } catch (error) {
      console.error('Error in setTelegramUser:', error);
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
              username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '',
              balance: 0,
              cases_opened: 0,
              total_deposited: 0,
              total_spent: 0,
              role: 'user',
              status: 'active',
            } as any);
          }
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
                username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '',
                balance: 0,
                cases_opened: 0,
                total_deposited: 0,
                total_spent: 0,
                role: 'user',
                status: 'active',
              } as any);
            }
          });
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Подписываемся на изменения профиля для real-time обновления баланса
  useEffect(() => {
    if (!user?.id) return;

    const subscription = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('Profile updated:', payload);
          const newProfile = payload.new as any;
          setProfile(newProfile);
          if (newProfile?.balance !== undefined) {
            setBalance(newProfile.balance);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

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
