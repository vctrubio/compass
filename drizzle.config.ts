import type { Config } from 'drizzle-kit';

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    // Replace these with your actual database credentials
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/northcompass',
  },
} satisfies Config;
