import bcrypt from 'bcryptjs';
import { pool, queryOne } from '../lib/db.js';

const [emailArg, passwordArg, nameArg] = process.argv.slice(2);
const email = emailArg || process.env.ADMIN_EMAIL;
const password = passwordArg || process.env.ADMIN_PASSWORD;
const name = nameArg || process.env.ADMIN_NAME || 'Church Admin';

if (!email || !password) {
  console.error('Usage: npm run admin:create -- <email> <password> [name]');
  console.error('   or: set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local and run npm run admin:create');
  await pool.end();
  process.exit(1);
}

if (password.length < 10) {
  console.error('Password must be at least 10 characters.');
  await pool.end();
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
const admin = await queryOne(
  `insert into admins (email, name, password_hash) values ($1, $2, $3)
   on conflict (email) do update set name = excluded.name, password_hash = excluded.password_hash
   returning id::int as id, email`,
  [email.toLowerCase(), name, hash],
);

console.log(`Admin ready: ${admin.email} (id ${admin.id})`);
await pool.end();
