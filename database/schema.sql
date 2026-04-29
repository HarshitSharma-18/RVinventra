-- Drop existing tables to avoid "already exists" errors
DROP TABLE IF EXISTS transaction_items CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS items CASCADE;

-- 1. Create 'items' table for inventory management
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    stock INTEGER NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE
);

-- Enable RLS and Create Policies for items
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to items for backend" ON items FOR ALL USING (true) WITH CHECK (true);

-- 2. Create 'transactions' table to store the overarching bills
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer_name TEXT NOT NULL,
    contact_number TEXT,
    total_amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL
);

-- Enable RLS and Create Policies for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to transactions for backend" ON transactions FOR ALL USING (true) WITH CHECK (true);

-- 3. Create 'transaction_items' table to store specific items within each bill
CREATE TABLE transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL
);

-- Enable RLS and Create Policies for transaction_items
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to transaction_items for backend" ON transaction_items FOR ALL USING (true) WITH CHECK (true);

-- 4. Create an RPC function to securely decrement stock atomically
CREATE OR REPLACE FUNCTION deduct_stock(p_item_id UUID, p_quantity INTEGER)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE items
    SET stock = stock - p_quantity
    WHERE id = p_item_id;
END;
$$;
