import { pgTable, text, serial, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const methodologySteps = pgTable('methodology_steps', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    order: integer('order').notNull().default(0),
    active: boolean('active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Add other CMS tables here as needed (e.g. Testimonials, FAQ)

export type MethodologyStep = typeof methodologySteps.$inferSelect;
