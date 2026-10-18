import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { getAlbums, getMedia, getSettings } from '@/lib/queries';

export const metadata = { title: 'Gallery' };

export default async function GalleryPage({ searchParams }) {
  const { album } = await searchParams;
  const [settings, media, albums] = await Promise.all([
    getSettings(),
    getMedia({ album: album || undefined, limit: 60 }),
    getAlbums(),
  ]);

  const names = albums.map((row) => row.album);

  return (
    <main>
      <PageHead
        label={settings.gallery_kicker}
        title="Life at *Highlife*"
        body="Photos from worship, fellowship, outreach and the church family."
      />

      <section className="section">
        <div className="container">
          {names.length > 1 ? (
            <div className="filters">
              <Link className="filter" data-active={!album} href="/gallery">
                All
              </Link>
              {names.map((name) => (
                <Link
                  key={name}
                  className="filter"
                  data-active={album === name}
                  href={`/gallery?album=${encodeURIComponent(name)}`}
                >
                  {name.replace(/^\w/, (c) => c.toUpperCase())}
                </Link>
              ))}
            </div>
          ) : null}

          {media.length ? (
            <div className="gallery-full">
              {media.map((item) => (
                <figure className="photo" key={item.id}>
                  <img src={item.url} alt={item.alt} loading="lazy" />
                  {item.caption || item.album ? (
                    <figcaption>{item.caption || item.album}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : (
            <div className="empty">No photos added yet.</div>
          )}
        </div>
      </section>
    </main>
  );
}
