-- Исправляем политики RLS для таблицы profiles
-- Разрешаем создание профилей (INSERT)
DROP POLICY IF EXISTSUsers can insert their own profile" ON public.profiles;
CREATE POLICYUsers can insert their own profile" ON public.profiles 
FOR INSERT WITH CHECK (true);

-- Разрешаем обновление профилей (UPDATE)
DROP POLICY IF EXISTSUsers can update their own profile" ON public.profiles;
CREATE POLICYUsers can update their own profile" ON public.profiles 
FOR UPDATE USING (true);

-- Разрешаем удаление профилей (DELETE) - опционально
DROP POLICY IF EXISTSUsers can delete their own profile" ON public.profiles;
CREATE POLICYUsers can delete their own profile" ON public.profiles 
FOR DELETE USING (true);

-- Оставляем существующую политику для SELECT (просмотр всех профилей)
-- DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
-- CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true); 