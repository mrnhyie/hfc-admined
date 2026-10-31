import { notFound } from 'next/navigation';
import AdminHead from '@/components/admin/AdminHead';
import FacebookEditor from '@/components/admin/FacebookEditor';
import { getFacebookPostById } from '@/lib/queries';

export const metadata = { title: 'Edit Facebook post — Admin' };

export default async function EditFacebookPostPage({ params }) {
  const { id } = await params;
  const item = await getFacebookPostById(Number(id));
  if (!item) notFound();

  return (
    <>
      <AdminHead kicker="Facebook" title={item.caption || item.image_alt || 'Photo post'}>
        <a className="btn-ghost" href="/admin/facebook">
          All posts
        </a>
      </AdminHead>
      <FacebookEditor item={item} />
    </>
  );
}
