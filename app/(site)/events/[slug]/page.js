import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentCard from '@/components/ContentCard';
import MaterialIcon from '@/components/MaterialIcon';
import PageHead from '@/components/PageHead';
import { eventDateLine, eventTimeLine, formatDate } from '@/lib/dates';
import { renderMarkdown } from '@/lib/markdown';
import { getEventBySlug, getPosts } from '@/lib/queries';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return { title: event ? event.title : 'Event' };
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const posts = await getPosts({ eventId: event.id, limit: 6 });

  const rows = [
    <div className="detail" key="date">
      <MaterialIcon name="calendar_today" />
      <div>
        <strong>Date</strong>
        <p>{formatDate(event.starts_at, { weekday: 'long' })}</p>
      </div>
    </div>,
    <div className="detail" key="time">
      <MaterialIcon name="schedule" />
      <div>
        <strong>Time</strong>
        <p>{eventTimeLine(event)}</p>
      </div>
    </div>,
  ];

  if (event.ends_at) {
    rows.push(
      <div className="detail" key="ends">
        <MaterialIcon name="schedule" />
        <div>
          <strong>Ends</strong>
          <p>
            {formatDate(event.ends_at, { weekday: 'long' })},{' '}
            {eventTimeLine({ ...event, starts_at: event.ends_at })}
          </p>
        </div>
      </div>,
    );
  }

  if (event.venue) {
    rows.push(
      <div className="detail" key="venue">
        <MaterialIcon name="place" />
        <div>
          <strong>Venue</strong>
          <p>{event.venue}</p>
        </div>
      </div>,
    );
  }

  return (
    <main>
      <PageHead
        label={eventDateLine(event)}
        title={event.title}
        body={event.summary}
        crumbs={[{ href: '/events', label: 'Events' }]}
      />

      <section className="section">
        <div className="container">
          {event.cover_url ? (
            <div className="simple-grid">
              <img src={event.cover_url} alt="" loading="lazy" />
              <div className="detail-grid">{rows}</div>
            </div>
          ) : (
            <div className="detail-grid">{rows}</div>
          )}

          {event.body ? (
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(event.body) }}
            />
          ) : null}

          <div className="hero-actions">
            <Link className="btn btn-line" href="/contact">
              Ask about this event
              <MaterialIcon name="mail" />
            </Link>
          </div>
        </div>
      </section>

      {posts.length ? (
        <section className="section section-ivory">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-label">From this event</div>
                <h2 className="section-title">Notes &amp; teaching</h2>
              </div>
              <Link className="section-link" href="/content">
                All content
                <MaterialIcon name="arrow_forward" />
              </Link>
            </div>
            <div className="archive-list">
              {posts.map((post) => (
                <ContentCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
