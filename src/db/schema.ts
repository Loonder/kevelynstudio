import { pgTable, text, timestamp, uuid, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
export * from "../lib/schema/cms";

// --- Users & Staff ---
export const professionals = pgTable("professionals", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(), // for URL
    role: text("role").notNull(),
    bio: text("bio"),
    instagramHandle: text("instagram_handle"),
    imageUrl: text("image_url"),
    color: text("color").default("#D4AF37"), // Gold default
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});

// --- Services ---
export const services = pgTable("services", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    price: integer("price").notNull(), // in cents
    durationMinutes: integer("duration_minutes").notNull(),
    category: text("category").notNull(), // 'Lashes', 'Brows'
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow(),
});

// --- Clients (SENSORY PREFS HERE) ---
export const clients = pgTable("clients", {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: text("email").unique().notNull(),
    phone: text("phone").notNull(),
    authUserId: uuid("auth_user_id"), // Linked to Supabase Auth.users
    role: text("role").$type<"admin" | "reception" | "client">().default("client"),

    // The 'Memory' of the studio
    sensoryPreferences: jsonb("sensory_preferences").$type<{
        favoriteMusic?: string; // Genre or Artist
        drinkPreference?: "Water" | "Coffee" | "Champagne" | "Tea" | "None";
        temperature?: "Warm" | "Cool" | "Neutral";
        musicVolume?: "Soft" | "Medium" | "Deep";
    }>(),

    // Phase 4: Technical History (simplified for now)
    technicalNotes: text("technical_notes"), // Last mapping, glue used, etc.
    notes: text("notes"), // General CRM notes
    totalVisits: integer("total_visits").default(0),
    lastVisit: timestamp("last_visit"),
    birthDate: timestamp("birth_date"),

    createdAt: timestamp("created_at").defaultNow(),
});

export const clientLogs = pgTable("client_logs", {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id").references(() => clients.id).notNull(),
    author: text("author").notNull(), // Who wrote the log (e.g., "Kevelyn")
    content: text("content").notNull(),
    type: text("type").notNull().default("note"), // 'note', 'call', 'complaint'
    createdAt: timestamp("created_at").defaultNow(),
});


// --- Appointments (The Core) ---
export const appointments = pgTable("appointments", {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id").references(() => clients.id).notNull(),
    professionalId: uuid("professional_id").references(() => professionals.id).notNull(),
    serviceId: uuid("service_id").references(() => services.id).notNull(),

    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(), // Calculated based on duration + buffer

    status: text("status").$type<"pending" | "confirmed" | "completed" | "cancelled" | "no_show">().default("pending"),

    // Integration Flags
    googleEventId: text("google_event_id"),

    createdAt: timestamp("created_at").defaultNow(),
});

export const appointmentsRelations = relations(appointments, ({ one }) => ({
    client: one(clients, {
        fields: [appointments.clientId],
        references: [clients.id],
    }),
    professional: one(professionals, {
        fields: [appointments.professionalId],
        references: [professionals.id],
    }),
    service: one(services, {
        fields: [appointments.serviceId],
        references: [services.id],
    }),
}));


// --- Masterclass Platform ---

export const courses = pgTable("courses", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    thumbnail: text("thumbnail"),
    price: integer("price").notNull(), // in cents
    active: boolean("active").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id").references(() => courses.id, { onDelete: 'cascade' }).notNull(),
    title: text("title").notNull(),
    videoUrl: text("video_url"), // YouTube, Vimeo, Bunny
    duration: integer("duration"), // minutes
    order: integer("order").notNull(),
    resources: jsonb("resources"), // PDF links, etc.
    createdAt: timestamp("created_at").defaultNow(),
});

// --- Blog (Rich Content) ---

export const blogPosts = pgTable("blog_posts", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").unique().notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    coverImage: text("cover_image"),
    content: jsonb("content"), // Rich content blocks
    published: boolean("published").default(false),
    authorId: text("author_id"), // Could be UUID relations or simple text for now
    createdAt: timestamp("created_at").defaultNow(),
});

// --- Reviews ---

export const reviews = pgTable("reviews", {
    id: uuid("id").primaryKey().defaultRandom(),
    clientName: text("client_name").notNull(),
    rating: integer("rating").notNull(), // 1-5
    comment: text("comment"),
    photoUrl: text("photo_url"),
    approved: boolean("approved").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

// Keep existing gallery if needed, or remove if creating conflicts. 
// Assuming Gallery is separate.
export const galleryImages = pgTable("gallery_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    imageUrl: text("image_url").notNull(),
    title: text("title"),
    category: text("category").notNull(),
    isBeforeAfter: boolean("is_before_after").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

