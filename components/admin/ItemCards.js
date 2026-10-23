import Link from 'next/link';
import DeleteForm from '@/components/admin/DeleteForm';
import MaterialIcon from '@/components/MaterialIcon';
import { eventDateStack, formatDate, formatTime } from '@/lib/dates';
import { POST_KIND_LABELS } from '@/lib/forms';

const POST_ICONS = { sermon: 'smart_display', announcement: 'public', devotional: 'auto_stories' };

function Status({ published }) {
  return (
    <span className={published ? 'pill pill-published card-shot-flag' : 'pill pill-draft card-shot-flag'}>
      {published ? 'published' : 'draft'}
    </span>
  );
}

/* The shot is what makes these read as products rather than table rows: the
   entity's own image when it has one, and a plate carrying its identifying
   mark — date, icon, kind — when it does not. The status rides the corner of
   the shot the way a sale flag rides a product photo. */
function Shot({ src, alt, badge, children }) {
  return (
    <div className="card-shot">
      {src ? <img src={src} alt={alt || ''} loading="lazy" /> : <div className="card-shot-plate">{children}</div>}
      {badge}
    </div>
  );
}

function Actions({ item, viewHref, editHref, deleteAction, deleteLabel = 'Delete', watchHref, extra }) {
  return (
    <div className="card-foot">
      <div className="card-note">{extra}</div>
      <div className="card-actions">
        {watchHref ? (
          <a className="btn-ghost" href={watchHref} target="_blank" rel="noopener noreferrer">
            Watch
          </a>
        ) : null}
        {viewHref ? (
          <a className="btn-ghost" href={viewHref} target="_blank" rel="noopener noreferrer">
            View
          </a>
        ) : null}
        <Link className="btn-ghost" href={editHref}>
          Edit
        </Link>
        {deleteAction ? (
          <DeleteForm
            action={deleteAction}
            id={item.id}
            label={deleteLabel}
            message={`Delete “${item.title || item.caption || 'this photo'}”? This cannot be undone.`}
          />
        ) : null}
      </div>
    </div>
  );
}

export function EventItemCard({ event, deleteAction }) {
  const date = eventDateStack(event);
  const isNext = new Date(event.starts_at).getTime() >= Date.now();

  return (
    <article className={`event-row ${isNext ? '' : 'is-past'}`}>
      <div className="event-row-date">
        <span>{date.month}</span>
        <strong>{date.day}</strong>
        <em>{date.weekday}</em>
      </div>

      <div className="event-row-text">
        <p className="event-row-kicker">
          {isNext ? 'Upcoming' : 'Past'}
          {event.featured ? <span className="event-row-featured">Featured</span> : null}
        </p>
        <h3>
          <Link href={`/admin/events/${event.id}`}>{event.title}</Link>
        </h3>
        <p className="event-row-meta">
          {[event.all_day ? 'All day' : formatTime(event.starts_at), event.venue].filter(Boolean).join(' · ')}
        </p>
      </div>

      <div className="event-row-side">
        <span className={event.published ? 'pill pill-published' : 'pill pill-draft'}>
          {event.published ? 'published' : 'draft'}
        </span>
        <div className="card-actions">
          <a className="btn-ghost" href={`/events/${event.slug}`} target="_blank" rel="noopener noreferrer">
            View
          </a>
          <Link className="btn-ghost" href={`/admin/events/${event.id}`}>
            Edit
          </Link>
          <DeleteForm action={deleteAction} id={event.id} message={`Delete “${event.title}”? This cannot be undone.`} />
        </div>
      </div>
    </article>
  );
}

export function ProgramItemCard({ program, deleteAction }) {
  return (
    <article className="entity-card">
      <Shot src={program.cover_url} alt={program.title} badge={<Status published={program.published} />}>
        <MaterialIcon name={program.icon || 'church'} className="card-shot-mark" />
        {program.category ? <span className="card-shot-when">{program.category}</span> : null}
      </Shot>

      <div className="card-info">
        <p className="card-meta">
          {program.meeting_day ? [program.meeting_day, program.meeting_time].filter(Boolean).join(' · ') : 'Ministry'}
        </p>

        <h3>{program.title}</h3>

        <Actions
          item={program}
          viewHref={`/programs/${program.slug}`}
          editHref={`/admin/programs/${program.id}`}
          deleteAction={deleteAction}
          extra={
            <span className="card-meta">
              {[program.venue, `Order ${program.sort_order}`].filter(Boolean).join(' · ')}
            </span>
          }
        />
      </div>
    </article>
  );
}

export function PostItemCard({ post, deleteAction }) {
  return (
    <article className="entity-card">
      <Shot src={post.cover_url} alt={post.title} badge={<Status published={post.published} />}>
        <MaterialIcon name={POST_ICONS[post.kind] || 'auto_stories'} className="card-shot-mark" />
        <span className="card-shot-when">{POST_KIND_LABELS[post.kind] || post.kind}</span>
      </Shot>

      <div className="card-info">
        {post.series || post.speaker ? (
          <p className="card-meta">{[post.series, post.speaker].filter(Boolean).join(' · ')}</p>
        ) : null}

        <h3>{post.title}</h3>
        <p className="card-body">{post.excerpt || 'No summary yet.'}</p>

        <Actions
          item={post}
          viewHref={`/content/${post.slug}`}
          editHref={`/admin/content/${post.id}`}
          deleteAction={deleteAction}
          watchHref={post.kind === 'sermon' ? post.video_url : null}
          extra={
            <span className="card-meta">
              {[formatDate(post.published_at), post.event_title || post.program_title].filter(Boolean).join(' · ')}
            </span>
          }
        />
      </div>
    </article>
  );
}

export function MediaItemCard({ item, deleteAction }) {
  return (
    <article className="entity-card">
      <Shot src={item.url} alt={item.alt} />

      <div className="card-info">
        <p className="card-meta">{item.album}</p>

        <h3>{item.caption || item.alt}</h3>

        <Actions
          item={item}
          viewHref="/gallery"
          editHref={`/admin/media/${item.id}`}
          deleteAction={deleteAction}
          deleteLabel="Remove"
          extra={<span className="card-meta">Order {item.sort_order}</span>}
        />
      </div>
    </article>
  );
}

export function MessageItemCard({ message, markAction }) {
  return (
    <article className="entity-card">
      <div className="card-info">
        <div className="entity-card-top">
          <h3>{message.name}</h3>
          <span className={message.status === 'new' ? 'pill pill-new card-status' : 'pill pill-draft card-status'}>
            {message.status}
          </span>
        </div>

        <p className="card-meta">{message.phone ? `${message.email} · ${message.phone}` : message.email}</p>
        <p className="card-body card-body-pre">{message.body}</p>

        <div className="card-foot">
          <div className="card-note">
            <span className="card-meta">
              Received {formatDate(message.created_at, { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
          <div className="card-actions">
            <a className="btn-ghost" href={`mailto:${message.email}`}>
              Reply
            </a>
            {message.status !== 'read' ? (
              <form action={markAction}>
                <input type="hidden" name="id" value={message.id} />
                <input type="hidden" name="status" value="read" />
                <button className="btn-ghost" type="submit">
                  Mark read
                </button>
              </form>
            ) : null}
            {message.status !== 'archived' ? (
              <form action={markAction}>
                <input type="hidden" name="id" value={message.id} />
                <input type="hidden" name="status" value="archived" />
                <button className="btn-ghost" type="submit">
                  Archive
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
