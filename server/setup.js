import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { query, pool } from './db.js';
const sql = await fs.readFile(new URL('./schema.sql', import.meta.url), 'utf8');
await query(sql); console.log('CleanFlow database schema is ready.'); await pool.end();
