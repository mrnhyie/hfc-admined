import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContentCard from '@/components/ContentCard';
import CrossMarks from '@/components/CrossMarks';
import MaterialIcon from '@/components/MaterialIcon';
import PageHead from '@/components/PageHead';
import { renderMarkdown } from '@/lib/markdown';
import { getPosts, getProgramBySlug } from '@/lib/queries';

const label = (value) => (value || '').replace(/^\w/, (char) => char.toUpperCase());

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  return { title: program ? program.title : 'Program' };
}

export default async function ProgramDetailPage({ params }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  const posts = await getPosts({ programId: program.id, limit: 6 });
  const rows = [];

  if (program.meeting_day) {
    rows.push(
      <div className="detail" key="meets">
        <MaterialIcon name="schedule" />
        <div>
          <strong>Meets</strong>
          <p>
            {program.meeting_day}
            {program.meeting_time ? ` · ${program.meeting_time}` : ''}
          </p>
        </div>
      </div>,
    );
  }

  if (program.venue) {
    rows.push(
      <div className="detail" key="where">
        <MaterialIcon name="place" />
        <div>
          <strong>Where</strong>
          <p>{program.venue}</p>
        </div>
      </div>,
    );
  }

  return (
    <main id="main">
      <PageHead
        label={label(program.category)}
        title={program.title}
        body={program.summary}
        crumbs={[{ href: '/programs', label: 'Programs' }]}
        art="good-shepherd"
      />

      <section className="section">
        <CrossMarks seed={`program-${program.slug}`} />
        <div className="container">
          {program.cover_url && rows.length ? (
            <div className="simple-grid">
              <img src={program.cover_url} alt="" loading="lazy" />
              <div className="detail-grid">{rows}</div>
            </div>
          ) : (
            <>
              {program.cover_url ? (
                <div className="cover-frame">
                  <img src={program.cover_url} alt="" loading="lazy" />
                </div>
              ) : null}
              {rows.length ? <div className="detail-grid">{rows}</div> : null}
            </>
          )}

          {program.body ? (
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(program.body) }}
            />
          ) : null}
        </div>
      </section>

      {posts.length ? (
        <section className="section section-ivory">
          <CrossMarks seed={`program-${program.slug}-related`} />
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-label">Related content</div>
                <h2 className="section-title">Notes &amp; updates</h2>
              </div>
              <Link className="section-link" href="/content">
                All content
                <MaterialIcon name="arrow_forward" />
              </Link>
            </div>
            <div className="archive-list">
              {posts.map((post) => (
                <ContentCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
