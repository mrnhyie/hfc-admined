import Link from 'next/link';
import ContentCard from '@/components/ContentCard';
import PageHead from '@/components/PageHead';
import { POST_KIND_LABELS, POST_KINDS } from '@/lib/forms';
import { getPosts, getSeries, getSettings } from '@/lib/queries';

export const metadata = { title: 'Sermons & Content' };

export default async function ContentPage({ searchParams }) {
  const { kind, series } = await searchParams;
  const selectedKind = POST_KINDS.includes(kind) ? kind : '';
  const selectedSeries = series || '';

  const [settings, posts, allSeries] = await Promise.all([
    getSettings(),
    getPosts({ limit: 40, kind: selectedKind || undefined, series: selectedSeries || undefined }),
    getSeries(),
  ]);

  const buildHref = (next) => {
    const params = new URLSearchParams();
    if (next.kind) params.set('kind', next.kind);
    if (next.series) params.set('series', next.series);
    const q = params.toString();
    return q ? `/content?${q}` : '/content';
  };

  return (
    <main>
      <PageHead
        label={settings.content_kicker}
        title="Teaching, *news* & notes"
        body="Sermons, devotionals and announcements from our programmes and events."
      />

      <section className="section">
        <div className="container">
          <div className="filters">
            <Link className="filter" data-active={!selectedKind && !selectedSeries} href="/content">
              All
            </Link>
            {POST_KINDS.map((name) => (
              <Link
                key={name}
                className="filter"
                data-active={selectedKind === name}
                href={buildHref({ kind: name })}
              >
                {POST_KIND_LABELS[name]}
              </Link>
            ))}
          </div>

          {allSeries.length ? (
            <div className="filters">
              {allSeries.map((row) => (
                <Link
                  key={row.series}
                  className="filter"
                  data-active={selectedSeries === row.series}
                  href={buildHref({ kind: selectedKind, series: row.series })}
                >
                  {row.series} ({row.posts})
                </Link>
              ))}
            </div>
          ) : null}

          {posts.length ? (
            <div className="archive-list">
              {posts.map((post) => (
                <ContentCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty">Nothing published under this filter yet.</div>
          )}
        </div>
      </section>
    </main>
  );
}
