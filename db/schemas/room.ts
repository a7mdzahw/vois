import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';

export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  icon: text('icon'),
  capacity: integer('capacity'),
});
