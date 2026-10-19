import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import SocialRail from '@/components/SocialRail';
import { getSettings } from '@/lib/queries';

export default async function SiteLayout({ children }) {
  const settings = await getSettings();

  return (
    <>
      <SocialRail settings={settings} />
      <SiteNav
        churchName={settings.church_short}
        logoUrl={settings.logo_url}
        giveUrl={settings.give_url}
        giveLabel={settings.give_label}
        serviceLine={
          settings.hero_badge_one_label && settings.hero_badge_one_value
            ? `${settings.hero_badge_one_label} · ${settings.hero_badge_one_value}`
            : ''
        }
        address={settings.address}
      />
      {children}
      <SiteFooter settings={settings} />
    </>
  );
}
