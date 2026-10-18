import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';

const label = (value) => (value || '').replace(/^\w/, (char) => char.toUpperCase());

function Meta({ program }) {
  if (!program.meeting_day && !program.venue) return null;
  return (
    <div className="meta-row">
      {program.meeting_day ? (
        <span>
          <MaterialIcon name="schedule" className="msvg-inline" />
          {program.meeting_day}
          {program.meeting_time ? ` · ${program.meeting_time}` : ''}
        </span>
      ) : null}
      {program.venue ? (
        <span>
          <MaterialIcon name="place" className="msvg-inline" />
          {program.venue}
        </span>
      ) : null}
    </div>
  );
}

export default function ProgramCard({ program, variant = 'row' }) {
  const href = `/programs/${program.slug}`;

  if (variant === 'schedule') {
    return (
      <article className="schedule-item">
        <div className="schedule-day">{program.meeting_day}</div>
        <div>
          <h3>
            <Link href={href}>{program.title}</Link>
          </h3>
          <p>{program.summary}</p>
        </div>
        <div className="schedule-when">
          <span className="schedule-time">{program.meeting_time || 'Time TBC'}</span>
          <Link className="link-inline" href={href} aria-label={`About ${program.title}`}>
            <MaterialIcon name="arrow_forward" />
          </Link>
        </div>
      </article>
    );
  }

  if (variant === 'feature') {
    return (
      <article className={program.cover_url ? 'ministry-feature' : 'ministry-feature ministry-feature-plain'}>
        {program.cover_url ? <img src={program.cover_url} alt="" loading="lazy" /> : null}
        <div className="ministry-feature-copy">
          <div className="section-label">{label(program.category)}</div>
          <h3>
            <Link href={href}>{program.title}</Link>
          </h3>
          <p>{program.summary}</p>
          <Link className="link-inline" href={href}>
            Explore this gathering
            <MaterialIcon name="arrow_forward" />
          </Link>
        </div>
      </article>
    );
  }

  const boxed = variant === 'boxed' && Boolean(program.cover_url);

  return (
    <article className={boxed ? 'ministry-row ministry-row-media' : 'ministry-row'}>
      {boxed ? <img src={program.cover_url} alt="" loading="lazy" /> : null}
      <div className="ministry-row-copy">
        <h3>
          <Link href={href}>{program.title}</Link>
        </h3>
        <p>{program.summary}</p>
        <Meta program={program} />
      </div>
    </article>
  );
}
