import AdminHead from '@/components/admin/AdminHead';
import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import { PostItemCard } from '@/components/admin/ItemCards';
import { deletePost } from '@/app/admin/actions';
import { listPostsAdmin } from '@/lib/queries';

export const metadata = { title: 'Content — Admin' };

export default async function AdminContentPage() {
  const posts = await listPostsAdmin();
  const unwatchable = posts.filter((post) => post.kind === 'sermon' && !post.video_url).length;

  return (
    <>
      <AdminHead kicker="Sermons, notes and announcements" title="Content">
        <Link className="btn-admin" href="/admin/content/new">
          <MaterialIcon name="add" />
          Add content
        </Link>
      </AdminHead>

      {posts.length ? (
        <>
          <div className="card-grid card-grid-md">
            {posts.map((post) => (
              <PostItemCard key={post.id} post={post} deleteAction={deletePost} />
            ))}
          </div>

          {unwatchable ? (
            <p className="editor-note">
              {unwatchable} {unwatchable === 1 ? 'sermon has' : 'sermons have'} no recording URL yet, so their cards
              show no Watch button.
            </p>
          ) : null}
        </>
      ) : (
        <div className="card-empty">
          No content yet. Sermon notes, devotionals and announcements all live here.
          <Link href="/admin/content/new">Add content</Link>
        </div>
      )}
    </>
  );
}
