import pg from 'pg';
import 'dotenv/config';
const { Pool } = pg;

const dbUrl = process.env.DATABASE_URL;
const isRemoteDb = Boolean(dbUrl && !dbUrl.includes('localhost') && !dbUrl.includes('127.0.0.1'));

export const pool = new Pool({
  connectionString: dbUrl,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 20000,
  max: 10
});

export const query = async (text, params) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set. Please add it to your Vercel Project Settings.');
  }
  return pool.query(text, params);
};
