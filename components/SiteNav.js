'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MaterialIcon from '@/components/MaterialIcon';

const LINKS = [
  { href: '/programs', label: 'Programs' },
  { href: '/events', label: 'Events' },
  { href: '/content', label: 'Sermons' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

/* Two lines so the logo stays the height of the bar instead of pushing the
   whole header taller. */
function Wordmark({ name }) {
  const words = (name || '').split(' ');
  return (
    <span className="brand-word">
      <span>{words[0]}</span>
      {words.length > 1 ? <span>{words.slice(1).join(' ')}</span> : null}
    </span>
  );
}

export default function SiteNav({ churchName, logoUrl, giveUrl, giveLabel }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/">
          <img src={logoUrl} alt="" />
          <Wordmark name={churchName} />
        </Link>

        <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} data-active={isActive(link.href)}>
              {link.label}
            </Link>
          ))}
          {giveUrl ? (
            <a className="btn btn-gold nav-cta" href={giveUrl} target="_blank" rel="noopener noreferrer">
              {giveLabel}
              <MaterialIcon name="arrow_outward" />
            </a>
          ) : (
            <Link className="btn btn-gold nav-cta" href="/contact">
              Plan your visit
              <MaterialIcon name="arrow_forward" />
            </Link>
          )}
        </nav>

        <button
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <MaterialIcon name={open ? 'close' : 'menu'} className="msvg-lg" />
        </button>
      </div>
    </header>
  );
}
