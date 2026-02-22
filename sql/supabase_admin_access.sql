-- =============================================
-- KEVELYN COMPANY - ADMIN ACCESS & SCHEMA FIX
-- =============================================
-- 1. Ensure 'role' column exists in 'clients'
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='role') THEN
        ALTER TABLE "clients" ADD COLUMN "role" text DEFAULT 'client';
    END IF;
END $$;

-- 2. Create Trigger Function to automatically create client profiles
-- This links Supabase Auth Users to our public.clients table
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.clients (id, email, full_name, phone, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'client'
  )
  ON CONFLICT (email) DO UPDATE 
  SET id = EXCLUDED.id; -- Link existing client by email if it exists
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Setup Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. HELPER: Grant Admin Power (Manually)
-- Replace 'seu-email@exemplo.com' with the email you registered
-- UPDATE public.clients SET role = 'admin' WHERE email = 'seu-email@exemplo.com';

DO $$ BEGIN
    RAISE NOTICE 'Schema fix applied. Register at /register and then run the UPDATE command above to become admin.';
END $$;
