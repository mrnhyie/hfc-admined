import { notFound } from 'next/navigation';
import AdminHead from '@/components/admin/AdminHead';
import MediaEditor from '@/components/admin/MediaEditor';
import { getMediaForEdit } from '@/lib/queries';

export const metadata = { title: 'Edit photo — Admin' };

export default async function EditMediaPage({ params }) {
  const { id } = await params;
  const item = await getMediaForEdit(Number(id));
  if (!item) notFound();

  return (
    <>
      <AdminHead kicker="Gallery" title={item.caption || item.alt || 'Photo'}>
        <a className="btn-ghost" href="/admin/media">
          All photos
        </a>
      </AdminHead>
      <MediaEditor item={item} />
    </>
  );
}
