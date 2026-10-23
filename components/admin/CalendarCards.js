import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import {
  addDays,
  addMonths,
  dayTitle,
  monthCells,
  monthStart,
  monthTitle,
  parseKey,
  toUtc,
  weekDays,
  weekTitle,
} from '@/lib/calendar';
import { toDateInputValue } from '@/lib/dates';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const datePlate = (key) => {
  const date = toUtc(key);
  return {
    day: String(date.getUTCDate()).padStart(2, '0'),
    month: new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short' })
      .format(date)
      .toUpperCase(),
  };
};

function hrefFor(basePath, query, name, value) {
  const params = new URLSearchParams();
  for (const [key, entry] of Object.entries(query || {})) {
    if (entry) params.set(key, entry);
  }
  params.set(name, value);
  return `${basePath}?${params.toString()}`;
}

function FeedRow({ entry }) {
  const plate = datePlate(entry.key);
  const body = (
    <>
      <span className="calendar-upcoming-date">
        <strong>{plate.day}</strong>
        <em>{plate.month}</em>
      </span>
      <span className="compact-feed-text">
        <strong>{entry.title}</strong>
        {entry.meta ? <em>{entry.meta}</em> : null}
      </span>
      {entry.flag ? (
        <span className={`compact-feed-flag ${entry.state === 'new' ? 'is-new' : ''}`}>{entry.flag}</span>
      ) : null}
    </>
  );
  return entry.href ? <Link href={entry.href}>{body}</Link> : <div className="compact-feed-row">{body}</div>;
}

/* A month of dated posts or messages, small enough to sit above the list it
   summarises: the events calendar's mini month, its dots, and its dated feed. */
