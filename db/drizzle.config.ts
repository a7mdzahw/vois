import type { Config } from 'drizzle-kit';
import 'dotenv/config';

console.log(process.env.DATABASE_URL);

export default {
  schema: 'db/schemas/**/*.ts',
  out: 'db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  casing: 'camelCase',
} satisfies Config;
