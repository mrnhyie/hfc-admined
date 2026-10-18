import { queryOne } from './db.js';

const SLUG_TABLES = new Set(['events', 'programs', 'posts']);

export function slugify(input) {
  const slug = (input || '')
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return slug || 'untitled';
}

export async function uniqueSlug(table, candidate, { ignoreId } = {}) {
  if (!SLUG_TABLES.has(table)) throw new Error(`Unsupported table ${table}`);
  const base = slugify(candidate);
  let attempt = base;
  for (let suffix = 2; suffix <= 50; suffix += 1) {
    const clash = await queryOne(
      `select id::int as id from ${table} where slug = $1 and ($2::int is null or id <> $2)`,
      [attempt, ignoreId ?? null],
    );
    if (!clash) return attempt;
    attempt = `${base}-${suffix}`;
  }
  return `${base}-${Date.now()}`;
}
