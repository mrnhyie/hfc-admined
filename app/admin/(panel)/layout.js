import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import { getSessionUser } from '@/lib/auth';
import { getSettings } from '@/lib/queries';

export default async function AdminPanelLayout({ children }) {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  const settings = await getSettings();

  return (
    <div className="admin">
      <div className="admin-shell">
        <aside className="admin-side">
          <AdminNav churchName={settings.church_short} userName={user.name} />
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
