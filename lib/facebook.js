import { formatDate, formatTime } from './dates.js';
import { getStoredFacebookPosts } from './queries.js';

const GRAPH = 'https://graph.facebook.com/v21.0';
const FIELDS = [
  'id',
  'message',
  'created_time',
  'permalink_url',
  'full_picture',
  'attachments{media_type,type,title,url}',
  'reactions.summary(true).limit(0)',
  'comments.summary(true).limit(0)',
].join(',');

export function facebookConfigured() {
  return Boolean(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_TOKEN);
}

function toPost(raw) {
  const attachment = raw.attachments?.data?.[0] || null;
  const video =
    raw.media_type === 'video' ||
    attachment?.media_type === 'video' ||
    attachment?.type === 'video_inline';

  return {
    id: raw.id,
    message: (raw.message || '').trim(),
    created: raw.created_time,
    href: raw.permalink_url || `https://www.facebook.com/${raw.id}`,
    image: raw.full_picture || null,
    imageAlt: attachment?.title || '',
    title: attachment?.title || '',
    video,
    reactions: raw.reactions?.summary?.total_count ?? null,
    comments: raw.comments?.summary?.total_count ?? null,
  };
}

/* The Graph API needs a page token; without one the church's own entries in
   /admin/facebook are used instead. Returns null when neither has anything. */
export async function getFacebookFeed(limit = 9) {
  const graph = await getGraphPosts(limit);
  if (graph?.length) return { posts: graph, source: 'graph' };

  const stored = await getStoredFacebookPosts(limit);
  return { posts: stored.map(fromStored), source: stored.length ? 'manual' : null };
}

async function getGraphPosts(limit) {
  if (!facebookConfigured()) return null;

  const url = new URL(`${GRAPH}/${process.env.FACEBOOK_PAGE_ID}/posts`);
  url.searchParams.set('fields', FIELDS);
  url.searchParams.set('limit', String(limit));

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.FACEBOOK_PAGE_TOKEN}`,
        Accept: 'application/json',
      },
      next: { revalidate: 900, tags: ['facebook'] },
    });
    if (!response.ok) {
      console.warn(`[facebook] Graph API returned ${response.status}; using saved posts`);
      return null;
    }

    const payload = await response.json();
    const posts = (payload.data || []).map(toPost).filter((post) => post.image || post.message);
    return posts.length ? posts : null;
  } catch {
    return null;
  }
}

function fromStored(row) {
  return {
    id: `stored-${row.id}`,
    message: row.caption || '',
    created: row.posted_at,
    href: row.post_url || null,
    image: row.image_url || null,
    imageAlt: row.image_alt || '',
    title: '',
    video: false,
    reactions: row.reactions,
    comments: row.comments,
  };
}

/* Facebook's own timestamp reads "May 19 at 11:15 AM". */
export function facebookDateLine(value) {
  if (!value) return '';
  const day = formatDate(value, { month: 'short', day: 'numeric', year: undefined });
  return `${day} at ${formatTime(value)}`;
}
