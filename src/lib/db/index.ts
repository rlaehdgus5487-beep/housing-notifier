import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Vercel Postgres 또는 Supabase 연결용 URL
// 배포 시 Vercel 환경변수에 DATABASE_URL이 설정되어 있어야 합니다.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });