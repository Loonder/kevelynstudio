import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const methodologySteps = sqliteTable('methodology_steps', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    order: integer('order').notNull().default(0),
    active: integer('active', { mode: 'boolean' }).default(true),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Add other CMS tables here as needed (e.g. Testimonials, FAQ)

export type MethodologyStep = typeof methodologySteps.$inferSelect;





