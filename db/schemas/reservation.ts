import { timestamp, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { users } from './user';
import { rooms } from './room';

export const statuses = pgEnum('statuses', {
  confirmed: 'confirmed',
  pending: 'pending',
  cancelled: 'cancelled',
});

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  roomId: uuid('room_id').references(() => rooms.id),
  userId: uuid('user_id').references(() => users.id),
  date: timestamp('date', { withTimezone: true }).notNull(),
  status: statuses('status').notNull(),
  purpose: text('purpose').notNull(),
});
