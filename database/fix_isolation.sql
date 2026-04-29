-- 1. Add user_id column to 'items'
ALTER TABLE items ADD COLUMN IF NOT EXISTS user_id UUID;

-- 2. Add user_id column to 'transactions'
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id UUID;

-- 3. Update RLS policies for 'items' to isolate data by user
DROP POLICY IF EXISTS "Allow all access to items for backend" ON items;
CREATE POLICY "Users can only access their own items" 
ON items FOR ALL 
USING (user_id::text = auth.uid()::text OR user_id IS NULL) 
WITH CHECK (user_id::text = auth.uid()::text OR user_id IS NULL);

-- 4. Update RLS policies for 'transactions' to isolate data by user
DROP POLICY IF EXISTS "Allow all access to transactions for backend" ON transactions;
CREATE POLICY "Users can only access their own transactions" 
ON transactions FOR ALL 
USING (user_id::text = auth.uid()::text OR user_id IS NULL) 
WITH CHECK (user_id::text = auth.uid()::text OR user_id IS NULL);

-- 5. Update RLS policies for 'transaction_items'
-- Since transaction_items references transactions, we can join or just allow all for now
-- A better way is to check the ownership of the parent transaction
DROP POLICY IF EXISTS "Allow all access to transaction_items for backend" ON transaction_items;
CREATE POLICY "Users can access transaction items of their own transactions"
ON transaction_items FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM transactions 
    WHERE transactions.id = transaction_items.transaction_id 
    AND (transactions.user_id::text = auth.uid()::text OR transactions.user_id IS NULL)
  )
);
