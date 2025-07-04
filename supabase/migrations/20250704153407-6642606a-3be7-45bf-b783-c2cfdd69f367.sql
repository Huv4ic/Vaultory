
-- Создаем enum для редкости предметов
CREATE TYPE item_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');

-- Создаем enum для ролей пользователей
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Таблица профилей пользователей
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT,
  balance INTEGER DEFAULT 0,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Таблица игр
CREATE TABLE public.games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Таблица кейсов
CREATE TABLE public.cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  image TEXT,
  gradient TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Таблица предметов в кейсах
CREATE TABLE public.case_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  rarity item_rarity NOT NULL,
  chance DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Таблица истории открытий кейсов
CREATE TABLE public.case_openings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.case_items(id) ON DELETE CASCADE,
  total_cost INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Таблица транзакций (пополнения, покупки)
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'deposit', 'case_opening', 'refund'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Настройки сайта
CREATE TABLE public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS для всех таблиц
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Функция для проверки роли администратора
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Политики для профилей
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- Политики для игр (публичный просмотр, админы могут все)
CREATE POLICY "Anyone can view games" ON public.games
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage games" ON public.games
  FOR ALL USING (public.is_admin());

-- Политики для кейсов
CREATE POLICY "Anyone can view cases" ON public.cases
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage cases" ON public.cases
  FOR ALL USING (public.is_admin());

-- Политики для предметов кейсов
CREATE POLICY "Anyone can view case items" ON public.case_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage case items" ON public.case_items
  FOR ALL USING (public.is_admin());

-- Политики для открытий кейсов
CREATE POLICY "Users can view their own openings" ON public.case_openings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create openings" ON public.case_openings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all openings" ON public.case_openings
  FOR SELECT USING (public.is_admin());

-- Политики для транзакций
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT USING (public.is_admin());

-- Политики для настроек сайта
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- Триггер для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, balance)
  VALUES (new.id, new.raw_user_meta_data->>'username', 1000);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Вставляем начальные данные
INSERT INTO public.games (name, icon) VALUES 
  ('Brawl Stars', '🎮'),
  ('CS:GO', '🔫'),
  ('PUBG Mobile', '🪖'),
  ('Roblox', '🎲');

-- Получаем ID игр для кейсов
INSERT INTO public.cases (name, game_id, price, image, gradient, icon)
SELECT 
  'Мега Бокс', 
  g.id, 
  299, 
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
  'from-purple-600 via-pink-600 to-red-600',
  '🎮'
FROM public.games g WHERE g.name = 'Brawl Stars';

INSERT INTO public.cases (name, game_id, price, image, gradient, icon)
SELECT 
  'Operation Case', 
  g.id, 
  499, 
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
  'from-blue-600 via-cyan-600 to-teal-600',
  '🔫'
FROM public.games g WHERE g.name = 'CS:GO';

-- Добавляем предметы в кейсы
INSERT INTO public.case_items (case_id, name, price, rarity, chance)
SELECT 
  c.id,
  'Гемы x100',
  150,
  'common'::item_rarity,
  30.00
FROM public.cases c WHERE c.name = 'Мега Бокс';

INSERT INTO public.case_items (case_id, name, price, rarity, chance)
SELECT 
  c.id,
  'Легендарный Бойец',
  5000,
  'legendary'::item_rarity,
  5.00
FROM public.cases c WHERE c.name = 'Мега Бокс';

-- Начальные настройки сайта
INSERT INTO public.site_settings (key, value) VALUES 
  ('site_name', 'Vaultory'),
  ('maintenance_mode', 'false'),
  ('total_revenue', '50000');
