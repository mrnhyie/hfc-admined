import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import { addDays, addMonths, dayTitle, monthCells, monthTitle, parseKey, toUtc, weekDays, weekTitle } from '@/lib/calendar';
import { eventDateStack, formatTime, toDateInputValue, toTimeInputValue } from '@/lib/dates';

const VIEWS = [
  ['month', 'Month'],
  ['week', 'Week'],
  ['list', 'List'],
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_START = 7;
const DAY_END = 22;
const HOUR_HEIGHT = 44;

const minutesOf = (value) => {
  const [hour, minute] = toTimeInputValue(value).split(':').map(Number);
  return hour * 60 + minute;
};

function layoutDay(items) {
  const sorted = [...items]
    .sort((a, b) => minutesOf(a.starts_at) - minutesOf(b.starts_at))
    .map((event) => {
      const start = minutesOf(event.starts_at);
      const end = event.ends_at ? Math.max(minutesOf(event.ends_at), start + 45) : start + 60;
      return { event, start, end };
    });

  // Only genuinely overlapping events share a row; a 7 AM breakfast stays
  // full width even when the evening has two events side by side.
  const groups = [];
  let group = [];
  let groupEnd = -1;
  for (const item of sorted) {
    if (group.length && item.start >= groupEnd) {
      groups.push(group);
      group = [];
      groupEnd = -1;
    }
    group.push(item);
    groupEnd = Math.max(groupEnd, item.end);
  }
  if (group.length) groups.push(group);

  return groups.flatMap((cluster) => {
    const lanes = [];
    const placed = cluster.map((item) => {
      let lane = lanes.findIndex((lastEnd) => lastEnd <= item.start);
      if (lane === -1) {
        lane = lanes.length;
        lanes.push(0);
      }
      lanes[lane] = item.end;
      return { ...item, lane };
    });
    return placed.map((item) => ({ ...item, lanes: lanes.length }));
  });
}

function groupByDay(events) {
  const days = new Map();
  for (const event of events) {
    const key = toDateInputValue(event.starts_at);
    if (!key) continue;
    if (!days.has(key)) days.set(key, []);
    days.get(key).push(event);
  }
  for (const list of days.values()) {
    list.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
  }
  return days;
}

function viewHref(view, date) {
  return `/admin/events?view=${view}&date=${date}`;
}

function Chip({ event, className = 'cal-chip' }) {
  return (
    <Link
      className={`${className} ${event.published ? 'is-live' : 'is-draft'}`}
      href={`/admin/events/${event.id}`}
      title={`${event.title} — ${event.published ? 'published' : 'draft'}`}
    >
      <span className="cal-chip-time">{event.all_day ? 'All day' : formatTime(event.starts_at)}</span>
      <span className="cal-chip-title">{event.title}</span>
    </Link>
  );
}

function MiniMonth({ anchor, byDay, today }) {
  const cells = monthCells(anchor);
  return (
    <section className="calendar-side-card calendar-mini">
      <header className="calendar-mini-head">
        <Link href={viewHref('month', addMonths(anchor, -1))} aria-label="Previous month">
          <MaterialIcon name="chevron_left" />
        </Link>
        <span>{monthTitle(anchor)}</span>
        <Link href={viewHref('month', addMonths(anchor, 1))} aria-label="Next month">
          <MaterialIcon name="chevron_right" />
        </Link>
      </header>
      <div className="calendar-mini-grid" role="grid" aria-label={`${monthTitle(anchor)} at a glance`}>
        {WEEKDAYS.map((name) => (
          <span key={name} className="calendar-mini-weekday" role="columnheader">
            {name.slice(0, 1)}
          </span>
        ))}
        {cells.map((cell) => {
          const hasEvents = (byDay.get(cell.key) || []).length > 0;
          const classes = [
            'calendar-mini-day',
            cell.inMonth ? '' : 'is-outside',
            cell.key === today ? 'is-today' : '',
            hasEvents ? 'has-events' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <Link className={classes} key={cell.key} href={viewHref('week', cell.key)} aria-label={dayTitle(cell.key)}>
              <span>{cell.day}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ComingUp({ events }) {
  const now = Date.now();
  const next = events
    .filter((event) => new Date(event.starts_at).getTime() >= now)
    .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
    .slice(0, 4);

  return (
    <section className="calendar-side-card calendar-upcoming">
      <header className="calendar-side-head">
        <h2>Coming up</h2>
        <span>{next.length ? `${next.length} next` : 'None'}</span>
      </header>
      {next.length ? (
        <ul>
          {next.map((event) => {
            const date = eventDateStack(event);
            return (
              <li key={event.id}>
                <Link href={`/admin/events/${event.id}`}>
                  <span className="calendar-upcoming-date">
                    <strong>{date.day}</strong>
                    <em>{date.month}</em>
                  </span>
                  <span className="calendar-upcoming-text">
                    <strong>{event.title}</strong>
                    <em>{event.all_day ? 'All day' : formatTime(event.starts_at)}{event.venue ? ` · ${event.venue}` : ''}</em>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="calendar-side-empty">Nothing scheduled yet. Add an event to see it here.</p>
      )}
      <div className="calendar-legend">
        <span><i className="is-live" />Published</span>
        <span><i className="is-draft" />Draft</span>
      </div>
    </section>
  );
}

function MonthView({ anchor, byDay, today }) {
  const cells = monthCells(anchor);
  const weeks = [];
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));

  return (
    <div className="calendar-month" role="grid" aria-label={`${monthTitle(anchor)} calendar`}>
      <div className="calendar-weekdays" role="row">
        {WEEKDAYS.map((name) => (
          <span key={name} role="columnheader">
            <span className="calendar-weekday-full">{name}</span>
            <span className="calendar-weekday-short">{name.slice(0, 2)}</span>
          </span>
        ))}
      </div>
      {weeks.map((week) => (
        <div className="calendar-week" role="row" key={week[0].key}>
          {week.map((cell) => {
            const events = byDay.get(cell.key) || [];
            const classes = [
              'calendar-cell',
              cell.inMonth ? '' : 'is-outside',
              cell.key === today ? 'is-today' : '',
              events.length ? 'has-events' : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <div className={classes} role="gridcell" key={cell.key} aria-label={dayTitle(cell.key)}>
                <div className="calendar-cell-top">
                  <Link className="calendar-date" href={viewHref('week', cell.key)} aria-label={`Open week of ${dayTitle(cell.key)}`}>
                    {cell.day}
                  </Link>
                  {cell.key === today ? <span className="calendar-today-tag">Today</span> : null}
                </div>
                <div className="calendar-cell-events">
                  {events.slice(0, 3).map((event) => (
                    <Chip event={event} key={event.id} />
                  ))}
                  {events.length > 3 ? (
                    <Link className="calendar-more" href={viewHref('week', cell.key)}>
                      +{events.length - 3} more
                    </Link>
                  ) : null}
                </div>
                <div className="calendar-dots" aria-hidden="true">
                  {events.slice(0, 4).map((event, index) => (
                    <i className={event.published ? 'is-live' : 'is-draft'} key={`${event.id}-${index}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function WeekView({ anchor, byDay, today }) {
  const days = weekDays(anchor);
  const weekEvents = days.flatMap((key) => byDay.get(key) || []);
  const timed = weekEvents.filter((event) => !event.all_day);
  const firstStart = timed.length ? Math.min(...timed.map((event) => minutesOf(event.starts_at))) : DAY_START * 60;
  const lastEnd = timed.length
    ? Math.max(...timed.map((event) => Math.max(minutesOf(event.starts_at) + 60, event.ends_at ? minutesOf(event.ends_at) : 0)))
    : DAY_END * 60;
  // A vigil or a sunrise service widens the grid instead of drawing off it.
  const startHour = Math.max(0, Math.min(DAY_START, Math.floor(firstStart / 60)));
  const endHour = Math.min(24, Math.max(DAY_END, Math.ceil(lastEnd / 60)));
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, index) => startHour + index);
  const allDay = days.some((key) => (byDay.get(key) || []).some((event) => event.all_day));

  return (
    <div className="calendar-week-view">
      <div className="calendar-week-head">
        <div className="calendar-week-gutter" aria-hidden="true" />
        {days.map((key) => {
          const date = toUtc(key);
          const isToday = key === today;
          return (
            <Link
              className={`calendar-day-tile ${isToday ? 'is-today' : ''}`}
              href={viewHref('week', key)}
              key={key}
              aria-label={dayTitle(key)}
            >
              <span>{WEEKDAYS[date.getUTCDay()]}</span>
              <strong>{date.getUTCDate()}</strong>
            </Link>
          );
        })}
      </div>

      {allDay ? (
        <div className="calendar-allday">
          <div className="calendar-allday-label">All day</div>
          {days.map((key) => (
            <div className="calendar-allday-cell" key={key}>
              {(byDay.get(key) || []).filter((event) => event.all_day).map((event) => <Chip event={event} key={event.id} />)}
            </div>
          ))}
        </div>
      ) : null}

      <div className="calendar-week-agenda">
        {days.map((key) => {
          const date = toUtc(key);
          const list = byDay.get(key) || [];
          return (
            <section className={`calendar-agenda-day ${key === today ? 'is-today' : ''}`} key={key}>
              <header className="calendar-agenda-date">
                <span>{WEEKDAYS[date.getUTCDay()]}</span>
                <strong>{date.getUTCDate()}</strong>
              </header>
              {list.length ? (
                <div className="calendar-agenda-events">
                  {list.map((event) => (
                    <Chip event={event} className="cal-chip calendar-agenda-chip" key={event.id} />
                  ))}
                </div>
              ) : (
                <p className="calendar-agenda-empty">No events</p>
              )}
            </section>
          );
        })}
      </div>

      <div className="calendar-week-scroll">
        <div className="calendar-week-body" style={{ height: `${(endHour - startHour) * HOUR_HEIGHT}px` }}>
          <div className="calendar-times" aria-hidden="true">
            {hours.map((hour) => (
              <span key={hour} style={{ top: `${(hour - startHour) * HOUR_HEIGHT}px` }}>
                {new Intl.DateTimeFormat('en-US', { hour: 'numeric' }).format(new Date(Date.UTC(2020, 0, 1, hour)))}
              </span>
            ))}
          </div>
          {days.map((key) => {
            const timedEvents = (byDay.get(key) || []).filter((event) => !event.all_day);
            return (
              <div className={`calendar-day-col ${key === today ? 'is-today' : ''}`} key={key}>
                {layoutDay(timedEvents).map(({ event, start, end, lane, lanes }) => {
                  const top = ((Math.max(start, startHour * 60) - startHour * 60) / 60) * HOUR_HEIGHT;
                  const bottom = ((Math.min(end, endHour * 60) - startHour * 60) / 60) * HOUR_HEIGHT;
                  const height = Math.max(bottom - top, 26);
                  const width = 100 / lanes;
                  return (
                    <Link
                      className={`calendar-event ${event.published ? 'is-live' : 'is-draft'}`}
                      href={`/admin/events/${event.id}`}
                      key={event.id}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: `calc(${lane * width}% + 4px)`,
                        width: `calc(${width}% - 8px)`,
                      }}
                      title={`${event.title} — ${formatTime(event.starts_at)}`}
                    >
                      <strong>{event.title}</strong>
                      <span>{formatTime(event.starts_at)}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function EventsCalendar({ events, view, date, list }) {
  const today = toDateInputValue(new Date());
  const anchor = parseKey(date) ? date : today;
  const byDay = groupByDay(events);
  const isList = view === 'list';

  const prev = view === 'week' ? addDays(anchor, -7) : addMonths(anchor, -1);
  const next = view === 'week' ? addDays(anchor, 7) : addMonths(anchor, 1);
  const title = isList ? 'All events' : view === 'week' ? weekTitle(weekDays(anchor)) : monthTitle(anchor);

  return (
    <div className="calendar-board">
      <div className="calendar-main">
        <section className="calendar-sheet">
          <header className={`calendar-toolbar${isList ? ' is-list' : ''}`}>
            {isList ? null : (
              <div className="calendar-nav">
                <Link className="calendar-nav-btn" href={viewHref(view, prev)} aria-label={view === 'week' ? 'Previous week' : 'Previous month'}>
                  <MaterialIcon name="chevron_left" />
                </Link>
                <Link className="calendar-today" href={viewHref(view, today)}>
                  Today
                </Link>
                <Link className="calendar-nav-btn" href={viewHref(view, next)} aria-label={view === 'week' ? 'Next week' : 'Next month'}>
                  <MaterialIcon name="chevron_right" />
                </Link>
              </div>
            )}
            <h2 className="calendar-title">{title}</h2>
            <div className="calendar-views" role="group" aria-label="Calendar view">
              {VIEWS.map(([value, label]) => (
                <Link
                  key={value}
                  className={value === view ? 'is-active' : ''}
                  href={viewHref(value, anchor)}
                  aria-current={value === view ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>
          </header>

          {view === 'month' ? <MonthView anchor={anchor} byDay={byDay} today={today} /> : null}
          {view === 'week' ? <WeekView anchor={anchor} byDay={byDay} today={today} /> : null}
        </section>

        {isList ? list : null}
      </div>

      {isList ? null : (
        <aside className="calendar-side">
          <MiniMonth anchor={anchor} byDay={byDay} today={today} />
          <ComingUp events={events} />
        </aside>
      )}
    </div>
  );
}
