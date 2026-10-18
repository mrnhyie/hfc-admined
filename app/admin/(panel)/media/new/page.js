import AdminHead from '@/components/admin/AdminHead';
import MediaEditor from '@/components/admin/MediaEditor';

export const metadata = { title: 'Add photo — Admin' };

export default function NewMediaPage() {
  return (
    <>
      <AdminHead kicker="Gallery" title="Add photo">
        <a className="btn-ghost" href="/admin/media">
          All photos
        </a>
      </AdminHead>
      <MediaEditor />
    </>
  );
}
