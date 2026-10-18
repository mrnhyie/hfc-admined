import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHead from '@/components/PageHead';
import MaterialIcon from '@/components/MaterialIcon';
import { eventDateLine, formatDate } from '@/lib/dates';
import { POST_KIND_LABELS } from '@/lib/forms';
import { renderMarkdown } from '@/lib/markdown';
import { getPostBySlug } from '@/lib/queries';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post ? post.title : 'Content' };
}

export default async function ContentDetailPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const rows = [];

  if (post.series) {
    rows.push(
      <div className="detail" key="series">
        <MaterialIcon name="groups" />
        <div>
          <strong>Series</strong>
          <p>
            <Link href={`/content?series=${encodeURIComponent(post.series)}`}>{post.series}</Link>
          </p>
        </div>
      </div>,
    );
  }

  if (post.speaker) {
    rows.push(
      <div className="detail" key="speaker">
        <MaterialIcon name="self_improvement" />
        <div>
          <strong>Speaker</strong>
          <p>{post.speaker}</p>
        </div>
      </div>,
    );
  }

  if (post.event_slug) {
    rows.push(
      <div className="detail" key="event">
        <MaterialIcon name="calendar_today" />
        <div>
          <strong>Related event</strong>
          <p>
            <Link href={`/events/${post.event_slug}`}>
              {post.event_title}
              {post.event_starts_at ? ` · ${eventDateLine({ starts_at: post.event_starts_at })}` : ''}
            </Link>
          </p>
        </div>
      </div>,
    );
  }

  if (post.program_slug) {
    rows.push(
      <div className="detail" key="program">
        <MaterialIcon name="church" />
        <div>
          <strong>Related program</strong>
          <p>
            <Link href={`/programs/${post.program_slug}`}>{post.program_title}</Link>
          </p>
        </div>
      </div>,
    );
  }

  return (
    <main>
      <PageHead
        label={`${POST_KIND_LABELS[post.kind] || post.kind} · ${formatDate(post.published_at)}`}
        title={post.title}
        body={post.excerpt}
        crumbs={[{ href: '/content', label: 'Content' }]}
      />

      <section className="section">
        <div className="container">
          {post.video_url ? (
            <div className="sermon-main-image">
              {post.cover_url ? (
                <img src={post.cover_url} alt="" loading="lazy" />
              ) : (
                <div className="sermon-placeholder">{post.title}</div>
              )}
              <a
                className="play-button"
                href={post.video_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch ${post.title}`}
              >
                <MaterialIcon name="play_arrow" className="msvg-lg" />
              </a>
            </div>
          ) : post.cover_url ? (
            <div className="cover-frame">
              <img src={post.cover_url} alt="" loading="lazy" />
            </div>
          ) : null}

          {rows.length ? <div className="detail-grid">{rows}</div> : null}

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
          />

          {post.video_url ? (
            <div className="hero-actions">
              <a
                className="btn btn-line"
                href={post.video_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch the message
                <MaterialIcon name="arrow_outward" />
              </a>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
