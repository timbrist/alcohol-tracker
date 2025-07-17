-- 1. Bar staff 
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff', -- could be 'admin', 'staff'
  created_at TIMESTAMP DEFAULT now()
);

-- 2. Alcohol categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- 3. Alcohol products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  total_cl REAL NOT NULL CHECK (total_cl >= 0),
  remaining_cl REAL NOT NULL CHECK (remaining_cl >= 0),
  price_per_cl REAL CHECK (price_per_cl >= 0),
  location TEXT, -- e.g., "Main Bar Shelf", "Storage"
  photo_url TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 4. Update logs for remaining centiliters
CREATE TABLE cl_updates (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  old_cl REAL NOT NULL CHECK (old_cl >= 0),
  new_cl REAL NOT NULL CHECK (new_cl >= 0),
  difference_cl REAL GENERATED ALWAYS AS (new_cl - old_cl) STORED,
  updated_by INTEGER REFERENCES users(id),
  note TEXT,
  updated_at TIMESTAMP DEFAULT now()
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password_hash, role) VALUES ('admin', '$2a$10$rQZ8NwYz8NwYz8NwYz8NwO', 'admin');

-- Insert some default categories
INSERT INTO categories (name) VALUES 
  ('Whiskey'),
  ('Vodka'),
  ('Gin'),
  ('Rum'),
  ('Tequila'),
  ('Wine'),
  ('Beer'),
  ('Liqueur'); 