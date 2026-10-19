'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MaterialIcon from '@/components/MaterialIcon';
import { signOut } from '@/app/admin/actions';

const ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/events', label: 'Events', icon: 'calendar_today' },
  { href: '/admin/programs', label: 'Programs', icon: 'church' },
  { href: '/admin/content', label: 'Content', icon: 'auto_stories' },
  { href: '/admin/media', label: 'Gallery', icon: 'photo_camera' },
  { href: '/admin/messages', label: 'Messages', icon: 'mail' },
  { href: '/admin/settings', label: 'Site text', icon: 'public' },
];

export default function AdminNav({ churchName, userName }) {
  const pathname = usePathname();

  return (
    <>
      <div className="admin-brand">{churchName}</div>

      <nav className="admin-nav" aria-label="Admin navigation">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            data-active={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))}
          >
            <MaterialIcon name={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="admin-side-foot">
        <span className="admin-user">
          Signed in as
          <strong>{userName}</strong>
        </span>
        <a href="/">
          <MaterialIcon name="arrow_outward" />
          View site
        </a>
        <form action={signOut}>
          <button className="admin-signout" type="submit">
            <MaterialIcon name="logout" />
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}
