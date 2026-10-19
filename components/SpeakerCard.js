import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';

const initials = (name) =>
  (name || '')
    .split(/\s+/)
    .filter((word) => /[a-z]/i.test(word))
    .map((word) => word[0].toUpperCase())
    .join('')
    .slice(0, 3);

export default function SpeakerCard({ speaker }) {
  const lessons = Number(speaker.sermons);

  return (
    <article className="speaker-card">
      {speaker.cover_url ? (
        <div className="speaker-media">
          <img src={speaker.cover_url} alt="" loading="lazy" />
        </div>
      ) : (
        <div className="speaker-media speaker-media-mark" aria-hidden="true">
          {initials(speaker.speaker)}
        </div>
      )}
      <div className="speaker-body">
        <h3>{speaker.speaker}</h3>
        <p className="speaker-count">
          {lessons === 1 ? '1 message' : `${lessons} messages`}
        </p>
        {speaker.latest_title ? (
          <Link className="speaker-latest" href={`/content/${speaker.latest_slug}`}>
            <span>Latest</span>
            {speaker.latest_title}
            <MaterialIcon name="arrow_forward" className="msvg-inline" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
