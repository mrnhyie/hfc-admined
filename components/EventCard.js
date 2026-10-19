import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import { eventDateLine, eventDateStack, eventTimeLine } from '@/lib/dates';

export default function EventCard({ event, variant = 'archive' }) {
  const href = `/events/${event.slug}`;

  if (variant === 'row') {
    const date = eventDateStack(event);
    /* When the event has its own photograph the numeral is filled with it, so
       the date carries the picture instead of sitting next to it. */
    const fill = event.cover_url
      ? { className: 'event-day event-day-fill', style: { backgroundImage: `url(${event.cover_url})` } }
      : { className: 'event-day' };
    return (
      <Link className="event-row" href={href}>
        <div className="event-date">
          <strong {...fill}>{date.day}</strong>
          <span>
            {date.month} · {date.weekday}
          </span>
        </div>
        <div>
          <h3>{event.title}</h3>
          <p>{[eventTimeLine(event), event.venue].filter(Boolean).join(' · ')}</p>
        </div>
        <span className="event-arrow" aria-hidden="true">
          <MaterialIcon name="arrow_outward" />
        </span>
      </Link>
    );
  }

  return (
    <article className="archive-card">
      {event.cover_url ? (
        <img src={event.cover_url} alt="" loading="lazy" />
      ) : (
        <div className="archive-cover">{event.title}</div>
      )}
      <div className="archive-date">
        {eventDateLine(event)} · {eventTimeLine(event)}
      </div>
      <h3>
        <Link href={href}>{event.title}</Link>
      </h3>
      <p>{event.summary || 'Join us for this gathering.'}</p>
      <Link className="link-inline" href={href}>
        Event details
        <MaterialIcon name="arrow_forward" />
      </Link>
    </article>
  );
}
