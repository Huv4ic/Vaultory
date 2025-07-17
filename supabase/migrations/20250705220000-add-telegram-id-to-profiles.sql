-- Добавляем поле telegram_id для поддержки Telegram-авторизации
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS telegram_id bigint;
-- Можно добавить уникальный индекс, если нужно:
-- CREATE UNIQUE INDEX IF NOT EXISTS profiles_telegram_id_idx ON public.profiles(telegram_id) WHERE telegram_id IS NOT NULL; 