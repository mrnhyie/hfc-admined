import Link from 'next/link';
import DeleteForm from '@/components/admin/DeleteForm';
import MaterialIcon from '@/components/MaterialIcon';
import { eventDateStack, formatDate, formatTime } from '@/lib/dates';
import { POST_KIND_LABELS } from '@/lib/forms';

function Status({ published }) {
  return (
    <span className={published ? 'pill pill-published card-status' : 'pill pill-draft card-status'}>
      {published ? 'published' : 'draft'}
    </span>
  );
}

function Actions({ item, viewHref, editHref, deleteAction, deleteLabel = 'Delete', extra }) {
  return (
    <div className="card-foot">
      <div className="card-note">{extra}</div>
      <div className="card-actions">
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
    <article className="entity-card card-event">
      <div className="card-date">
        <strong>{date.day}</strong>
        <span>{date.month}</span>
        <span>{date.weekday}</span>
      </div>

      <div className="card-stack">
        <div className="entity-card-top">
          <p className="card-meta">{isNext ? 'Upcoming' : 'Past'}</p>
          <Status published={event.published} />
        </div>

        <h3>{event.title}</h3>
        <p className="card-meta">
          {[event.all_day ? 'All day' : formatTime(event.starts_at), event.venue].filter(Boolean).join(' · ')}
        </p>

        <Actions
          item={event}
          viewHref={`/events/${event.slug}`}
          editHref={`/admin/events/${event.id}`}
          deleteAction={deleteAction}
          extra={<span className="card-meta">{event.featured ? 'Featured on home' : 'Not featured'}</span>}
        />
      </div>
    </article>
  );
}

export function ProgramItemCard({ program, deleteAction }) {
  return (
    <article className="entity-card">
      <div className="entity-card-top">
        <span className="card-icon">
          <MaterialIcon name={program.icon || 'church'} />
        </span>
        <Status published={program.published} />
      </div>

      <h3>{program.title}</h3>
      <p className="card-meta">
        {program.meeting_day
          ? [program.meeting_day, program.meeting_time].filter(Boolean).join(' · ')
          : 'Ministry'}
      </p>

      <Actions
        item={program}
        viewHref={`/programs/${program.slug}`}
        editHref={`/admin/programs/${program.id}`}
        deleteAction={deleteAction}
        extra={
          <span className="card-meta">
            {[program.category, `Order ${program.sort_order}`].filter(Boolean).join(' · ')}
          </span>
        }
      />
    </article>
  );
}

export function PostItemCard({ post, deleteAction }) {
  return (
    <article className="entity-card">
      <div className="entity-card-top">
        <p className="card-meta">{POST_KIND_LABELS[post.kind] || post.kind}</p>
        <Status published={post.published} />
      </div>

      <h3>{post.title}</h3>
      <p className="card-meta">
        {[post.series, post.speaker].filter(Boolean).join(' · ') || 'No series or speaker set'}
      </p>
      <p className="card-body">{post.excerpt || 'No summary yet.'}</p>

      <Actions
        item={post}
        viewHref={`/content/${post.slug}`}
        editHref={`/admin/content/${post.id}`}
        deleteAction={deleteAction}
        extra={
          <span className="card-meta">
            {[formatDate(post.published_at), post.event_title || post.program_title].filter(Boolean).join(' · ')}
          </span>
        }
      />
    </article>
  );
}

export function MediaItemCard({ item, deleteAction }) {
  return (
    <article className="entity-card card-media">
      <img className="card-photo" src={item.url} alt={item.alt} />

      <h3>{item.caption || item.alt}</h3>
      <p className="card-meta">{item.album}</p>

      <Actions
        item={item}
        viewHref="/gallery"
        editHref={`/admin/media/${item.id}`}
        deleteAction={deleteAction}
        deleteLabel="Remove"
        extra={<span className="card-meta">Order {item.sort_order}</span>}
      />
    </article>
  );
}

export function MessageItemCard({ message, markAction }) {
  return (
    <article className="entity-card">
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
    </article>
  );
}
