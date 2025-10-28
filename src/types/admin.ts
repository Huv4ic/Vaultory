export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  game: string;
  description?: string;
  features?: string[];
  game_category_id?: string;
  subcategory_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminCase {
  id: string;
  name: string;
  game: string;
  price: number;
  image_url: string;
  description?: string;
  created_at: string;
  updated_at: string;
  items?: AdminCaseItem[];
}

export interface AdminCaseItem {
  id: string;
  case_id: string;
  name: string;
  rarity: string; // Принимаем string из базы данных
  drop_chance: number;
  image_url?: string;
  drop_after_cases?: number; // Временно опциональное поле
  price: number; // Цена предмета
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  telegram_id: number | null;
  username: string | null;
  balance: number | null;
  cases_opened: number | null;
  total_deposited: number | null;
  total_spent: number | null;
  role: 'user' | 'admin' | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface GameSubcategory {
  id: string;
  game_category_id: string;
  name: string;
  name_en?: string;
  name_ru?: string;
  slug: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  game: string;
  description: string;
  features: string[];
  game_category_id: string;
  subcategory_id?: string;
}

export interface CaseFormData {
  id?: string; // Добавляем опциональное поле id
  name: string;
  game: string;
  price: number;
  image_url: string;
  description: string;
}

export interface CaseItemFormData {
  id?: string; // Добавляем опциональное поле id
  name: string;
  rarity: string; // Принимаем string для гибкости
  image_url: string;
  drop_after_cases?: number; // Временно опциональное поле
  price: number; // Цена предмета
}
