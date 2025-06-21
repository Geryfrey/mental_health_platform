-- Fix the password column name if the table already exists
-- This script will rename the column if it exists as password_hash

DO $$
BEGIN
    -- Check if password_hash column exists and rename it to password
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE users RENAME COLUMN password_hash TO password;
    END IF;
END $$;
