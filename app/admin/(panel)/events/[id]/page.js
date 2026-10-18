import { notFound } from 'next/navigation';
import AdminHead from '@/components/admin/AdminHead';
import EventEditor from '@/components/admin/EventEditor';
import { getEventForEdit } from '@/lib/queries';

export const metadata = { title: 'Edit event — Admin' };

export default async function EditEventPage({ params }) {
  const { id } = await params;
  const event = await getEventForEdit(Number(id));
  if (!event) notFound();

  return (
    <>
      <AdminHead kicker="Events" title={event.title}>
        <a className="btn-ghost" href="/admin/events">
          All events
        </a>
      </AdminHead>
      <EventEditor event={event} />
    </>
  );
}
