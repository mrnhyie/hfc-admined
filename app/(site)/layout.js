import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import SocialRail from '@/components/SocialRail';
import { getSettings } from '@/lib/queries';

export default async function SiteLayout({ children }) {
  const settings = await getSettings();

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SocialRail settings={settings} />
      <SiteNav
        churchName={settings.church_short}
        logoUrl={settings.logo_url}
        giveUrl={settings.give_url}
        giveLabel={settings.give_label}
      />
      {children}
      <SiteFooter settings={settings} />
    </>
  );
}
