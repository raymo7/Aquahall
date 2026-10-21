import { neon } from '@neondatabase/serverless';

async function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  const sql = neon(process.env.DATABASE_URL);
  await sql`CREATE TABLE IF NOT EXISTS site_settings (id text PRIMARY KEY, paused boolean NOT NULL DEFAULT false, updated_at timestamptz NOT NULL DEFAULT now())`;
  return sql;
}

export async function isServicePaused() {
  const sql = await db();
  const rows = await sql`SELECT paused FROM site_settings WHERE id = 'service'`;
  return rows[0]?.paused === true;
}

export async function setServicePaused(paused) {
  const sql = await db();
  const rows = await sql`INSERT INTO site_settings (id, paused) VALUES ('service', ${paused}) ON CONFLICT (id) DO UPDATE SET paused = EXCLUDED.paused, updated_at = now() RETURNING paused`;
  return rows[0].paused;
}
