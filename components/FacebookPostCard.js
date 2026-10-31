import BrandIcon from '@/components/BrandIcon';
import MaterialIcon from '@/components/MaterialIcon';
import { facebookDateLine } from '@/lib/facebook';

/* One Facebook post, rebuilt with Facebook's own chrome: page header, caption,
   photograph, reaction strip. The whole card is a single link to the original
   post, with the visible content kept in the DOM so the photo keeps its alt
   text and the caption stays readable. */
export default function FacebookPostCard({ post, pageName, avatar }) {
  const caption = post.message || '';
  const date = facebookDateLine(post.created);
  const linked = Boolean(post.href);
  const reactions = Number(post.reactions) > 0 ? Number(post.reactions) : null;
  const alt = post.imageAlt || caption.slice(0, 160) || `${pageName} on Facebook`;
  const label = caption
    ? `View this ${pageName} post on Facebook: ${caption.slice(0, 90)}`
    : `View this ${pageName} post from ${date} on Facebook`;

  return (
    <article className={linked ? 'fbp-card is-linked' : 'fbp-card'}>
      <header className="fbp-head">
        <img className="fbp-avatar" src={avatar} alt="" loading="lazy" />
        <div className="fbp-who">
          <strong>{pageName}</strong>
          <span>
            {date}
            <MaterialIcon name="public" className="fbp-globe" />
          </span>
        </div>
        <BrandIcon name="facebook" />
      </header>

      {caption ? <p className="fbp-text">{caption}</p> : null}

      {post.image ? (
        <div className="fbp-media">
          <img src={post.image} alt={alt} loading="lazy" />
          {post.video ? (
            <span className="fbp-play" aria-hidden="true">
              <MaterialIcon name="play_arrow" />
            </span>
          ) : null}
        </div>
      ) : null}

      <footer className="fbp-foot">
        {reactions ? (
          <span className="fbp-count">
            <span className="fbp-reacts" aria-hidden="true">
              <i className="is-like">
                <MaterialIcon name="thumb_up" />
              </i>
              <i className="is-love">
                <MaterialIcon name="favorite" />
              </i>
            </span>
            {reactions.toLocaleString('en-US')}
            <span className="fbp-sr">reactions</span>
          </span>
        ) : (
          <span />
        )}
        {linked ? (
          <span className="fbp-open">
            View post
            <MaterialIcon name="arrow_outward" />
          </span>
        ) : null}
      </footer>

      {linked ? (
        <a
          className="fbp-link"
          href={post.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        />
      ) : null}
    </article>
  );
}
