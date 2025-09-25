import 'dotenv/config';

import { drizzle } from 'drizzle-orm/neon-serverless';

export const db = drizzle({ connection: process.env.DATABASE_URL ?? '' });
export type DBTransactionType = Parameters<Parameters<typeof db.transaction>[0]>[0];