export function MonthCalendarCard({
  entries,
  month,
  basePath,
  query,
  kicker,
  feedTitle,
  legend,
  emptyText,
}) {
  const today = toDateInputValue(new Date());
  const anchor = monthStart(parseKey(month) ? month : today);
  const monthPrefix = anchor.slice(0, 7);
  const byDay = new Map();
  for (const entry of entries) {
    if (!byDay.has(entry.key)) byDay.set(entry.key, []);
    byDay.get(entry.key).push(entry);
  }
  const inMonth = entries.filter((entry) => entry.key.startsWith(monthPrefix));
  const feed = inMonth.slice(0, 5);
  const cells = monthCells(anchor);
  const title = monthTitle(anchor);

  return (
    <section className="compact-cal" aria-label={`${kicker}: ${title}`}>
      <header className="compact-cal-head">
        <div className="compact-cal-id">
          <p className="admin-kicker">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <div className="calendar-nav">
          <Link
            className="calendar-nav-btn"
            href={hrefFor(basePath, query, 'month', addMonths(anchor, -1))}
            aria-label="Previous month"
          >
            <MaterialIcon name="chevron_left" />
          </Link>
          <Link className="calendar-today" href={hrefFor(basePath, query, 'month', monthStart(today))}>
            This month
          </Link>
          <Link
            className="calendar-nav-btn"
            href={hrefFor(basePath, query, 'month', addMonths(anchor, 1))}
            aria-label="Next month"
          >
            <MaterialIcon name="chevron_right" />
          </Link>
        </div>
      </header>

      <div className="compact-month-wrap">
        <div className="compact-month" role="grid" aria-label={title}>
          {WEEKDAYS.map((name) => (
            <span className="compact-weekday" role="columnheader" key={name}>
              {name.slice(0, 1)}
            </span>
          ))}
          {cells.map((cell) => {
            const dayEntries = byDay.get(cell.key) || [];
            const classes = [
              'compact-day',
              cell.inMonth ? '' : 'is-outside',
              cell.key === today ? 'is-today' : '',
              dayEntries.length ? 'has-entries' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <span
                className={classes}
                role="gridcell"
                key={cell.key}
                aria-label={
                  dayEntries.length
                    ? `${dayTitle(cell.key)}, ${dayEntries.length} ${dayEntries.length === 1 ? 'entry' : 'entries'}`
                    : dayTitle(cell.key)
                }
              >
                <span>{cell.day}</span>
                {dayEntries.length ? (
                  <span className="compact-dots" aria-hidden="true">
                    {dayEntries.slice(0, 3).map((entry) => (
                      <i className={`is-${entry.state}`} key={entry.id} />
                    ))}
                  </span>
                ) : null}
              </span>
            );
          })}
        </div>
        <div className="calendar-legend">
          {legend.map((item) => (
            <span key={item.state}>
              <i className={`is-${item.state}`} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="compact-feed">
        <header className="calendar-side-head">
          <h2>{feedTitle}</h2>
          <span>{inMonth.length ? `${inMonth.length} this month` : 'None'}</span>
        </header>
        {feed.length ? (
          <>
            <ul className="compact-feed-list">
              {feed.map((entry) => (
                <li key={entry.id}>
                  <FeedRow entry={entry} />
                </li>
              ))}
            </ul>
            {inMonth.length > feed.length ? (
              <p className="compact-feed-more">+{inMonth.length - feed.length} more this month</p>
            ) : null}
          </>
        ) : (
          <p className="calendar-side-empty">{emptyText}</p>
        )}
      </div>
    </section>
  );
}

/* Programs repeat by weekday instead of by date, so their "calendar" is the
   events week strip: seven day columns with this week's real dates. */
function weekdayIndex(value) {
  const text = String(value || '').trim().toLowerCase();
  if (!text) return -1;
  const stem = text.slice(0, 3);
  return DAY_NAMES.findIndex((name) => name.toLowerCase().startsWith(stem));
}

function ProgramChip({ program }) {
  return (
    <Link
      className={`cal-chip week-chip ${program.published ? 'is-live' : 'is-draft'}`}
      href={`/admin/programs/${program.id}`}
      title={`${program.title} — ${program.published ? 'published' : 'draft'}`}
    >
      {program.meeting_time ? <span className="cal-chip-time">{program.meeting_time}</span> : null}
      <span className="cal-chip-title">{program.title}</span>
    </Link>
  );
}

export function WeekScheduleCard({ programs, week, basePath, kicker }) {
  const today = toDateInputValue(new Date());
  const anchor = parseKey(week) ? week : today;
  const days = weekDays(anchor);
  const buckets = days.map(() => []);
  const unscheduled = [];
  for (const program of programs) {
    const index = weekdayIndex(program.meeting_day);
    if (index === -1) unscheduled.push(program);
    else buckets[index].push(program);
  }
  const busy = days
    .map((key, index) => ({ key, programs: buckets[index] }))
    .filter((day) => day.programs.length);

  return (
    <section className="compact-cal week-cal" aria-label={`Weekly schedule: ${weekTitle(days)}`}>
      <header className="compact-cal-head">
        <div className="compact-cal-id">
          <p className="admin-kicker">{kicker}</p>
          <h2>{weekTitle(days)}</h2>
        </div>
        <div className="calendar-nav">
          <Link
            className="calendar-nav-btn"
            href={hrefFor(basePath, null, 'week', addDays(days[0], -7))}
            aria-label="Previous week"
          >
            <MaterialIcon name="chevron_left" />
          </Link>
          <Link className="calendar-today" href={hrefFor(basePath, null, 'week', today)}>
            This week
          </Link>
          <Link
            className="calendar-nav-btn"
            href={hrefFor(basePath, null, 'week', addDays(days[0], 7))}
            aria-label="Next week"
          >
            <MaterialIcon name="chevron_right" />
          </Link>
        </div>
      </header>

      <div className="week-strip">
        {days.map((key, index) => {
          const date = toUtc(key);
          return (
            <div className={`week-col ${key === today ? 'is-today' : ''}`} key={key}>
              <div className="week-col-head">
                <span>{WEEKDAYS[date.getUTCDay()]}</span>
                <strong>{date.getUTCDate()}</strong>
              </div>
              <div className="week-col-body">
                {buckets[index].length ? (
                  buckets[index].map((program) => <ProgramChip program={program} key={program.id} />)
                ) : (
                  <span className="week-empty" aria-hidden="true">
                    —
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="week-agenda">
        {busy.length ? (
          busy.map((day) => {
            const date = toUtc(day.key);
            return (
              <section className={`calendar-agenda-day ${day.key === today ? 'is-today' : ''}`} key={day.key}>
                <header className="calendar-agenda-date">
                  <span>{WEEKDAYS[date.getUTCDay()]}</span>
                  <strong>{date.getUTCDate()}</strong>
                </header>
                <div className="calendar-agenda-events">
                  {day.programs.map((program) => (
                    <ProgramChip program={program} key={program.id} />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <p className="week-anytime-empty">Nothing has a fixed day this week.</p>
        )}
      </div>

      {unscheduled.length ? (
        <footer className="week-anytime">
          <span className="week-anytime-label">No fixed day</span>
          <div className="week-anytime-chips">
            {unscheduled.map((program) => (
              <Link
                className={`cal-chip week-chip ${program.published ? 'is-live' : 'is-draft'}`}
                href={`/admin/programs/${program.id}`}
                key={program.id}
              >
                <span className="cal-chip-title">{program.title}</span>
              </Link>
            ))}
          </div>
        </footer>
      ) : null}

      <div className="calendar-legend">
        <span>
          <i className="is-live" />
          Published
        </span>
        <span>
          <i className="is-draft" />
          Draft
        </span>
      </div>
    </section>
  );
}
