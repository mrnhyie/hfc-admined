import Link from 'next/link';
import AdminHead from '@/components/admin/AdminHead';
import MaterialIcon from '@/components/MaterialIcon';
import { formatDate } from '@/lib/dates';
import { searchAdmin } from '@/lib/queries';

export const metadata = { title: 'Search — Admin' };

const KINDS = {
  events: { label: 'Events', icon: 'calendar_today', edit: (id) => `/admin/events/${id}` },
  programs: { label: 'Programs', icon: 'church', edit: (id) => `/admin/programs/${id}` },
  posts: { label: 'Sermons & news', icon: 'auto_stories', edit: (id) => `/admin/content/${id}` },
  media: { label: 'Gallery', icon: 'photo_camera', edit: (id) => `/admin/media/${id}` },
  messages: { label: 'Messages', icon: 'mail', edit: () => '/admin/messages' },
};

export default async function AdminSearchPage({ searchParams }) {
  const { q = '' } = await searchParams;
  const term = q.trim();
  const rows = term.length >= 2 ? await searchAdmin(term) : [];

  const hits = Object.keys(KINDS)
    .flatMap((kind) => rows.filter((row) => row.kind === kind))
    .sort((a, b) => Object.keys(KINDS).indexOf(a.kind) - Object.keys(KINDS).indexOf(b.kind));

  return (
    <>
      <AdminHead kicker="Find" title="Search" subtitle={`Everything on the chapel site that matches “${term}”.`}>
        <Link className="btn-ghost" href="/admin">
          <MaterialIcon name="dashboard" />
          Back to dashboard
        </Link>
      </AdminHead>

      {term.length < 2 ? (
        <div className="card-empty">Type at least two characters to search events, programs, sermons, photos and messages.</div>
      ) : hits.length ? (
        <section className="admin-panel">
          <header className="admin-panel-head">
            <h2>{hits.length} result{hits.length === 1 ? '' : 's'}</h2>
            <span className="admin-panel-note">Matching “{term}”</span>
          </header>

          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Type</th>
                <th scope="col">When</th>
              </tr>
            </thead>
            <tbody>
              {hits.map((row) => {
                const kind = KINDS[row.kind];
                return (
                  <tr key={`${row.kind}-${row.id}`}>
                    <td>
                      <span className="admin-row-cell">
                        <span className="admin-row-mark">
                          <MaterialIcon name={kind.icon} />
                        </span>
                        <span className="admin-row-text">
                          <Link href={kind.edit(row.id)}>{row.title}</Link>
                          {row.note ? <em>{row.note}</em> : null}
                        </span>
                      </span>
                    </td>
                    <td className="admin-row-when">{kind.label}</td>
                    <td className="admin-row-when">{row.at ? formatDate(row.at) : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ) : (
        <div className="card-empty">
          Nothing matches “{term}”. Search covers titles, summaries, venues, speakers, captions and message bodies.
        </div>
      )}
    </>
  );
}
