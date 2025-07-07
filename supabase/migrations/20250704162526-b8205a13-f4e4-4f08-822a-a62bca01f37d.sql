-- Проверим и создадим недостающие столбцы в таблице games если их нет
DO $$ 
BEGIN
    -- Добавляем столбец sort_order если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'sort_order') THEN
        ALTER TABLE public.games ADD COLUMN sort_order INTEGER DEFAULT 0;
    END IF;
    
    -- Добавляем столбец is_active если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'is_active') THEN
        ALTER TABLE public.games ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Проверим и создадим недостающие столбцы в таблице cases если их нет
DO $$ 
BEGIN
    -- Добавляем столбец is_active если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cases' AND column_name = 'is_active') THEN
        ALTER TABLE public.cases ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Добавляем столбец sort_order если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cases' AND column_name = 'sort_order') THEN
        ALTER TABLE public.cases ADD COLUMN sort_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- Проверим и создадим недостающие столбцы в таблице products если их нет
DO $$ 
BEGIN
    -- Добавляем столбец game_id если его нет (привязка товаров к играм)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'game_id') THEN
        ALTER TABLE public.products ADD COLUMN game_id UUID REFERENCES public.games(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Создаем таблицу для хранения изображений если её нет
CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Настраиваем RLS для media_files
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Политики для медиафайлов
DROP POLICY IF EXISTS "Anyone can view media files" ON public.media_files;
DROP POLICY IF EXISTS "Admins can manage media files" ON public.media_files;

CREATE POLICY "Anyone can view media files" ON public.media_files FOR SELECT USING (true);
CREATE POLICY "Admins can manage media files" ON public.media_files FOR ALL USING (is_admin());

-- Добавляем индекс для оптимизации
CREATE INDEX IF NOT EXISTS idx_products_game ON public.products(game_id);
CREATE INDEX IF NOT EXISTS idx_media_files_type ON public.media_files(file_type);

-- Обновляем политику для игр чтобы показывать только активные
DROP POLICY IF EXISTS "Anyone can view games" ON public.games;
CREATE POLICY "Anyone can view active games" ON public.games FOR SELECT USING (is_active = true);

-- Обновляем политику для кейсов чтобы показывать только активные
DROP POLICY IF EXISTS "Anyone can view cases" ON public.cases;
CREATE POLICY "Anyone can view active cases" ON public.cases FOR SELECT USING (is_active = true);

ALTER TABLE profiles ADD COLUMN telegram_id bigint UNIQUE;
