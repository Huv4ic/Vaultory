-- Исправляем политики RLS для таблицы profiles
-- Добавляем поле status, если его нет
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULTactive';

-- Удаляем дублирующее поле telegramid (если есть)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS telegramid;

-- Удаляем все существующие политики
DROP POLICY IF EXISTSUsers can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTSUsers can update their own profile" ON public.profiles;
DROP POLICY IF EXISTSUsers can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS Anyone can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS Anyone can update profiles" ON public.profiles;
DROP POLICY IF EXISTS Anyone can delete profiles" ON public.profiles;

-- Создаем новые политики
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY Anyone can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY Anyone can update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY Anyone can delete profiles" ON public.profiles FOR DELETE USING (true); 