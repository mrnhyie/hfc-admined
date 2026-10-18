import AdminHead from '@/components/admin/AdminHead';
import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import { EventItemCard } from '@/components/admin/ItemCards';
import { deleteEvent } from '@/app/admin/actions';
import { listEventsAdmin } from '@/lib/queries';

export const metadata = { title: 'Events — Admin' };

export default async function AdminEventsPage() {
  const events = await listEventsAdmin();
  const live = events.filter((event) => event.published).length;

  return (
    <>
      <AdminHead kicker="Publishing" title="Events">
        <Link className="btn-admin" href="/admin/events/new">
          <MaterialIcon name="add" />
          Add event
        </Link>
      </AdminHead>

      {events.length ? (
        <>
          <div className="card-grid">
            {events.map((event) => (
              <EventItemCard key={event.id} event={event} deleteAction={deleteEvent} />
            ))}
          </div>

          <p className="editor-note">
            {live} of {events.length} events are published. Drafts stay out of the public listings.
          </p>
        </>
      ) : (
        <div className="card-empty">
          No events yet. Anything you publish here appears on the events page and the home page calendar.
          <Link href="/admin/events/new">Add the first event</Link>
        </div>
      )}
    </>
  );
}
