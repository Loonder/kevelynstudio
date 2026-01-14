-- ========================================
-- KEVELYN STUDIO - DATABASE RESET SCRIPT
-- ========================================
-- Run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste this → Run
-- ========================================

-- 1. Drop Tables (Order matters because of foreign keys)
DROP TABLE IF EXISTS "enrollments" CASCADE;
DROP TABLE IF EXISTS "lessons" CASCADE;
DROP TABLE IF EXISTS "modules" CASCADE;
DROP TABLE IF EXISTS "courses" CASCADE;
DROP TABLE IF EXISTS "appointments" CASCADE;
DROP TABLE IF EXISTS "methodology_steps" CASCADE;
DROP TABLE IF EXISTS "services" CASCADE;
DROP TABLE IF EXISTS "professionals" CASCADE;
DROP TABLE IF EXISTS "clients" CASCADE;

-- 2. Create Tables (Matching schema.ts exactly)

-- Professionals
CREATE TABLE "professionals" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" text NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "role" text NOT NULL,
    "bio" text,
    "instagram_handle" text,
    "image_url" text,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now()
);

-- Services
CREATE TABLE "services" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "title" text NOT NULL,
    "description" text,
    "price" integer NOT NULL,
    "duration_minutes" integer NOT NULL,
    "category" text NOT NULL,
    "image_url" text,
    "created_at" timestamp DEFAULT now()
);

-- Clients
CREATE TABLE "clients" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "full_name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "phone" text NOT NULL,
    "sensory_preferences" jsonb,
    "created_at" timestamp DEFAULT now()
);

-- Appointments
CREATE TABLE "appointments" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "client_id" uuid NOT NULL REFERENCES "clients"("id"),
    "professional_id" uuid NOT NULL REFERENCES "professionals"("id"),
    "service_id" uuid NOT NULL REFERENCES "services"("id"),
    "start_time" timestamp NOT NULL,
    "end_time" timestamp NOT NULL,
    "status" text DEFAULT 'pending',
    "google_event_id" text,
    "created_at" timestamp DEFAULT now()
);

-- Methodology Steps (NEW)
CREATE TABLE "methodology_steps" (
    "id" SERIAL PRIMARY KEY,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

-- Courses (For future)
CREATE TABLE "courses" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "title" text NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "description" text,
    "price" integer NOT NULL,
    "cover_image_url" text,
    "is_published" boolean DEFAULT false,
    "created_at" timestamp DEFAULT now()
);

CREATE TABLE "modules" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "course_id" uuid NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "order" integer NOT NULL,
    "created_at" timestamp DEFAULT now()
);

CREATE TABLE "lessons" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "module_id" uuid NOT NULL REFERENCES "modules"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "video_url" text,
    "duration_minutes" integer,
    "is_free_preview" boolean DEFAULT false,
    "order" integer NOT NULL,
    "created_at" timestamp DEFAULT now()
);

CREATE TABLE "enrollments" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "client_id" uuid NOT NULL REFERENCES "clients"("id"),
    "course_id" uuid NOT NULL REFERENCES "courses"("id"),
    "enrolled_at" timestamp DEFAULT now(),
    "progress" integer DEFAULT 0
);


-- 3. SEED DATA (Populate with Defaults)

-- Professionals
INSERT INTO "professionals" ("name", "slug", "role", "bio", "is_active") 
VALUES ('Kevelyn Silva', 'kevelyn-silva', 'Master Artist', 'Especialista em Visagismo e Design de Sobrancelhas.', true);

-- Services
INSERT INTO "services" ("title", "description", "price", "duration_minutes", "category") 
VALUES 
('Nanoblading', 'Técnica avançada de micropigmentação fio a fio para sobrancelhas ultra-realistas.', 45000, 120, 'Sobrancelhas'),
('Brow Lamination', 'Laminação de sobrancelhas para efeito volumoso e natural.', 18000, 60, 'Sobrancelhas'),
('Lash Lifting', 'Curvatura e volume natural dos cílios sem extensões.', 15000, 60, 'Cílios');

-- Methodology
INSERT INTO "methodology_steps" ("title", "description", "order", "active") 
VALUES 
    ('Visagismo Analítico', 'Análise da estrutura óssea e simetria facial para um design exclusivo.', 1, true),
    ('Health First', 'Produtos de alta performance que nutrem enquanto embelezam, priorizando a saúde dos fios.', 2, true),
    ('Mapping Personalizado', 'Mapeamento milimétrico de curvaturas e espessuras para harmonização perfeita.', 3, true),
    ('Experiência Sensorial', 'Aromaterapia e conforto absoluto para um momento de desconexão total.', 4, true);

-- Clients
INSERT INTO "clients" ("full_name", "email", "phone") 
VALUES ('Cliente Demonstração', 'demo@kevelynstudio.com', '11999999999');

-- Appointments (Mock data for testing)
INSERT INTO "appointments" ("client_id", "professional_id", "service_id", "start_time", "end_time", "status")
SELECT 
    c.id, p.id, s.id, 
    NOW() + interval '1 day',
    NOW() + interval '1 day 2 hours', 
    'confirmed'
FROM "clients" c, "professionals" p, "services" s
WHERE c.email = 'demo@kevelynstudio.com' 
AND p.slug = 'kevelyn-silva'
AND s.title = 'Nanoblading'
LIMIT 1;

-- Success message
SELECT '✅ DATABASE RESET AND SEEDED SUCCESSFULLY!' as status;
SELECT '📊 Tables Created: ' || count(*) || ' tables' as info FROM information_schema.tables WHERE table_schema = 'public';
SELECT '👤 Professionals: ' || count(*) as count FROM professionals;
SELECT '💅 Services: ' || count(*) as count FROM services;
SELECT '📋 Methodology Steps: ' || count(*) as count FROM methodology_steps;
