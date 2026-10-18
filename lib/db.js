import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.');
}

const isLocal = /@(localhost|127\.0\.0\.1)/.test(databaseUrl);

// One pooled client per serverless container; Neon/Vercel Postgres pooled
// endpoints keep the connection count low across invocations.
export const pool = new Pool({
  connectionString: databaseUrl,
  max: Number(process.env.PG_POOL_MAX || 3),
  idleTimeoutMillis: 10000,
  ssl: isLocal ? undefined : { rejectUnauthorized: process.env.PGSSL_NO_VERIFY !== '1' },
});

export async function query(text, params = []) {
  const res = await pool.query(text, params);
  return res.rows;
}

export async function queryOne(text, params = []) {
  const rows = await query(text, params);
  return rows[0] || null;
}

export async function exec(text, params = []) {
  await pool.query(text, params);
}
