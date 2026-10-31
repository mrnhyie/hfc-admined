import CrossMarks from '@/components/CrossMarks';
import FacebookFallback from '@/components/FacebookFallback';
import FacebookFeed from '@/components/FacebookFeed';
import MaterialIcon from '@/components/MaterialIcon';
import PageHead from '@/components/PageHead';
import { getFacebookFeed } from '@/lib/facebook';
import { getSettings } from '@/lib/queries';

export const metadata = { title: 'Facebook' };

export default async function FacebookPage() {
  const [settings, feed] = await Promise.all([getSettings(), getFacebookFeed(9)]);
  const posts = feed.posts || [];

  return (
    <main id="main">
      <PageHead
        label="From Facebook"
        title="Life at Higherlife, *as it happens*"
        body="Photos, announcements and moments from the church family, posted straight to our Facebook page."
        art="blessing-children"
      />

      <section className="section">
        <CrossMarks seed="facebook-index" />
        <div className="container facebook-band">
          {posts.length ? (
            <FacebookFeed
              posts={posts}
              limit={9}
              pageName={settings.church_name}
              avatar={settings.logo_url}
            />
          ) : settings.facebook_url ? (
            <FacebookFallback pageName={settings.church_name} avatar={settings.logo_url} />
          ) : null}

          {settings.facebook_url ? (
            <div className="hero-actions">
              <a
                className="btn btn-pill btn-pill-plum"
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow us on Facebook
                <MaterialIcon name="arrow_outward" />
              </a>
            </div>
          ) : posts ? null : (
            <div className="empty">No Facebook page is connected yet.</div>
          )}
        </div>
      </section>
    </main>
  );
}
