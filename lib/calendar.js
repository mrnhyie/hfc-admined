/* Calendar date math runs on YYYY-MM-DD keys in UTC, so the server's local
   timezone never shifts a cell into the wrong day. */

const WEEKDAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const pad = (value) => String(value).padStart(2, '0');

export const keyOf = ({ y, m, d }) => `${y}-${pad(m)}-${pad(d)}`;

export function parseKey(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) return null;
  return { y, m, d };
}

export const toUtc = (key) => {
  const part = parseKey(key);
  return new Date(Date.UTC(part.y, part.m - 1, part.d));
};

export function addDays(key, amount) {
  const date = toUtc(key);
  date.setUTCDate(date.getUTCDate() + amount);
  return keyOf({ y: date.getUTCFullYear(), m: date.getUTCMonth() + 1, d: date.getUTCDate() });
}

export function addMonths(key, amount) {
  const part = parseKey(key);
  const date = new Date(Date.UTC(part.y, part.m - 1 + amount, 1));
  return keyOf({ y: date.getUTCFullYear(), m: date.getUTCMonth() + 1, d: date.getUTCDate() });
}

export const monthTitle = (key) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(toUtc(key));

export const dayTitle = (key) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric' }).format(
    toUtc(key),
  );

export function weekTitle(days) {
  const start = toUtc(days[0]);
  const end = toUtc(days[days.length - 1]);
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  const startLabel = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  }).format(start);
  const endLabel = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    ...(sameMonth ? {} : { month: 'short' }),
    day: 'numeric',
    year: 'numeric',
  }).format(end);
  return `${startLabel} – ${endLabel}`;
}

export function monthCells(anchor) {
  const part = parseKey(anchor);
  const first = new Date(Date.UTC(part.y, part.m - 1, 1));
  const offset = first.getUTCDay();
  const total = Math.ceil((offset + new Date(Date.UTC(part.y, part.m, 0)).getUTCDate()) / 7) * 7;
  return Array.from({ length: total }, (_, index) => {
    const date = new Date(Date.UTC(part.y, part.m - 1, 1 - offset + index));
    return {
      key: keyOf({ y: date.getUTCFullYear(), m: date.getUTCMonth() + 1, d: date.getUTCDate() }),
      day: date.getUTCDate(),
      inMonth: date.getUTCMonth() === part.m - 1,
    };
  });
}

export function weekDays(anchor) {
  const start = addDays(anchor, -toUtc(anchor).getUTCDay());
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export const monthStart = (key) => {
  const part = parseKey(key);
  return part ? keyOf({ y: part.y, m: part.m, d: 1 }) : '';
};

export const weekdayLabel = (key) => WEEKDAY_LONG[toUtc(key).getUTCDay()];
