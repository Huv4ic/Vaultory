
-- Создаем таблицу категорий товаров
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Создаем таблицу товаров
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  discount_price INTEGER,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  images TEXT[], -- массив ссылок на изображения
  video_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  tags TEXT[], -- массив тегов типа "Хит", "Новинка"
  metadata JSONB, -- дополнительные данные
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Создаем таблицу заказов
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  payment_method TEXT,
  account_data JSONB, -- данные выданного аккаунта
  replacement_requested BOOLEAN DEFAULT false,
  replacement_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Создаем таблицу аккаунтов для продажи
CREATE TABLE public.accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  account_data JSONB NOT NULL, -- логин, пароль и другие данные
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'blocked', 'reserved')),
  sold_to_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sold_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Создаем таблицу для настроек сайта (расширяем существующую)
INSERT INTO public.site_settings (key, value) VALUES 
('site_title', 'Vaultory'),
('site_description', 'Лучший магазин аккаунтов'),
('contact_email', 'support@vaultory.com'),
('contact_telegram', '@vaultory_support'),
('theme_primary_color', '#ef4444'),
('theme_secondary_color', '#8b5cf6'),
('animations_enabled', 'true'),
('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

-- Создаем таблицу логов админских действий
CREATE TABLE public.admin_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'user', 'product', 'order', etc.
  target_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Создаем индексы для оптимизации запросов
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_available ON public.products(is_available);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_accounts_product ON public.accounts(product_id);
CREATE INDEX idx_accounts_status ON public.accounts(status);
CREATE INDEX idx_admin_logs_admin ON public.admin_logs(admin_id);

-- Настраиваем RLS политики
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Политики для категорий
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (is_admin());

-- Политики для товаров
CREATE POLICY "Anyone can view available products" ON public.products FOR SELECT USING (is_available = true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (is_admin());

-- Политики для заказов
CREATE POLICY "Users can view their orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (is_admin());
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL USING (is_admin());

-- Политики для аккаунтов (только админы)
CREATE POLICY "Admins can manage accounts" ON public.accounts FOR ALL USING (is_admin());

-- Политики для логов админов
CREATE POLICY "Admins can view admin logs" ON public.admin_logs FOR SELECT USING (is_admin());
CREATE POLICY "Admins can create admin logs" ON public.admin_logs FOR INSERT WITH CHECK (is_admin());

-- Создаем функцию для логирования админских действий
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_target_type TEXT,
  p_target_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_logs (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), p_action, p_target_type, p_target_id, p_details);
END;
$$;
