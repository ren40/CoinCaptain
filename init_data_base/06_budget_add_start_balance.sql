-- Для уже существующих БД: поле start_balance уже в 05_budget.sql, этот скрипт оставлен для миграций
ALTER TABLE budgets 
ADD COLUMN IF NOT EXISTS start_balance DECIMAL(10, 2) NOT NULL DEFAULT 0;
