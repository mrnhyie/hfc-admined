import Link from 'next/link';
import ContentCard from '@/components/ContentCard';
import ContactForm from '@/components/ContactForm';
import Emphasise from '@/components/Emphasise';
import EventCard from '@/components/EventCard';
import MaterialIcon from '@/components/MaterialIcon';
import ProgramCard from '@/components/ProgramCard';
import SpeakerCard from '@/components/SpeakerCard';
import {
  getFactCounts,
  getMedia,
  getPosts,
  getPrograms,
  getSettings,
  getSpeakers,
  getUpcomingEvents,
} from '@/lib/queries';
import { socialLinks } from '@/lib/socials';

const initials = (name) =>
  (name || '')
    .split(/\s+/)
    .filter((word) => /[a-z]/i.test(word))
    .map((word) => word[0].toUpperCase())
    .join('')
    .slice(0, 3);

export default async function HomePage() {
  const [settings, programs, events, posts, media, counts, speakers] = await Promise.all([
    getSettings(),
    getPrograms(),
    getUpcomingEvents(4),
    getPosts({ limit: 4 }),
    getMedia({ limit: 8 }),
    getFactCounts(),
    getSpeakers({ limit: 6 }),
  ]);

  const scheduled = programs.filter((program) => program.meeting_day);
  const ministries = programs.filter((program) => !program.meeting_day);
  const [leadMinistry, ...otherMinistries] = ministries;
  const [nextEvent, ...laterEvents] = events;
  const [leadPost, ...otherPosts] = posts;

  const facts = counts;

  const socials = socialLinks(settings);

  return (
    <main id="home">
      <section className="hero">
        <div className="hero-media">
          <img src={settings.hero_image_url} alt={settings.church_name} />
        </div>
        <span className="blob blob-gold hero-blob-a drift" aria-hidden="true" />
        <span className="blob blob-gold hero-blob-b" aria-hidden="true" />
        <div className="container">
          <div className="hero-copy">
            {settings.hero_eyebrow ? <div className="section-label">{settings.hero_eyebrow}</div> : null}
            <h1>
              <Emphasise text={settings.hero_title} />
            </h1>
            <p>{settings.hero_body}</p>
            <div className="hero-actions">
              <Link className="btn btn-gold" href="/contact">
                Plan your visit
                <MaterialIcon name="arrow_forward" />
              </Link>
              <Link className="btn btn-outline" href="/programs">
                Discover our church
              </Link>
            </div>
            {settings.hero_note ? (
              <div className="hero-note">
                <span className="note-line" />
                <span>{settings.hero_note}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {facts.length ? (
        <section className="fact-band" aria-label="The church in numbers">
          <div className="container fact-grid">
            {facts.map((fact) => (
              <div className="fact" key={fact.label}>
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section" id="about">
        <div className="container story-grid">
          <div className="story-image">
            <img src={settings.about_image_url} alt={settings.church_short} loading="lazy" />
            {settings.about_tag ? (
              <div className="image-tag">
                <Emphasise text={settings.about_tag} />
              </div>
            ) : null}
          </div>
          <div className="story-copy">
            <div className="section-label">{settings.about_kicker}</div>
            <h2>{settings.about_title}</h2>
            <p>{settings.about_body}</p>
            <blockquote className="pull-quote">{settings.about_quote}</blockquote>
            <div className="signature">{settings.about_signature}</div>
            <p>
              <Link className="link-inline" href="/programs">
                Get to know our church
                <MaterialIcon name="arrow_forward" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {scheduled.length ? (
        <section className="section section-plum section-schedule" id="visit">
          {settings.schedule_bg_url ? (
            <div className="section-media" aria-hidden="true">
              <img src={settings.schedule_bg_url} alt="" />
            </div>
          ) : null}
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-label">{settings.schedule_kicker}</div>
                <h2 className="section-title">{settings.schedule_title}</h2>
              </div>
              <p className="section-note">{settings.service_note}</p>
            </div>
            <div className="schedule-list">
              {scheduled.map((program) => (
                <ProgramCard key={program.id} program={program} variant="schedule" />
              ))}
            </div>
            <div className="hero-actions">
              <Link className="btn btn-line" href="/contact">
                Directions &amp; contact
                <MaterialIcon name="place" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {ministries.length ? (
        <section className="section" id="programs">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-label">{settings.services_kicker}</div>
                <h2 className="section-title">{settings.services_title}</h2>
              </div>
              <Link className="section-link" href="/programs">
                All programs
                <MaterialIcon name="arrow_forward" />
              </Link>
            </div>

            {otherMinistries.length ? (
              <div className="ministry-layout">
                <ProgramCard program={leadMinistry} variant="feature" />
                <div className="ministry-side">
                  {otherMinistries.slice(0, 3).map((program) => (
                    <ProgramCard key={program.id} program={program} variant="boxed" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="feature-banner">
                {leadMinistry.cover_url ? <img src={leadMinistry.cover_url} alt="" loading="lazy" /> : null}
                <div className="feature-content">
                  <div className="section-label">{settings.services_kicker}</div>
                  <h2>{leadMinistry.title}</h2>
                  <p>{leadMinistry.summary}</p>
                  <Link className="btn btn-gold" href={`/programs/${leadMinistry.slug}`}>
                    Explore this ministry
                    <MaterialIcon name="arrow_forward" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="section section-plum" id="events">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-label">{settings.events_kicker}</div>
              <h2 className="section-title">{settings.events_title}</h2>
            </div>
            <Link className="section-link" href="/events">
              Full calendar
              <MaterialIcon name="arrow_forward" />
            </Link>
          </div>

          {nextEvent ? (
            <div className="event-list">
              {[nextEvent, ...laterEvents].map((event) => (
                <EventCard key={event.id} event={event} variant="row" />
              ))}
            </div>
          ) : (
            <div className="empty">Nothing on the calendar yet. Check back soon.</div>
          )}
        </div>
      </section>

      <section className="section" id="content">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-label">{settings.content_kicker}</div>
              <h2 className="section-title">{settings.content_title}</h2>
            </div>
            <Link className="section-link" href="/content">
              Browse all teaching
              <MaterialIcon name="arrow_forward" />
            </Link>
          </div>

          {leadPost ? (
            <div className="sermon-grid">
              <ContentCard post={leadPost} variant="feature" />
              {otherPosts.length ? (
                <div className="sermon-side">
                  {otherPosts.map((post) => (
                    <ContentCard key={post.id} post={post} variant="side" />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="empty">Sermons, announcements and notes will appear here.</div>
          )}
        </div>
      </section>

      {speakers.length ? (
        <section className="section" id="teachers">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-label">Who teaches</div>
                <h2 className="section-title">Preaching team</h2>
              </div>
              <Link className="section-link" href="/content">
                All teaching
                <MaterialIcon name="arrow_forward" />
              </Link>
            </div>
            <div className="speaker-grid">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.speaker} speaker={speaker} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section-ivory" id="gallery" data-mark={initials(settings.church_name)}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-label">{settings.gallery_kicker}</div>
              <h2 className="section-title">{settings.gallery_title}</h2>
            </div>
            <Link className="section-link" href="/gallery">
              Browse the gallery
              <MaterialIcon name="arrow_forward" />
            </Link>
          </div>

          {media.length >= 5 ? (
            <div className="gallery-grid">
              {media.slice(0, 5).map((item) => (
                <Link key={item.id} href="/gallery" aria-label={item.alt || item.caption || 'Open the gallery'}>
                  <img src={item.url} alt={item.alt} loading="lazy" />
                </Link>
              ))}
            </div>
          ) : media.length ? (
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
            <div className="empty">Photos from church life will show up here.</div>
          )}
        </div>
      </section>

      <section className="visit-cta" data-mark={initials(settings.church_short)}>
        <div className="container visit-inner">
          <div>
            <h2>{settings.cta_title}</h2>
            <p>{settings.cta_body}</p>
          </div>
          <div className="hero-actions">
            <Link className="btn btn-plum" href="/contact">
              Plan your visit
              <MaterialIcon name="arrow_forward" />
            </Link>
            {settings.give_url ? (
              <a
                className="btn btn-line"
                href={settings.give_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {settings.give_label}
                <MaterialIcon name="arrow_outward" />
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container contact-grid">
          <div className="contact-details">
            <div className="section-label">{settings.contact_kicker}</div>
            <h2>{settings.contact_title}</h2>
            <p>{settings.contact_body}</p>

            <div className="detail-grid">
              <div className="detail">
                <MaterialIcon name="place" />
                <div>
                  <strong>Location</strong>
                  <span>{settings.address}</span>
                </div>
              </div>
              <div className="detail">
                <MaterialIcon name="call" />
                <div>
                  <strong>Phone</strong>
                  <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
                </div>
              </div>
              <div className="detail">
                <MaterialIcon name="mail" />
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </div>
              </div>
              <div className="detail">
                <MaterialIcon name="church" />
                <div>
                  <strong>{settings.hero_badge_one_label}</strong>
                  <span>{settings.hero_badge_one_value}</span>
                </div>
              </div>
            </div>

            {socials.length ? (
              <>
                <div className="section-label">Find us online</div>
                <div className="social-row">
                  {socials.map((item) => (
                    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.label}
                      <MaterialIcon name="arrow_outward" className="msvg-inline" />
                    </a>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}
