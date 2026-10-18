import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import { formatDate } from '@/lib/dates';
import { POST_KIND_LABELS } from '@/lib/forms';

const label = (value) => (value || '').replace(/^\w/, (char) => char.toUpperCase());

function metaLine(post) {
  return [
    POST_KIND_LABELS[post.kind] || label(post.kind),
    post.series,
    formatDate(post.published_at),
  ]
    .filter(Boolean)
    .join(' · ');
}

function actionLabel(post) {
  return post.video_url ? 'Watch the message' : 'Read the note';
}

export default function ContentCard({ post, variant = 'archive' }) {
  const href = `/content/${post.slug}`;

  if (variant === 'feature') {
    return (
      <article className="sermon-main">
        <div className="sermon-main-image">
          {post.cover_url ? (
            <img src={post.cover_url} alt="" loading="lazy" />
          ) : (
            <div className="sermon-placeholder">{post.title}</div>
          )}
          {post.video_url ? (
            <a
              className="play-button"
              href={post.video_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${post.title}`}
            >
              <MaterialIcon name="play_arrow" className="msvg-lg" />
            </a>
          ) : null}
        </div>
        <div className="sermon-meta">{metaLine(post)}</div>
        <h3>
          <Link href={href}>{post.title}</Link>
        </h3>
        <p>{post.excerpt || 'Read the full note.'}</p>
        {post.speaker ? (
          <div className="meta-row">
            <span>
              <MaterialIcon name="self_improvement" className="msvg-inline" />
              {post.speaker}
            </span>
          </div>
        ) : null}
        <Link className="link-inline" href={href}>
          {actionLabel(post)}
          <MaterialIcon name="arrow_forward" />
        </Link>
      </article>
    );
  }

  if (variant === 'side') {
    return (
      <article className="sermon-side-item">
        <div className="sermon-meta">{metaLine(post)}</div>
        <h3>
          <Link href={href}>{post.title}</Link>
        </h3>
        <p>{post.excerpt || 'Read the full note.'}</p>
        <Link className="link-inline" href={href}>
          {actionLabel(post)}
          <MaterialIcon name="arrow_forward" />
        </Link>
      </article>
    );
  }

  return (
    <article className="archive-card">
      {post.cover_url ? (
        <img src={post.cover_url} alt="" loading="lazy" />
      ) : (
        <div className="archive-cover">{post.title}</div>
      )}
      <div className="archive-date">{metaLine(post)}</div>
      <h3>
        <Link href={href}>{post.title}</Link>
      </h3>
      <p>{post.excerpt || 'Read the full note.'}</p>
      <Link className="link-inline" href={href}>
        {actionLabel(post)}
        <MaterialIcon name="arrow_forward" />
      </Link>
    </article>
  );
}
