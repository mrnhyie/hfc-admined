import Link from 'next/link';
import AdminHead from '@/components/admin/AdminHead';
import MaterialIcon from '@/components/MaterialIcon';
import { ActivityChart, MiniBars, monthDelta, shapeActivity } from '@/components/admin/ActivityChart';
import { eventDateStack, formatDate, formatTime } from '@/lib/dates';
import { POST_KIND_LABELS } from '@/lib/forms';
import { getSessionUser } from '@/lib/auth';
import {
  getAdminActivity,
  getAdminCounts,
  listEventsAdmin,
  listMediaAdmin,
  listMessages,
  listPostsAdmin,
  listProgramsAdmin,
} from '@/lib/queries';

export const metadata = { title: 'Admin' };

const POST_ICONS = { sermon: 'smart_display', announcement: 'public', devotional: 'auto_stories' };

const now = () => Date.now();

/* The chart plots four of the five kinds; programs are a fixed weekly order, so a
   month-by-month line for them would only show when they were first typed in. */
const CHART_SERIES = [
  { key: 'events', label: 'Events' },
  { key: 'posts', label: 'Sermons & news' },
  { key: 'media', label: 'Photos' },
  { key: 'messages', label: 'Messages' },
];

const published = (value) => (
  <span className={value ? 'pill pill-published' : 'pill pill-draft'}>
    {value ? 'published' : 'draft'}
  </span>
);

const of = (counts, key) => counts[key] ?? 0;

function nextEvents(events, limit = 4) {
  const upcoming = events
    .filter((event) => new Date(event.starts_at).getTime() >= now())
    .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
  const past = events
    .filter((event) => new Date(event.starts_at).getTime() < now())
    .sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at));
  return [...upcoming, ...past].slice(0, limit);
}

function Stat({ href, icon, label, value, note, values }) {
  const { diff } = monthDelta(values);
  const tone = diff > 0 ? 'is-up' : diff < 0 ? 'is-down' : 'is-flat';

  return (
    <Link href={href} className="admin-stat">
      <span className="admin-stat-top">
        <span className="admin-stat-icon">
          <MaterialIcon name={icon} />
        </span>
        <span className="label">{label}</span>
      </span>

      <span className="admin-stat-figure">
        <span className="stat">{value}</span>
        <MiniBars values={values} />
      </span>

      <span className="admin-stat-note">
        <em className={`admin-delta ${tone}`}>
          {diff === 0 ? (
            'no change'
          ) : (
            <>
              <MaterialIcon name={diff > 0 ? 'arrow_upward' : 'arrow_downward'} />
              {Math.abs(diff)}
            </>
          )}
        </em>
        {note}
      </span>
    </Link>
  );
}

/* The row is the whole record at a glance: what it is, when it happens, whether
   the public can see it yet. */
function Panel({ title, href, columns, rows, empty }) {
  return (
    <section className="admin-panel">
      <header className="admin-panel-head">
        <h2>{title}</h2>
        <Link href={href}>View all</Link>
      </header>

      {rows.length ? (
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td>
                  <span className="admin-row-cell">
                    <span className="admin-row-mark">{row.mark}</span>
                    <span className="admin-row-text">
                      <Link href={row.href}>{row.title}</Link>
                      {row.note ? <em>{row.note}</em> : null}
                    </span>
                  </span>
                </td>
                <td className="admin-row-when">{row.when}</td>
                <td className="admin-row-status">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="admin-panel-empty">{empty}</div>
      )}
    </section>
  );
}

const Thumb = ({ src, children }) =>
  src ? <img src={src} alt="" loading="lazy" /> : children;

