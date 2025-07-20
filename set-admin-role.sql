-- SQL-скрипт для установки роли администратора
-- Выполните этот скрипт в DBeaver или Supabase SQL Editor

-- 1. Проверяем, есть ли пользователь с Telegram ID 936111949
SELECT 
    id,
    telegram_id,
    username,
    role,
    status,
    balance,
    created_at
FROM profiles 
WHERE telegram_id = 936111949;

-- 2. Если пользователь найден, обновляем его роль на admin
UPDATE profiles 
SET role = 'admin' 
WHERE telegram_id = 936111949;

-- 3. Проверяем результат
SELECT 
    id,
    telegram_id,
    username,
    role,
    status,
    balance,
    created_at
FROM profiles 
WHERE telegram_id = 936111949;

-- 4. Показываем всех пользователей для проверки
SELECT 
    id,
    telegram_id,
    username,
    role,
    status,
    balance,
    created_at
FROM profiles 
ORDER BY created_at DESC; 