import { redirect } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';
import { getSessionUser } from '@/lib/auth';
import { getSettings } from '@/lib/queries';

export const metadata = { title: 'Admin sign in' };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect('/admin');

  const settings = await getSettings();

  return (
    <div className="admin">
      <div className="login-shell">
        <LoginForm churchName={settings.church_short} />
      </div>
    </div>
  );
}
