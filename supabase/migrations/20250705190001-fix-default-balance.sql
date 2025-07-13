-- Исправляем баланс по умолчанию с 1000 на 0
-- Обновляем функцию создания нового пользователя
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, balance)
  VALUES (new.id, new.raw_user_meta_data->>'username', 0);
  RETURN new;
END;
$$;

-- Обновляем существующих пользователей, у которых баланс 1000 и они не тратили деньги
UPDATE public.profiles 
SET balance = 0 
WHERE balance = 1000 
AND total_spent = 0 
AND cases_opened = 0; 