-- =============================================
-- KEVELYN STUDIO - BOT ADDONS (Supabase)
-- =============================================
-- Run this AFTER 'supabase_reset_complete.sql'
-- needed for the WhatsApp Bot (SaaS Core)
-- =============================================

-- 1. Contacts (CRM)
CREATE TABLE IF NOT EXISTS "contacts" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "phone" text NOT NULL,
    "name" text,
    "tags" text[], -- Array of strings
    "status" text DEFAULT 'open', -- open, lead, customer
    "opt_out" boolean DEFAULT false,
    "tenant_id" text DEFAULT 'default',
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now(),
    UNIQUE("phone", "tenant_id")
);

-- 2. Waiting List (Calendar)
CREATE TABLE IF NOT EXISTS "waiting_list" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "phone" text NOT NULL,
    "name" text,
    "service_interest" text,
    "tenant_id" text DEFAULT 'default',
    "created_at" timestamp DEFAULT now()
);

-- 3. Holidays (Calendar Blocks)
CREATE TABLE IF NOT EXISTS "holidays" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "date" date NOT NULL UNIQUE, -- YYYY-MM-DD
    "description" text,
    "tenant_id" text DEFAULT 'default',
    "created_at" timestamp DEFAULT now()
);

-- 4. RPC Helper for Tags (Safe Append)
CREATE OR REPLACE FUNCTION append_tag(p_phone text, p_tag text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE contacts
    SET tags = array_append(tags, p_tag)
    WHERE phone = p_phone
    AND NOT (tags @> ARRAY[p_tag]); -- Only if not exists
END;
$$;

-- Seed Holidays (Example)
INSERT INTO "holidays" ("date", "description") VALUES
('2026-12-25', 'Natal'),
('2026-01-01', 'Ano Novo')
ON CONFLICT DO NOTHING;
