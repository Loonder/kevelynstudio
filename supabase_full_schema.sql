-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Professionals
CREATE TABLE IF NOT EXISTS "professionals" (
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

-- 2. Services
CREATE TABLE IF NOT EXISTS "services" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "title" text NOT NULL,
    "description" text,
    "price" integer NOT NULL,
    "duration_minutes" integer NOT NULL,
    "category" text NOT NULL,
    "image_url" text,
    "created_at" timestamp DEFAULT now()
);

-- 3. Clients
CREATE TABLE IF NOT EXISTS "clients" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "full_name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "phone" text NOT NULL,
    "sensory_preferences" jsonb,
    "created_at" timestamp DEFAULT now()
);

-- 4. Appointments (Depends on Clients, Professionals, Services)
CREATE TABLE IF NOT EXISTS "appointments" (
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

-- 5. Courses
CREATE TABLE IF NOT EXISTS "courses" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "title" text NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "description" text,
    "price" integer NOT NULL,
    "cover_image_url" text,
    "is_published" boolean DEFAULT false,
    "created_at" timestamp DEFAULT now()
);

-- 6. Modules
CREATE TABLE IF NOT EXISTS "modules" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "course_id" uuid NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "order" integer NOT NULL,
    "created_at" timestamp DEFAULT now()
);

-- 7. Lessons
CREATE TABLE IF NOT EXISTS "lessons" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "module_id" uuid NOT NULL REFERENCES "modules"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "video_url" text,
    "duration_minutes" integer,
    "is_free_preview" boolean DEFAULT false,
    "order" integer NOT NULL,
    "created_at" timestamp DEFAULT now()
);

-- 8. Enrollments
CREATE TABLE IF NOT EXISTS "enrollments" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "client_id" uuid NOT NULL REFERENCES "clients"("id"),
    "course_id" uuid NOT NULL REFERENCES "courses"("id"),
    "enrolled_at" timestamp DEFAULT now(),
    "progress" integer DEFAULT 0
);

-- (Methodology Steps was likely already created, but adding IF NOT EXISTS just in case)
CREATE TABLE IF NOT EXISTS "methodology_steps" (
    "id" SERIAL PRIMARY KEY,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);
