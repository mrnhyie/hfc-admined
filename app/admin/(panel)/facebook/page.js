import AdminHead from '@/components/admin/AdminHead';
import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import { FacebookItemCard } from '@/components/admin/ItemCards';
import { deleteFacebookPost } from '@/app/admin/actions';
import { listFacebookPostsAdmin } from '@/lib/queries';

export const metadata = { title: 'Facebook — Admin' };

export default async function AdminFacebookPage() {
  const posts = await listFacebookPostsAdmin();

  return (
    <>
      <AdminHead
        kicker="From the page"
        title="Facebook"
        subtitle="Posts entered here fill the Facebook band until a page token is connected."
      >
        <Link className="btn-admin" href="/admin/facebook/new">
          <MaterialIcon name="add" />
          Add post
        </Link>
      </AdminHead>

      {posts.length ? (
        <div className="card-grid card-grid-md">
          {posts.map((post) => (
            <FacebookItemCard key={post.id} post={post} deleteAction={deleteFacebookPost} />
          ))}
        </div>
      ) : (
        <div className="card-empty">
          No Facebook posts yet. Add one whenever something is worth showing beyond the page itself.
          <Link href="/admin/facebook/new">Add a post</Link>
        </div>
      )}
    </>
  );
}
