export const SITE_TIMEZONE = process.env.SITE_TIMEZONE || 'Africa/Accra';

const parts = (date) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: SITE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

export function toDateInputValue(value) {
  if (!value) return '';
  const map = Object.fromEntries(parts(new Date(value)).map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

export function toTimeInputValue(value) {
  if (!value) return '';
  const map = Object.fromEntries(parts(new Date(value)).map((p) => [p.type, p.value]));
  return `${map.hour === '24' ? '00' : map.hour}:${map.minute}`;
}

export function fromDateTimeInputs(dateValue, timeValue) {
  if (!dateValue) return null;
  const [year, month, day] = dateValue.split('-').map(Number);
  const [hour = 0, minute = 0] = (timeValue || '').split(':').map(Number);
  // Interpreted in the church timezone, then stored as an absolute instant.
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offsetMs = tzOffsetMs(guess, SITE_TIMEZONE);
  return new Date(guess.getTime() - offsetMs).toISOString();
}

function tzOffsetMs(instant, timeZone) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(instant).filter((p) => p.type !== 'literal').map((p) => [p.type, p.value]),
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour === '24' ? 0 : parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - instant.getTime();
}

export function formatDate(value, opts = {}) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_TIMEZONE,
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    ...opts,
  }).format(new Date(value));
}

export function formatTime(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatDayLabel(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', { timeZone: SITE_TIMEZONE, weekday: 'long' }).format(
    new Date(value),
  );
}

export function eventDateLine(event) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: SITE_TIMEZONE,
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
      .formatToParts(new Date(event.starts_at))
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );
  return `${parts.month.toUpperCase()} ${parts.day} \u2022 ${parts.year}`;
}

export function eventDateStack(event) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: SITE_TIMEZONE,
      weekday: 'short',
      month: 'short',
      day: '2-digit',
    })
      .formatToParts(new Date(event.starts_at))
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );
  return { weekday: parts.weekday, day: parts.day, month: parts.month.toUpperCase() };
}

export function eventTimeLine(event) {
  if (event.all_day) return 'All day';
  if (!event.ends_at) return formatTime(event.starts_at);
  return `${formatTime(event.starts_at)} — ${formatTime(event.ends_at)}`;
}

export function eventDateParts(event) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: SITE_TIMEZONE,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
      .formatToParts(new Date(event.starts_at))
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );
  return { month: parts.month, day: parts.day, year: parts.year };
}
