import { DEFAULT_SETTINGS } from './settings.js';
import { fromDateTimeInputs } from './dates.js';

export const PROGRAM_CATEGORIES = ['ministry', 'service', 'group', 'outreach'];
export const POST_KINDS = ['article', 'announcement', 'sermon', 'devotional'];
export const POST_KIND_LABELS = {
  article: 'Article',
  announcement: 'Announcement',
  sermon: 'Sermon',
  devotional: 'Devotional',
};
export const GALLERY_ALBUMS = ['general', 'worship', 'family', 'youth', 'children', 'prayer', 'outreach', 'events', 'fellowship'];

function text(formData, name, max = 4000) {
  return String(formData.get(name) ?? '').trim().slice(0, max);
}

function checked(formData, name) {
  return formData.get(name) === 'on';
}

function integer(formData, name, fallback) {
  const raw = text(formData, name, 12);
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function pick(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function need(errors, field, value, message) {
  if (!value) errors[field] = message;
}

export function parseEventForm(formData) {
  const errors = {};
  const title = text(formData, 'title', 200);
  const startsAt = fromDateTimeInputs(text(formData, 'start_date', 12), text(formData, 'start_time', 8));
  const endsAt = checked(formData, 'clear_end')
    ? null
    : fromDateTimeInputs(text(formData, 'end_date', 12), text(formData, 'end_time', 8));
  need(errors, 'title', title, 'Give the event a title.');
  need(errors, 'start_date', startsAt, 'Pick a start date.');

  return {
    errors,
    ok: !Object.keys(errors).length,
    values: {
      title,
      slug: text(formData, 'slug', 200) || title,
      summary: text(formData, 'summary', 600),
      body: text(formData, 'body', 20000),
      starts_at: startsAt,
      ends_at: endsAt,
      all_day: checked(formData, 'all_day'),
      venue: text(formData, 'venue', 200),
      cover_url: text(formData, 'cover_url', 600) || null,
      featured: checked(formData, 'featured'),
      published: checked(formData, 'published'),
    },
  };
}

export function parseProgramForm(formData) {
  const errors = {};
  const title = text(formData, 'title', 200);
  need(errors, 'title', title, 'Give the program a title.');

  return {
    errors,
    ok: !Object.keys(errors).length,
    values: {
      title,
      slug: text(formData, 'slug', 200) || title,
      summary: text(formData, 'summary', 600),
      body: text(formData, 'body', 20000),
      category: pick(text(formData, 'category', 20), PROGRAM_CATEGORIES, 'ministry'),
      icon: text(formData, 'icon', 60) || null,
      meeting_day: text(formData, 'meeting_day', 40),
      meeting_time: text(formData, 'meeting_time', 80),
      venue: text(formData, 'venue', 200),
      cover_url: text(formData, 'cover_url', 600) || null,
      featured: checked(formData, 'featured'),
      published: checked(formData, 'published'),
      sort_order: integer(formData, 'sort_order', 100),
    },
  };
}

export function parsePostForm(formData) {
  const errors = {};
  const title = text(formData, 'title', 200);
  need(errors, 'title', title, 'Give the content a title.');
  const eventRaw = text(formData, 'event_id', 12);
  const programRaw = text(formData, 'program_id', 12);

  return {
    errors,
    ok: !Object.keys(errors).length,
    values: {
      title,
      slug: text(formData, 'slug', 200) || title,
      excerpt: text(formData, 'excerpt', 600),
      body: text(formData, 'body', 60000),
      kind: pick(text(formData, 'kind', 20), POST_KINDS, 'article'),
      series: text(formData, 'series', 120) || null,
      speaker: text(formData, 'speaker', 120) || null,
      video_url: text(formData, 'video_url', 600) || null,
      event_id: eventRaw ? Number(eventRaw) || null : null,
      program_id: programRaw ? Number(programRaw) || null : null,
      cover_url: text(formData, 'cover_url', 600) || null,
      published: checked(formData, 'published'),
      published_at: text(formData, 'publish_date', 12)
        ? fromDateTimeInputs(text(formData, 'publish_date', 12), '')
        : new Date().toISOString(),
    },
  };
}

export function parseMediaForm(formData) {
  const errors = {};
  const url = text(formData, 'url', 800);
  need(errors, 'url', url, 'Add an image URL or upload a file.');

  return {
    errors,
    ok: !Object.keys(errors).length,
    values: {
      url,
      alt: text(formData, 'alt', 200),
      caption: text(formData, 'caption', 200),
      album: pick(text(formData, 'album', 30), GALLERY_ALBUMS, 'general'),
      sort_order: integer(formData, 'sort_order', 100),
    },
  };
}

export function parseSettingsForm(formData) {
  const values = {};
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (formData.has(key)) values[key] = text(formData, key, 2000);
  }
  return values;
}

export function parseMessageForm(formData) {
  const errors = {};
  const name = text(formData, 'name', 120);
  const email = text(formData, 'email', 200);
  const body = text(formData, 'body', 4000);
  need(errors, 'name', name, 'Please add your name.');
  need(errors, 'email', email, 'Please add an email we can reply to.');
  need(errors, 'body', body, 'Please write a message.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'That email looks incomplete.';

  return {
    errors,
    ok: !Object.keys(errors).length,
    values: { name, email, phone: text(formData, 'phone', 40), body },
  };
}
