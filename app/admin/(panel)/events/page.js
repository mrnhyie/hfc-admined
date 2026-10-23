import AdminHead from '@/components/admin/AdminHead';
import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import EventsCalendar from '@/components/admin/EventsCalendar';
import { EventItemCard } from '@/components/admin/ItemCards';
import { deleteEvent } from '@/app/admin/actions';
import { listEventsAdmin } from '@/lib/queries';

export const metadata = { title: 'Events — Admin' };

const VIEWS = ['month', 'week', 'list'];

export default async function AdminEventsPage({ searchParams }) {
  const { view: viewParam, date } = await searchParams;
  const view = VIEWS.includes(viewParam) ? viewParam : 'month';
  const events = await listEventsAdmin();
  const live = events.filter((event) => event.published).length;

  const list = (
    <>
      <div className="event-list">
        {events.map((event) => (
          <EventItemCard key={event.id} event={event} deleteAction={deleteEvent} />
        ))}
      </div>
      <p className="editor-note">
        {live} of {events.length} events are published. Drafts stay out of the public listings.
      </p>
    </>
  );

  return (
    <>
      <AdminHead kicker="Publishing" title="Events">
        <Link className="btn-admin" href="/admin/events/new">
          <MaterialIcon name="add" />
          Add event
        </Link>
      </AdminHead>

      {events.length ? (
        <EventsCalendar
          events={events}
          view={view}
          date={typeof date === 'string' ? date : ''}
          list={view === 'list' ? list : null}
        />
      ) : (
        <div className="card-empty">
          No events yet. Anything you publish here appears on the events page and the home page calendar.
          <Link href="/admin/events/new">Add the first event</Link>
        </div>
      )}
    </>
  );
}
