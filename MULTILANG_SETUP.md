# 🌍 Система многоязычности Vaultory

## ✅ Что уже реализовано

### 🎯 **Поддерживаемые языки:**
- 🇷🇺 **Русский** (ru) - по умолчанию
- 🇺🇸 **Английский** (en) 
- 🇺🇦 **Украинский** (uk)

### 🔧 **Компоненты с переводами:**
- ✅ **Header** - обновлен под новую цветовую схему (красно-фиолетовую)
- ✅ **Footer** - обновлен под новую цветовую схему
- ✅ **LanguageSwitcher** - обновлен под новую цветовую схему
- ✅ **ProductCard** - использует переводы названий товаров из БД
- ✅ **CaseCard** - использует переводы названий кейсов из БД
- ✅ **Index** - использует переводы категорий из БД

### 🗄️ **База данных:**
- ✅ **product_translations** - переводы товаров (название, описание, особенности)
- ✅ **case_translations** - переводы кейсов (название, описание)
- ✅ **case_item_translations** - переводы предметов кейсов
- ✅ **category_translations** - переводы категорий

---

## 🚀 Как запустить систему

### 1. **Выполните SQL скрипт в Supabase:**
```bash
# Откройте Supabase SQL Editor и выполните:
create-multilang-system.sql
```

### 2. **Система автоматически:**
- Создаст все необходимые таблицы
- Настроит индексы и RLS политики
- Добавит базовые переводы для категорий и кейсов
- Добавит примеры переводов товаров

### 3. **Переводы в интерфейсе:**
Уже работают автоматически! При переключении языка 🇷🇺→🇺🇸→🇺🇦 переводятся:
- Все тексты интерфейса
- Названия товаров (если есть в БД)
- Названия кейсов (если есть в БД)  
- Названия категорий (если есть в БД)

---

## 📝 Как добавить переводы

### **Для товаров:**
```sql
INSERT INTO product_translations (product_id, language, name, description, features) VALUES
('your_product_id', 'en', 'Product Name EN', 'Description EN', ARRAY['Feature 1', 'Feature 2']),
('your_product_id', 'uk', 'Product Name UK', 'Description UK', ARRAY['Feature 1 UK', 'Feature 2 UK']);
```

### **Для кейсов:**
```sql
INSERT INTO case_translations (case_id, language, name, description) VALUES
('your_case_id', 'en', 'Case Name EN', 'Description EN'),
('your_case_id', 'uk', 'Case Name UK', 'Description UK');
```

### **Для категорий:**
```sql
INSERT INTO category_translations (category_id, language, name) VALUES
('your_category_id', 'en', 'Category Name EN'),
('your_category_id', 'uk', 'Category Name UK');
```

---

## 🎨 Обновленный дизайн

### **Новая цветовая схема:**
- 🔴 **Красный** (#ef4444) - основные акценты
- 🟣 **Фиолетовый** (#8b5cf6) - дополнительные акценты  
- ⚫ **Темные тона** - фон и контейнеры

### **Обновленные компоненты:**
- **LanguageSwitcher**: красные акценты вместо изумрудных
- **ProductCard**: красная цена и счетчик продаж
- **CaseCard**: красная общая стоимость
- **Header/Footer**: красно-фиолетовая схема

---

## 🔥 Как это работает

### **При смене языка:**
1. `useLanguage` сохраняет выбор в localStorage
2. `useTranslations` загружает переводы из БД для текущего языка
3. Компоненты автоматически обновляются с новыми переводами
4. Fallback на оригинальное название, если перевод не найден

### **Функции перевода:**
```javascript
// В любом компоненте:
const { getProductTranslation, getCaseTranslation, getCategoryTranslation } = useTranslations();

// Использование:
const translatedName = getProductTranslation(productId, 'name', fallbackName);
const translatedDescription = getProductTranslation(productId, 'description', fallbackDescription);
```

---

## ✨ Результат

**При переключении языка весь сайт переводится:**
- 🇷🇺 "Феникс" → 🇺🇸 "Phoenix" → 🇺🇦 "Фенікс"
- 🇷🇺 "1000 Robux" → 🇺🇸 "1000 Robux" → 🇺🇦 "1000 Robux" 
- 🇷🇺 "Валюта" → 🇺🇸 "Currency" → 🇺🇦 "Валюта"
- 🇷🇺 "Открыть кейс" → 🇺🇸 "Open case" → 🇺🇦 "Відкрити кейс"

**И так далее для всех элементов сайта!** 🎉

---

## 🛠️ Техническая информация

### **Хуки:**
- `useLanguage` - управление текущим языком
- `useTranslations` - получение переводов из БД

### **Компоненты:**
- `LanguageSwitcher` - переключатель языков
- Все основные компоненты обновлены для поддержки переводов

### **База данных:**
- Автоматические триггеры для `updated_at`
- RLS политики для безопасности  
- Индексы для быстрого поиска
- UNIQUE ограничения для предотвращения дублей

**Система готова к использованию!** 🚀