export default async function AdminDashboard() {
  const [user, counts, activity, events, programs, posts, media, messages] = await Promise.all([
    getSessionUser(),
    getAdminCounts(),
    getAdminActivity(),
    listEventsAdmin(),
    listProgramsAdmin(),
    listPostsAdmin(),
    listMediaAdmin(),
    listMessages(),
  ]);

  const { months, byKind } = shapeActivity(activity);
  const newMessages = messages.filter((message) => message.status === 'new');
  const adminName = user?.name?.trim();

  const eventRows = nextEvents(events).map((event) => ({
    key: `event-${event.id}`,
    href: `/admin/events/${event.id}`,
    title: event.title,
    note: [event.venue, event.all_day ? 'All day' : formatTime(event.starts_at)].filter(Boolean).join(' · '),
    when: formatDate(event.starts_at),
    status: published(event.published),
    mark: <Thumb src={event.cover_url}>{eventDateStack(event).day}</Thumb>,
  }));

  const programRows = programs.slice(0, 4).map((program) => ({
    key: `program-${program.id}`,
    href: `/admin/programs/${program.id}`,
    title: program.title,
    // The time and venue go on the note line: the narrow schedule column would wrap
    // "Wednesday · 6:00 PM – 7:30 PM" over three rows and make the table ragged.
    note: [program.meeting_time, program.venue || program.category].filter(Boolean).join(' · '),
    when: program.meeting_day || '—',
    status: published(program.published),
    mark: <Thumb src={program.cover_url}><MaterialIcon name={program.icon || 'church'} /></Thumb>,
  }));

  const postRows = posts.slice(0, 4).map((post) => ({
    key: `post-${post.id}`,
    href: `/admin/content/${post.id}`,
    title: post.title,
    note: POST_KIND_LABELS[post.kind] || post.kind,
    when: post.published_at ? formatDate(post.published_at) : '—',
    status: published(post.published),
    mark: <Thumb src={post.cover_url}><MaterialIcon name={POST_ICONS[post.kind] || 'auto_stories'} /></Thumb>,
  }));

  const messageRows = newMessages.slice(0, 4).map((message) => ({
    key: `message-${message.id}`,
    href: `/admin/messages`,
    title: message.name,
    note: message.email,
    when: formatDate(message.created_at),
    status: <span className="pill pill-new">{message.status}</span>,
    mark: message.name.slice(0, 1).toUpperCase(),
  }));

  return (
    <>
      <AdminHead
        kicker="Overview"
        title={`Welcome back${adminName ? `, ${adminName}` : ''}`}
        subtitle="What is live on the chapel site, what is waiting for you, and how the last six months have been filling up."
      >
        <div className="admin-head-tools">
          <Link className="btn-ghost" href="/admin/content/new">
            <MaterialIcon name="add" />
            Add content
          </Link>
          <Link className="btn-admin" href="/admin/events/new">
            <MaterialIcon name="add" />
            Add event
          </Link>
        </div>
      </AdminHead>

      <div className="admin-stats">
        <Stat
          href="/admin/events"
          icon="calendar_today"
          label="Events"
          value={of(counts, 'events')}
          note={`${of(counts, 'events_published')} of ${of(counts, 'events')} published`}
          values={byKind.events}
        />
        <Stat
          href="/admin/programs"
          icon="church"
          label="Programs"
          value={of(counts, 'programs')}
          note={`${of(counts, 'programs_published')} of ${of(counts, 'programs')} published`}
          values={byKind.programs}
        />
        <Stat
          href="/admin/content"
          icon="auto_stories"
          label="Sermons & news"
          value={of(counts, 'posts')}
          note={`${of(counts, 'posts_published')} of ${of(counts, 'posts')} published`}
          values={byKind.posts}
        />
        <Stat
          href="/admin/media"
          icon="photo_camera"
          label="Gallery"
          value={of(counts, 'media')}
          note={`${of(counts, 'albums')} album${of(counts, 'albums') === 1 ? '' : 's'}`}
          values={byKind.media}
        />
        <Stat
          href="/admin/messages"
          icon="mail"
          label="Messages"
          value={of(counts, 'new_messages')}
          note={`${of(counts, 'messages')} in the inbox`}
          values={byKind.messages}
        />
      </div>

      <section className="admin-panel admin-chart-panel">
        <header className="admin-panel-head">
          <h2>Site activity</h2>
          <span className="admin-chart-legend">
            {CHART_SERIES.map((item) => (
              <span key={item.key}>
                <i className={`series-${item.key}`} />
                {item.label}
              </span>
            ))}
          </span>
        </header>
        <ActivityChart months={months} byKind={byKind} series={CHART_SERIES} />
      </section>

      <div className="admin-panels">
        <Panel
          title="Recent events"
          href="/admin/events"
          columns={['Title', 'Date', 'Status']}
          rows={eventRows}
          empty="Nothing is scheduled yet."
        />
        <Panel
          title="Upcoming programs"
          href="/admin/programs"
          columns={['Title', 'Meets', 'Status']}
          rows={programRows}
          empty="No weekly services or ministries yet."
        />
        <Panel
          title="Latest content"
          href="/admin/content"
          columns={['Title', 'Published', 'Status']}
          rows={postRows}
          empty="No sermons or notes published yet."
        />
        <Panel
          title="Unread messages"
          href="/admin/messages"
          columns={['From', 'Received', 'Status']}
          rows={messageRows}
          empty="Nothing unread from the contact form."
        />
      </div>
    </>
  );
}
