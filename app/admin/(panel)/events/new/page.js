import AdminHead from '@/components/admin/AdminHead';
import EventEditor from '@/components/admin/EventEditor';

export const metadata = { title: 'New event — Admin' };

export default function NewEventPage() {
  return (
    <>
      <AdminHead kicker="Events" title="New event">
        <a className="btn-ghost" href="/admin/events">
          All events
        </a>
      </AdminHead>
      <EventEditor />
    </>
  );
}
