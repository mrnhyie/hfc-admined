import { query, queryOne } from './db.js';
import { DEFAULT_SETTINGS } from './settings.js';

const EVENT_COLUMNS = [
  'title', 'slug', 'summary', 'body', 'starts_at', 'ends_at', 'all_day',
  'venue', 'cover_url', 'featured', 'published',
];
const PROGRAM_COLUMNS = [
  'title', 'slug', 'summary', 'body', 'category', 'icon', 'meeting_day',
  'meeting_time', 'venue', 'cover_url', 'featured', 'published', 'sort_order',
];
const POST_COLUMNS = [
  'title', 'slug', 'excerpt', 'body', 'kind', 'series', 'speaker', 'video_url',
  'event_id', 'program_id', 'cover_url', 'published', 'published_at',
];
const MEDIA_COLUMNS = ['url', 'alt', 'caption', 'album', 'sort_order'];

// Table names are module constants, never caller input; only the listed
// columns may be written.
function crud(table, columns) {
  const placeholders = (offset, cols) =>
    cols.map((_, index) => `$${offset + index}`).join(', ');

  return {
    async create(data) {
      const cols = columns.filter((name) => data[name] !== undefined);
      if (!cols.length) throw new Error(`Nothing to insert into ${table}`);
      const row = await queryOne(
        `insert into ${table} (${cols.join(', ')}) values (${placeholders(1, cols)}) returning *`,
        cols.map((name) => data[name]),
      );
      return row;
    },

    async update(id, data) {
      const cols = columns.filter((name) => data[name] !== undefined);
      if (!cols.length) return queryOne(`select * from ${table} where id = $1`, [id]);
      const sets = cols.map((name, index) => `${name} = $${index + 1}`).join(', ');
      return queryOne(
        `update ${table} set ${sets} where id = $${cols.length + 1} returning *`,
        [...cols.map((name) => data[name]), id],
      );
    },

    async remove(id) {
      await query(`delete from ${table} where id = $1`, [id]);
    },
  };
}

export const eventsCrud = crud('events', EVENT_COLUMNS);
export const programsCrud = crud('programs', PROGRAM_COLUMNS);
export const postsCrud = crud('posts', POST_COLUMNS);
export const mediaCrud = crud('media', MEDIA_COLUMNS);

const EVENT_FIELDS =
  'id::int as id, title, slug, summary, body, starts_at, ends_at, all_day, venue, cover_url, featured, published';
const PROGRAM_FIELDS =
  'id::int as id, title, slug, summary, body, category, icon, meeting_day, meeting_time, venue, cover_url, featured, published, sort_order';
const POST_FIELDS =
  'id::int as id, title, slug, excerpt, body, kind, series, speaker, video_url, event_id::int as event_id, program_id::int as program_id, cover_url, published, published_at';

