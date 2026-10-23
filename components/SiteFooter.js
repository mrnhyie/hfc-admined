import Link from 'next/link';
import BrandIcon from '@/components/BrandIcon';
import MaterialIcon from '@/components/MaterialIcon';
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
  const telHref = settings.phone ? `tel:${settings.phone.replace(/\s+/g, '')}` : null;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta">
          <Link className="btn btn-pill" href="/contact">
            Plan your visit
            <MaterialIcon name="arrow_forward" />
          </Link>
          {settings.give_url ? (
            <a className="btn btn-pill btn-pill-gold" href={settings.give_url} target="_blank" rel="noopener noreferrer">
              {settings.give_label}
              <MaterialIcon name="arrow_outward" />
            </a>
          ) : null}
        </div>

        <div className="footer-grid">
          <div className="footer-col footer-col-brand">
            <div className="footer-brand">
              <img src={settings.logo_url} alt="" />
              <span>{settings.church_name}</span>
            </div>
            <p className="footer-blurb">{settings.about_quote}</p>
            {socials.length ? (
              <ul className="footer-social" aria-label="Social media">
                {socials.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={item.label}
                    >
                      <BrandIcon name={item.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
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
            {settings.phone ? <a href={telHref}>{settings.phone}</a> : null}
            {settings.email ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : null}
            {settings.service_note ? <p>{settings.service_note}</p> : null}
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
