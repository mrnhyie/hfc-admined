import Link from 'next/link';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import AdminSearch from '@/components/admin/AdminSearch';
import MaterialIcon from '@/components/MaterialIcon';
import { getSessionUser } from '@/lib/auth';
import { getAdminCounts, getSettings } from '@/lib/queries';

export default async function AdminPanelLayout({ children }) {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  const [settings, counts] = await Promise.all([getSettings(), getAdminCounts()]);
  const unread = counts.new_messages || 0;

  return (
    <div className="admin">
      <div className="admin-shell">
        <aside className="admin-side">
          <AdminNav
            churchName={settings.church_short}
            userName={user.name}
            userEmail={user.email}
            counts={counts}
          />
        </aside>

        <div className="admin-col">
          <header className="admin-topbar">
            <AdminSearch />
            <div className="admin-topbar-tools">
              <Link
                className="admin-icon-btn"
                href="/admin/messages"
                aria-label={unread ? `Messages — ${unread} unread` : 'Messages'}
              >
                <MaterialIcon name="notifications" />
                {unread ? <span className="admin-topbar-badge">{unread}</span> : null}
              </Link>
              <a
                className="admin-icon-btn"
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the public site"
              >
                <MaterialIcon name="arrow_outward" />
              </a>
            </div>
          </header>

          <main className="admin-main">{children}</main>
        </div>
      </div>
    </div>
  );
}
