import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: varchar('clerk_id').notNull(),
  imageUrl: text('image_url'),
  name: text('name'),
  email: text('email'),
});
