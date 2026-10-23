import EventCard from '@/components/EventCard';
import CrossMarks from '@/components/CrossMarks';
import PageHead from '@/components/PageHead';
import { getPastEvents, getSettings, getUpcomingEvents } from '@/lib/queries';

export const metadata = { title: 'Events' };

export default async function EventsPage() {
  const [settings, upcoming, past] = await Promise.all([
    getSettings(),
    getUpcomingEvents(30),
    getPastEvents(6),
  ]);

  return (
    <main id="main">
      <PageHead
        label={settings.events_kicker}
        title="Everything on our *calendar*"
        body="Conferences, retreats, special services and community programmes. Pick a date and come as you are."
        art="nativity"
      />

      <section className="section">
        <CrossMarks seed="events-upcoming" />
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-label">Next up</div>
              <h2 className="section-title">Upcoming</h2>
            </div>
            <p className="section-note">{settings.service_note}</p>
          </div>
          {upcoming.length ? (
            <div className="event-list">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} variant="row" />
              ))}
            </div>
          ) : (
            <div className="empty">No dates scheduled yet.</div>
          )}
        </div>
      </section>

      {past.length ? (
        <section className="section section-ivory">
          <CrossMarks seed="events-past" />
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-label">Looking back</div>
                <h2 className="section-title">Recently held</h2>
              </div>
            </div>
            <div className="archive-list">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
