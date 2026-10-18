import BrandIcon from '@/components/BrandIcon';
import { socialLinks } from '@/lib/socials';

export default function SocialRail({ settings }) {
  const links = socialLinks(settings);
  if (!links.length) return null;

  return (
    <nav className="social-rail" aria-label="Social media">
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              title={link.label}
            >
              <BrandIcon name={link.icon} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
