import AdminHead from '@/components/admin/AdminHead';
import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import { MediaItemCard } from '@/components/admin/ItemCards';
import { deleteMedia } from '@/app/admin/actions';
import { listMediaAdmin } from '@/lib/queries';

export const metadata = { title: 'Photos — Admin' };

export default async function AdminMediaPage() {
  const items = await listMediaAdmin();

  return (
    <>
      <AdminHead kicker="Photos" title="Photos">
        <Link className="btn-admin" href="/admin/media/new">
          <MaterialIcon name="add" />
          Add photo
        </Link>
      </AdminHead>

      {items.length ? (
        <div className="card-grid card-grid-md">
          {items.map((item) => (
            <MediaItemCard key={item.id} item={item} deleteAction={deleteMedia} />
          ))}
        </div>
      ) : (
        <div className="card-empty">
          No photos yet. Photos are added by URL for now.
          <Link href="/admin/media/new">Add a photo</Link>
        </div>
      )}
    </>
  );
}
