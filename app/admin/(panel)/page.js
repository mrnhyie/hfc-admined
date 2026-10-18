import Link from 'next/link';
import AdminHead from '@/components/admin/AdminHead';
import MaterialIcon from '@/components/MaterialIcon';
import {
  EventItemCard,
  MediaItemCard,
  MessageItemCard,
  PostItemCard,
  ProgramItemCard,
} from '@/components/admin/ItemCards';
import { markMessage } from '@/app/admin/actions';
import {
  getAdminCounts,
  listEventsAdmin,
  listMediaAdmin,
  listMessages,
  listPostsAdmin,
  listProgramsAdmin,
} from '@/lib/queries';

export const metadata = { title: 'Admin' };

const STATS = [
  { key: 'upcoming_events', label: 'Upcoming events', href: '/admin/events' },
  { key: 'programs', label: 'Programs', href: '/admin/programs' },
  { key: 'posts', label: 'Content items', href: '/admin/content' },
  { key: 'media', label: 'Gallery photos', href: '/admin/media' },
  { key: 'new_messages', label: 'Unread messages', href: '/admin/messages' },
];

const now = () => Date.now();

function nextEvents(events, limit = 4) {
  const upcoming = events
    .filter((event) => new Date(event.starts_at).getTime() >= now())
    .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
  const past = events
    .filter((event) => new Date(event.starts_at).getTime() < now())
    .sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at));
  return [...upcoming, ...past].slice(0, limit);
}

function Empty({ href, label, text }) {
  return (
    <div className="card-empty">
      {text}
      <Link href={href}>{label}</Link>
    </div>
  );
}

export default async function AdminDashboard() {
  const [counts, events, programs, posts, media, messages] = await Promise.all([
    getAdminCounts(),
    listEventsAdmin(),
    listProgramsAdmin(),
    listPostsAdmin(),
    listMediaAdmin(),
    listMessages({ status: 'new' }),
  ]);

  const featured = nextEvents(events);

  return (
    <>
      <AdminHead kicker="Overview" title="Dashboard">
        <Link className="btn-admin" href="/admin/events/new">
          <MaterialIcon name="add" />
          Add event
        </Link>
      </AdminHead>

      <div className="admin-stats">
        {STATS.map((stat) => (
          <Link key={stat.key} href={stat.href} className="admin-stat">
            <span className="stat">{counts[stat.key] ?? 0}</span>
            <span className="label">{stat.label}</span>
          </Link>
        ))}
      </div>

      <section className="admin-section">
        <h2 className="admin-subhead">
          Events
          <Link className="admin-sub" href="/admin/events">
            All events
          </Link>
        </h2>

        {featured.length ? (
          <div className="card-grid">
            {featured.map((event) => (
              <EventItemCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Empty href="/admin/events/new" label="Add the first event" text="Nothing is scheduled yet." />
        )}
      </section>

      <section className="admin-section">
        <h2 className="admin-subhead">
          Programs
          <Link className="admin-sub" href="/admin/programs">
            All programs
          </Link>
        </h2>

        {programs.length ? (
          <div className="card-grid card-grid-md">
            {programs.slice(0, 6).map((program) => (
              <ProgramItemCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <Empty href="/admin/programs/new" label="Add a program" text="No weekly services or ministries yet." />
        )}
      </section>

      <section className="admin-section">
        <h2 className="admin-subhead">
          Content
          <Link className="admin-sub" href="/admin/content">
            All content
          </Link>
        </h2>

        {posts.length ? (
          <div className="card-grid card-grid-md">
            {posts.slice(0, 3).map((post) => (
              <PostItemCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Empty href="/admin/content/new" label="Add content" text="No sermons or notes published yet." />
        )}
      </section>

      <div className="admin-split">
        <section>
          <h2 className="admin-subhead">
            Unread messages
            <Link className="admin-sub" href="/admin/messages">
              Open the inbox
            </Link>
          </h2>

          {messages.length ? (
            <div className="card-list">
              {messages.slice(0, 2).map((message) => (
                <MessageItemCard key={message.id} message={message} markAction={markMessage} />
              ))}
            </div>
          ) : (
            <Empty href="/admin/messages" label="See the inbox" text="Nothing unread from the contact form." />
          )}
        </section>

        <section>
          <h2 className="admin-subhead">
            Recent photos
            <Link className="admin-sub" href="/admin/media">
              Gallery admin
            </Link>
          </h2>

          {media.length ? (
            <div className="card-list">
              {media.slice(0, 2).map((item) => (
                <MediaItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Empty href="/admin/media/new" label="Add a photo" text="The gallery is empty." />
          )}
        </section>
      </div>
    </>
  );
}
