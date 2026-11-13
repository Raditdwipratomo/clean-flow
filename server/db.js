import pg from 'pg';
import 'dotenv/config';
const { Pool } = pg;
const isRemoteDb = Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1'));
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined
});
export const query = (text, params) => pool.query(text, params);
