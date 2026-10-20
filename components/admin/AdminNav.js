'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MaterialIcon from '@/components/MaterialIcon';
import { signOut } from '@/app/admin/actions';

/* Grouped the way a newsroom CMS reads: where you are, what you write, how the
   site is wired. The badge is the queue that matters on each screen — unread
   mail on Messages, everything else is the total. */
const GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: 'dashboard' }],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/events', label: 'Events', icon: 'calendar_today', count: 'events' },
      { href: '/admin/programs', label: 'Programs', icon: 'church', count: 'programs' },
      { href: '/admin/content', label: 'Sermons & news', icon: 'auto_stories', count: 'posts' },
      { href: '/admin/media', label: 'Gallery', icon: 'photo_camera', count: 'media' },
      { href: '/admin/messages', label: 'Messages', icon: 'mail', count: 'new_messages', accent: true },
    ],
  },
  {
    label: 'Site',
    items: [{ href: '/admin/settings', label: 'Site text', icon: 'tune' }],
  },
];

const initials = (name) =>
  (name || 'A')
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

export default function AdminNav({ churchName, userName, userEmail, counts = {} }) {
  const pathname = usePathname();

  return (
    <>
      <div className="admin-brand">
        <span className="admin-brand-mark">{initials(churchName)}</span>
        <span className="admin-brand-name">{churchName}</span>
      </div>

      <div className="admin-nav-scroll">
        {GROUPS.map((group) => (
          <div className="admin-nav-group" key={group.label}>
            <h2>{group.label}</h2>
            <nav className="admin-nav" aria-label={`${group.label} navigation`}>
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(`${item.href}/`));
                const count = item.count ? counts[item.count] : null;

                return (
                  <Link key={item.href} href={item.href} data-active={active}>
                    <MaterialIcon name={item.icon} />
                    <span>{item.label}</span>
                    {count ? (
                      <em className={item.accent ? 'is-accent' : undefined}>{count}</em>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="admin-side-foot">
        <div className="admin-user">
          <span className="admin-user-mark">{initials(userName)}</span>
          <span className="admin-user-text">
            <strong>{userName}</strong>
            {userEmail ? <em>{userEmail}</em> : null}
          </span>
          <form action={signOut}>
            <button className="admin-signout" type="submit" aria-label="Sign out">
              <MaterialIcon name="logout" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
