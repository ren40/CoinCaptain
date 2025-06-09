-- CREATE TABLE Transactions (
--     id SERIAL PRIMARY KEY,
--     user_id INT NOT NULL,
--     date DATE NOT NULL,
--     description VARCHAR(255),
--     amount NUMERIC(10, 2) NOT NULL,
--     category_id INT,
--     is_income BOOLEAN NOT NULL,
--     balance NUMERIC(10, 2) NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- ALTER TABLE Transactions 
-- ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES Users(id),
-- ADD CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES Categories(id);

CREATE TABLE Transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    is_income BOOLEAN NOT NULL,
    balance DECIMAL(10, 2),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);