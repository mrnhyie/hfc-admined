import fs from 'node:fs';
import { exec, pool } from '../lib/db.js';

const sql = fs.readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8');

await exec(sql);
console.log('Schema applied.');
await pool.end();
