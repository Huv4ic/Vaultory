-- Добавляем счетчик открытых кейсов и статус в таблицу profiles
DO $$ 
BEGIN
    -- Добавляем столбец cases_opened если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'cases_opened') THEN
        ALTER TABLE public.profiles ADD COLUMN cases_opened INTEGER DEFAULT 0;
    END IF;
    
    -- Добавляем столбец status если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'status') THEN
        ALTER TABLE public.profiles ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'banned'));
    END IF;
    
    -- Добавляем столбец total_spent если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_spent') THEN
        ALTER TABLE public.profiles ADD COLUMN total_spent INTEGER DEFAULT 0;
    END IF;
    
    -- Добавляем столбец total_deposited если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_deposited') THEN
        ALTER TABLE public.profiles ADD COLUMN total_deposited INTEGER DEFAULT 0;
    END IF;
END $$;

-- Обновляем существующие записи, считаем количество открытых кейсов
UPDATE public.profiles 
SET cases_opened = (
    SELECT COUNT(*) 
    FROM public.case_openings 
    WHERE case_openings.user_id = profiles.id
)
WHERE cases_opened = 0;

-- Создаем функцию для автоматического увеличения счетчика при открытии кейса
CREATE OR REPLACE FUNCTION public.increment_cases_opened()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles 
    SET cases_opened = cases_opened + 1
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер для автоматического увеличения счетчика
DROP TRIGGER IF EXISTS trigger_increment_cases_opened ON public.case_openings;
CREATE TRIGGER trigger_increment_cases_opened
    AFTER INSERT ON public.case_openings
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_cases_opened();

-- Создаем представление для статистики кейсов
CREATE OR REPLACE VIEW public.case_stats AS
SELECT 
    c.id,
    c.name,
    c.price,
    COUNT(co.id) as total_openings,
    COUNT(DISTINCT co.user_id) as unique_users,
    SUM(co.total_cost) as total_revenue
FROM public.cases c
LEFT JOIN public.case_openings co ON c.id = co.case_id
GROUP BY c.id, c.name, c.price;

-- Создаем представление для статистики пользователей  
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
    p.id,
    p.username,
    p.balance,
    p.cases_opened,
    p.status,
    p.total_spent,
    p.total_deposited,
    p.created_at,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as orders_total
FROM public.profiles p
LEFT JOIN public.orders o ON p.id = o.user_id
GROUP BY p.id, p.username, p.balance, p.cases_opened, p.status, p.total_spent, p.total_deposited, p.created_at;

-- Создаем индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_case_openings_user_case ON public.case_openings(user_id, case_id);
