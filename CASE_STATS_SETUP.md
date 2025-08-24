# Настройка системы отслеживания статистики кейсов

## Описание

Система автоматически отслеживает количество открытий каждого кейса пользователем для определения "любимого кейса" в инвентаре.

## Что уже реализовано

### 1. Хук useCaseStats
- Автоматически загружает статистику пользователя
- Отслеживает открытия кейсов
- Определяет любимый кейс по количеству открытий

### 2. Интеграция с CasePage
- При открытии кейса автоматически увеличивается счетчик
- Статистика обновляется в реальном времени

### 3. Страница инвентаря
- Показывает любимый кейс пользователя
- Отображает статистику открытий

## Что нужно настроить в базе данных

### 1. Создать таблицу user_case_stats

```sql
CREATE TABLE IF NOT EXISTS user_case_stats (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES profiles(telegram_id) ON DELETE CASCADE,
  case_id INTEGER NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  opened_count INTEGER DEFAULT 0,
  last_opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, case_id)
);
```

### 2. Создать индексы для производительности

```sql
CREATE INDEX IF NOT EXISTS idx_user_case_stats_user_id ON user_case_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_case_stats_case_id ON user_case_stats(case_id);
CREATE INDEX IF NOT EXISTS idx_user_case_stats_opened_count ON user_case_stats(opened_count);
```

### 3. Создать функцию для получения любимого кейса

```sql
CREATE OR REPLACE FUNCTION get_user_favorite_case(user_telegram_id INTEGER)
RETURNS TABLE(
  case_id INTEGER,
  case_name TEXT,
  opened_count INTEGER,
  case_image_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as case_id,
    c.name as case_name,
    ucs.opened_count,
    c.image_url as case_image_url
  FROM user_case_stats ucs
  JOIN cases c ON ucs.case_id = c.id
  WHERE ucs.user_id = user_telegram_id
  ORDER BY ucs.opened_count DESC, ucs.last_opened_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

## Как работает система

### 1. Открытие кейса
- Пользователь нажимает "Открыть кейс"
- Запускается рулетка
- При выпадении предмета вызывается `handleCaseOpened`
- Автоматически увеличивается счетчик в `user_case_stats`

### 2. Определение любимого кейса
- Система анализирует таблицу `user_case_stats`
- Находит кейс с наибольшим количеством открытий
- Если количество одинаковое, выбирает последний открытый

### 3. Отображение в инвентаре
- Показывает любимый кейс с количеством открытий
- Обновляется в реальном времени
- Синхронизируется только с кейсами, открытыми на сайте

## Безопасность

- Счетчик скрыт от пользователей и админов
- Доступен только через код
- Автоматически обновляется при каждом открытии
- Нельзя изменить вручную через интерфейс

## Тестирование

1. Откройте любой кейс несколько раз
2. Перейдите в инвентарь
3. Проверьте, что любимый кейс отображается корректно
4. Убедитесь, что счетчик увеличивается

## Примечания

- Система работает только с авторизованными пользователями
- Статистика сохраняется в базе данных Supabase
- При удалении пользователя статистика автоматически удаляется
- При удалении кейса статистика автоматически удаляется
