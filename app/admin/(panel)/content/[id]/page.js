import { notFound } from 'next/navigation';
import AdminHead from '@/components/admin/AdminHead';
import PostEditor from '@/components/admin/PostEditor';
import { getPostForEdit, listEventsAdmin, listProgramsAdmin } from '@/lib/queries';

export const metadata = { title: 'Edit content — Admin' };

export default async function EditContentPage({ params }) {
  const { id } = await params;
  const [post, events, programs] = await Promise.all([
    getPostForEdit(Number(id)),
    listEventsAdmin(),
    listProgramsAdmin(),
  ]);
  if (!post) notFound();

  return (
    <>
      <AdminHead kicker="Content" title={post.title}>
        <a className="btn-ghost" href="/admin/content">
          All content
        </a>
      </AdminHead>
      <PostEditor post={post} events={events} programs={programs} />
    </>
  );
}
