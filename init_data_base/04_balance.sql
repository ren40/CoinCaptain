CREATE TABLE balance (
    id SERIAL PRIMARY KEY,
    balance_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    balance_amount DECIMAL(10, 2) DEFAULT 0,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_balance_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_balance_user_date ON balance(user_id, balance_date);

CREATE OR REPLACE FUNCTION update_balance()
RETURNS TRIGGER AS $$
DECLARE
    user_id INTEGER := NEW.user_id;
    transaction_date DATE := NEW.date;
    start_of_month DATE;
    end_of_month DATE;
    sum_amount DECIMAL(10, 2) := 0;
BEGIN
    start_of_month := DATE_TRUNC('month', transaction_date);
    end_of_month := (DATE_TRUNC('month', transaction_date) + INTERVAL '1 month') - INTERVAL '1 day';
    sum_amount := (
        SELECT COALESCE(SUM(
            CASE 
                WHEN t.is_income THEN t.amount 
                ELSE -t.amount 
            END
        ), 0)
        FROM transactions t
        WHERE t.user_id = user_id 
              AND t.date >= start_of_month
              AND t.date <= end_of_month
    );
    IF NOT EXISTS (
        SELECT 1
        FROM balance b
        WHERE b.user_id = user_id 
              AND DATE_TRUNC('month', b.balance_date) = start_of_month
    ) THEN
        INSERT INTO balance (user_id, balance_date, balance_amount)
        VALUES (user_id, start_of_month, sum_amount);
    ELSE
        UPDATE balance
        SET balance_amount = sum_amount
        WHERE user_id = user_id 
              AND DATE_TRUNC('month', balance_date) = start_of_month;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_insert_transaction ON transactions;
CREATE TRIGGER after_insert_transaction
AFTER INSERT ON transactions
FOR EACH ROW EXECUTE PROCEDURE update_balance();

CREATE OR REPLACE FUNCTION update_balance_for_month(p_user_id INTEGER, p_date DATE)
RETURNS void AS $$
DECLARE
    start_of_month DATE;
    end_of_month DATE;
    sum_amount DECIMAL(10, 2) := 0;
BEGIN
    start_of_month := DATE_TRUNC('month', p_date);
    end_of_month := (DATE_TRUNC('month', p_date) + INTERVAL '1 month') - INTERVAL '1 day';
    sum_amount := (
        SELECT COALESCE(SUM(
            CASE 
                WHEN t.is_income THEN t.amount 
                ELSE -t.amount 
            END
        ), 0)
        FROM transactions t
        WHERE t.user_id = p_user_id 
              AND t.date >= start_of_month
              AND t.date <= end_of_month
    );
    IF NOT EXISTS (
        SELECT 1
        FROM balance b
        WHERE b.user_id = p_user_id 
              AND DATE_TRUNC('month', b.balance_date) = start_of_month
    ) THEN
        INSERT INTO balance (user_id, balance_date, balance_amount)
        VALUES (p_user_id, start_of_month, sum_amount);
    ELSE
        UPDATE balance
        SET balance_amount = sum_amount
        WHERE user_id = p_user_id 
              AND DATE_TRUNC('month', balance_date) = start_of_month;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_balance_on_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.date IS DISTINCT FROM NEW.date OR OLD.amount IS DISTINCT FROM NEW.amount OR OLD.is_income IS DISTINCT FROM NEW.is_income THEN
        PERFORM update_balance_for_month(OLD.user_id, OLD.date);
    END IF;
    PERFORM update_balance_for_month(NEW.user_id, NEW.date);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_update_transaction ON transactions;
CREATE TRIGGER after_update_transaction
AFTER UPDATE ON transactions
FOR EACH ROW EXECUTE PROCEDURE update_balance_on_update();

CREATE OR REPLACE FUNCTION update_balance_on_delete()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_balance_for_month(OLD.user_id, OLD.date);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_delete_transaction ON transactions;
CREATE TRIGGER after_delete_transaction
AFTER DELETE ON transactions
FOR EACH ROW EXECUTE PROCEDURE update_balance_on_delete();
