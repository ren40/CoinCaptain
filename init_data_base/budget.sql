CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    period VARCHAR(10) NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Создаем индекс для быстрого поиска активных бюджетов пользователя
CREATE INDEX idx_budgets_user_active ON budgets(user_id, is_active);

-- Создаем индекс для поиска по периоду
CREATE INDEX idx_budgets_period ON budgets(period);

-- Создаем индекс для поиска по датам
CREATE INDEX idx_budgets_dates ON budgets(start_date, end_date); 