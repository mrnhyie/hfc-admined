import AdminHead from '@/components/admin/AdminHead';
import PostEditor from '@/components/admin/PostEditor';
import { listEventsAdmin, listProgramsAdmin } from '@/lib/queries';

export const metadata = { title: 'New content — Admin' };

export default async function NewContentPage() {
  const [events, programs] = await Promise.all([listEventsAdmin(), listProgramsAdmin()]);

  return (
    <>
      <AdminHead kicker="Content" title="New content">
        <a className="btn-ghost" href="/admin/content">
          All content
        </a>
      </AdminHead>
      <PostEditor events={events} programs={programs} />
    </>
  );
}
