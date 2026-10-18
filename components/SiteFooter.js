import Link from 'next/link';
import { socialLinks } from '@/lib/socials';

const EXPLORE = [
  { href: '/programs', label: 'Programs' },
  { href: '/events', label: 'Events' },
  { href: '/content', label: 'Sermons & News' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteFooter({ settings }) {
  const socials = socialLinks(settings);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src={settings.logo_url} alt="" />
              <span>{settings.church_name}</span>
            </div>
            <p className="footer-blurb">{settings.about_quote}</p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            {EXPLORE.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h4>Visit us</h4>
            <p>{settings.address}</p>
            {settings.phone ? <a href={`tel:${settings.phone.replace(/\s+/g, '')}`}>{settings.phone}</a> : null}
            {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
            {settings.service_note ? <p>{settings.service_note}</p> : null}
          </div>

          <div className="footer-col">
            <h4>Connected</h4>
            {settings.hero_badge_one_label ? (
              <p>
                {settings.hero_badge_one_label}: {settings.hero_badge_one_value}
              </p>
            ) : null}
            {settings.give_url ? (
              <a href={settings.give_url} target="_blank" rel="noopener noreferrer">
                {settings.give_label}
              </a>
            ) : null}
            {socials.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} {settings.church_name}. All rights reserved.</span>
          <Link href="/admin">Church sign in</Link>
        </div>
      </div>
    </footer>
  );
}
