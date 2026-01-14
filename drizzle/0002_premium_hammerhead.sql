CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"cover_image" text,
	"content" jsonb,
	"published" boolean DEFAULT false,
	"author_id" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "client_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"author" text NOT NULL,
	"content" text NOT NULL,
	"type" text DEFAULT 'note' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text NOT NULL,
	"title" text,
	"category" text NOT NULL,
	"is_before_after" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"photo_url" text,
	"approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "methodology_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "enrollments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "modules" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "enrollments" CASCADE;--> statement-breakpoint
DROP TABLE "modules" CASCADE;--> statement-breakpoint
ALTER TABLE "courses" DROP CONSTRAINT "courses_slug_unique";--> statement-breakpoint
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_module_id_modules_id_fk";
--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "auth_user_id" uuid;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "role" text DEFAULT 'client';--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "technical_notes" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "total_visits" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "last_visit" timestamp;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "birth_date" timestamp;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "thumbnail" text;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "active" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "course_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "duration" integer;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "resources" jsonb;--> statement-breakpoint
ALTER TABLE "client_logs" ADD CONSTRAINT "client_logs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "cover_image_url";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "is_published";--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "module_id";--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "duration_minutes";--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "is_free_preview";