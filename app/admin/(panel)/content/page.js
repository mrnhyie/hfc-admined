import AdminHead from '@/components/admin/AdminHead';
import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import { MonthCalendarCard } from '@/components/admin/CalendarCards';
import { PostItemCard } from '@/components/admin/ItemCards';
import { deletePost } from '@/app/admin/actions';
import { toDateInputValue } from '@/lib/dates';
import { POST_KIND_LABELS } from '@/lib/forms';
import { listPostsAdmin } from '@/lib/queries';

export const metadata = { title: 'Content — Admin' };

const CONTENT_LEGEND = [
  { state: 'live', label: 'Published' },
  { state: 'draft', label: 'Draft' },
];

export default async function AdminContentPage({ searchParams }) {
  const { month } = await searchParams;
  const posts = await listPostsAdmin();
  const unwatchable = posts.filter((post) => post.kind === 'sermon' && !post.video_url).length;
  const dates = posts
    .map((post) => ({
      id: post.id,
      key: toDateInputValue(post.published_at),
      href: `/admin/content/${post.id}`,
      title: post.title,
      meta: [POST_KIND_LABELS[post.kind] || post.kind, post.series || post.speaker].filter(Boolean).join(' · '),
      state: post.published ? 'live' : 'draft',
      flag: post.published ? '' : 'draft',
    }))
    .filter((entry) => entry.key);

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
          <MonthCalendarCard
            entries={dates}
            month={typeof month === 'string' ? month : ''}
            basePath="/admin/content"
            kicker="Publishing calendar"
            feedTitle="This month"
            legend={CONTENT_LEGEND}
            emptyText="Nothing published this month. Posts dated here appear on the calendar."
          />

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
