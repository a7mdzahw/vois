import { date, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { users } from './user';

export const statuses = pgEnum('statuses', {
  confirmed: 'confirmed',
  pending: 'pending',
  cancelled: 'cancelled',
});

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').references(() => rooms.id),
  user: uuid('user_id').references(() => users.id),
  date: date('date').notNull(),
  status: statuses('status').notNull(),
  purpose: text('purpose').notNull(),
});

export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
});
