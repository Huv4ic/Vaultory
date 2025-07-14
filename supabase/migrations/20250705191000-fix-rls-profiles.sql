-- Включаем RLS для таблицы profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Разрешаем всем SELECT (чтобы пользователи всегда были видны)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true); 