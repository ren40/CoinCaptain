CREATE TABLE balance (
    id SERIAL PRIMARY KEY,
    balance_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    balance_amount INT,
    user_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	);

CREATE OR REPLACE FUNCTION update_balance()
RETURNS TRIGGER AS $$
DECLARE
    user_id INT := NEW.user_id;
    current_date DATE := CURRENT_DATE;
    start_of_month DATE;
    end_of_month DATE;
    sum_amount NUMERIC;
BEGIN
    -- Определить начало и конец текущего месяца
    start_of_month := DATE_TRUNC('month', current_date);
    end_of_month := (DATE_TRUNC('month', current_date) + INTERVAL '1 month') - INTERVAL '1 day';
    
    -- Получить сумму транзакций за текущий месяц
    sum_amount := (
        SELECT SUM(t.amount)
        FROM transactions t
        WHERE t.user_id = user_id 
              AND t.created_at >= start_of_month
              AND t.created_at <= end_of_month
    );
    
    -- Проверить existence записи в balance
    IF NOT EXISTS (
        SELECT 1
        FROM balance b
        WHERE b.user_id = user_id 
              AND b.balance_date = start_of_month
    ) THEN
        -- Вставить новую запись
        INSERT INTO balance (user_id, balance_date, balance_amount)
        VALUES (user_id, start_of_month, sum_amount);
    ELSE
        -- Обновить существующую запись
        UPDATE balance
        SET balance_amount = sum_amount
        WHERE user_id = user_id 
              AND balance_date = start_of_month;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создать триггер, который вызывает функцию update_balance() при вставке новой транзакции
CREATE TRIGGER after_insert_transaction
BEFORE INSERT ON transactions
FOR EACH ROW EXECUTE PROCEDURE update_balance();