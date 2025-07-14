-- Включаем RLS для таблицы profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политика: админы видят всех пользователей
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (is_admin());

-- ВРЕМЕННО: разрешаем всем SELECT (для теста, можно удалить после проверки)
CREATE POLICY "Anyone can view profiles" ON public.profiles
  FOR SELECT USING (true); 