export async function getSettings() {
  const rows = await query('select key, value from settings');
  const stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function getUpcomingEvents(limit = 3) {
  return query(
    `select ${EVENT_FIELDS} from events
      where published = true and coalesce(ends_at, starts_at) >= now() - interval '12 hours'
      order by starts_at asc limit $1`,
    [limit],
  );
}

export async function getPastEvents(limit = 20) {
  return query(
    `select ${EVENT_FIELDS} from events
      where published = true and coalesce(ends_at, starts_at) < now() - interval '12 hours'
      order by starts_at desc limit $1`,
    [limit],
  );
}

export async function getEventBySlug(slug, { includeUnpublished = false } = {}) {
  return queryOne(
    `select ${EVENT_FIELDS}, created_at, updated_at from events
      where slug = $1 ${includeUnpublished ? '' : 'and published = true'}`,
    [slug],
  );
}

export async function getPrograms({ scheduleOnly = false, limit } = {}) {
  const where = ['published = true'];
  if (scheduleOnly) where.push("meeting_day is not null and meeting_day <> ''");
  const sql = `select ${PROGRAM_FIELDS} from programs where ${where.join(' and ')}
    order by sort_order asc, title asc${limit ? ` limit ${Number(limit)}` : ''}`;
  return query(sql);
}

export async function getProgramBySlug(slug, { includeUnpublished = false } = {}) {
  return queryOne(
    `select ${PROGRAM_FIELDS} from programs
      where slug = $1 ${includeUnpublished ? '' : 'and published = true'}`,
    [slug],
  );
}

export async function getPosts({ limit = 12, kind, series, eventId, programId, includeUnpublished = false } = {}) {
  const where = [];
  const params = [];
  if (!includeUnpublished) where.push('published = true');
  if (kind) {
    params.push(kind);
    where.push(`kind = $${params.length}`);
  }
  if (series) {
    params.push(series);
    where.push(`series = $${params.length}`);
  }
  if (eventId) {
    params.push(eventId);
    where.push(`event_id = $${params.length}`);
  }
  if (programId) {
    params.push(programId);
    where.push(`program_id = $${params.length}`);
  }
  params.push(Number(limit));
  const clause = where.length ? `where ${where.join(' and ')}` : '';
  return query(
    `select ${POST_FIELDS} from posts ${clause} order by published_at desc limit $${params.length}`,
    params,
  );
}

export async function getSeries() {
  return query(
    `select series, count(*)::int as posts from posts
      where published = true and series is not null and series <> ''
      group by series order by series asc`,
  );
}

// Every figure in the fact grid is counted from published rows, never typed in.
export async function getFactCounts() {
  const rows = await query(`
    select 'Weekly services' as label, count(*)::int as value from programs
      where published = true and coalesce(meeting_day, '') <> ''
    union all
    select 'Ministries', count(*)::int from programs
      where published = true and coalesce(meeting_day, '') = ''
    union all
    select 'Upcoming events', count(*)::int from events
      where published = true and coalesce(ends_at, starts_at) >= now() - interval '12 hours'
    union all
    select 'Sermons online', count(*)::int from posts
      where published = true and kind = 'sermon'
  `);
  return rows.filter((row) => row.value > 0);
}

export async function getSpeakers({ limit = 6 } = {}) {
  return query(
    `select p.speaker,
            count(*)::int as sermons,
            max(p.published_at) as latest,
            (array_agg(p.title order by p.published_at desc))[1] as latest_title,
            (array_agg(p.slug  order by p.published_at desc))[1] as latest_slug,
            (array_agg(p.cover_url order by p.published_at desc) filter (where coalesce(p.cover_url, '') <> ''))[1] as cover_url
       from posts p
      where p.published = true and p.kind = 'sermon' and coalesce(p.speaker, '') <> ''
      group by p.speaker
      order by count(*)::int desc, max(p.published_at) desc
      limit ${Number(limit)}`,
  );
}

export async function getPostBySlug(slug, { includeUnpublished = false } = {}) {
  return queryOne(
    `select p.id::int as id, p.title, p.slug, p.excerpt, p.body, p.kind, p.series, p.speaker, p.video_url,
            p.event_id::int as event_id, p.program_id::int as program_id,
            p.cover_url, p.published, p.published_at,
            e.title as event_title, e.slug as event_slug, e.starts_at as event_starts_at,
            g.title as program_title, g.slug as program_slug
       from posts p
       left join events e on e.id = p.event_id
       left join programs g on g.id = p.program_id
      where p.slug = $1 ${includeUnpublished ? '' : 'and p.published = true'}`,
    [slug],
  );
}

export async function getMedia({ album, limit = 24 } = {}) {
  const where = [];
  const params = [];
  if (album) {
    params.push(album);
    where.push(`album = $${params.length}`);
  }
  params.push(Number(limit));
  return query(
    `select id::int as id, url, alt, caption, album, sort_order from media
      ${where.length ? `where ${where.join(' and ')}` : ''}
     order by sort_order asc, created_at desc limit $${params.length}`,
    params,
  );
}

export async function getAlbums() {
  return query(
    `select album, count(*)::int as items from media
      group by album order by album asc`,
  );
}

export async function listEventsAdmin() {
  return query(`select ${EVENT_FIELDS}, created_at from events order by starts_at desc`);
}

export async function listProgramsAdmin() {
  return query(`select ${PROGRAM_FIELDS} from programs order by sort_order asc, title asc`);
}

export async function listPostsAdmin() {
  return query(
    `select p.id::int as id, p.title, p.slug, p.excerpt, p.kind, p.series, p.speaker, p.published, p.published_at,
            p.event_id::int as event_id, p.program_id::int as program_id,
            e.title as event_title, g.title as program_title
       from posts p
       left join events e on e.id = p.event_id
       left join programs g on g.id = p.program_id
      order by p.published_at desc`,
  );
}

export async function listMediaAdmin() {
  return query('select id::int as id, url, alt, caption, album, sort_order, created_at from media order by created_at desc');
}

export async function getEventById(id) {
  return queryOne(`select ${EVENT_FIELDS} from events where id = $1`, [id]);
}

export async function getProgramById(id) {
  return queryOne(`select ${PROGRAM_FIELDS} from programs where id = $1`, [id]);
}

export async function getPostById(id) {
  return queryOne(`select ${POST_FIELDS} from posts where id = $1`, [id]);
}

export async function listMessages({ status } = {}) {
  const params = [];
  let clause = '';
  if (status) {
    params.push(status);
    clause = `where status = $1`;
  }
  return query(
    `select id::int as id, name, email, phone, body, status, created_at from messages
      ${clause} order by created_at desc limit 200`,
    params,
  );
}

export async function getMessageCounts() {
  return queryOne(
    `select count(*) filter (where status = 'new')::int as new_count,
            count(*)::int as total from messages`,
  );
}

export async function createMessage({ name, email, phone, body }) {
  return queryOne(
    'insert into messages (name, email, phone, body) values ($1, $2, $3, $4) returning id::int as id',
    [name, email, phone || '', body],
  );
}

export async function setMessageStatus(id, status) {
  return queryOne('update messages set status = $2 where id = $1 returning id::int as id', [id, status]);
}

export async function setSettings(values) {
  const entries = Object.entries(values).filter(([key]) => key in DEFAULT_SETTINGS);
  for (const [key, value] of entries) {
    await query(
      `insert into settings (key, value) values ($1, $2::jsonb)
       on conflict (key) do update set value = excluded.value`,
      [key, JSON.stringify(value)],
    );
  }
}

export async function getAdminByEmail(email) {
  return queryOne('select id::int as id, email, name, password_hash from admins where email = $1', [
    email.toLowerCase(),
  ]);
}

export async function listAdmins() {
  return query('select id::int as id, email, name, created_at from admins order by created_at');
}

export async function getAdminCounts() {
  return queryOne(
    `select
       (select count(*) from events)::int as events,
       (select count(*) from events where coalesce(ends_at, starts_at) >= now())::int as upcoming_events,
       (select count(*) from programs)::int as programs,
       (select count(*) from posts)::int as posts,
       (select count(*) from media)::int as media,
       (select count(*) from messages where status = 'new')::int as new_messages,
       (select count(*) from admins)::int as admins`,
  );
}

export async function getEventForEdit(id) {
  return queryOne('select id::int as id, title, slug, summary, body, starts_at, ends_at, all_day, venue, cover_url, featured, published from events where id = $1', [id]);
}

export async function getProgramForEdit(id) {
  return queryOne('select id::int as id, title, slug, summary, body, category, icon, meeting_day, meeting_time, venue, cover_url, featured, published, sort_order from programs where id = $1', [id]);
}

export async function getPostForEdit(id) {
  return queryOne(`select ${POST_FIELDS} from posts where id = $1`, [id]);
}

export async function getMediaForEdit(id) {
  return queryOne('select id::int as id, url, alt, caption, album, sort_order from media where id = $1', [id]);
}
