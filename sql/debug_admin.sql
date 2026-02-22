-- =============================================
-- KEVELYN COMPANY - LOGIN DEBUG & FORCE ADMIN
-- =============================================

-- 1. DIAGNOSTIC: Check your actual database state
-- Run this first and look at the results
SELECT id, email, role FROM public.clients;

-- 2. FORCE ADMIN (God Mode)
-- Step A: Ensure column exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='role') THEN
        ALTER TABLE "clients" ADD COLUMN "role" text DEFAULT 'client';
    END IF;
END $$;

-- Step B: Force Admin for YOUR email
-- !!! REPLACE 'seu-email@exemplo.com' with the email you registered !!!
UPDATE public.clients 
SET role = 'admin' 
WHERE LOWER(email) = LOWER('admin@admin.com');

-- Step C: Auto-confirm email (In case you haven't clicked the link)
-- Note: This requires permissions usually available in the Supabase SQL editor
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    last_sign_in_at = NOW()
WHERE LOWER(email) = LOWER('admin@admin.com');

-- 3. FINAL CHECK
SELECT 'Pronto! Tente logar agora em /login' as status;
