import SiteFooter from '@/components/SiteFooter';
import SiteNav from '@/components/SiteNav';
import NotFoundBody from '@/components/NotFoundBody';
import { getSettings } from '@/lib/queries';

export default async function NotFound() {
  const settings = await getSettings();

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteNav
        churchName={settings.church_short}
        logoUrl={settings.logo_url}
        giveUrl={settings.give_url}
        giveLabel={settings.give_label}
      />
      <NotFoundBody />
      <SiteFooter settings={settings} />
    </>
  );
}
