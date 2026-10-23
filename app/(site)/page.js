import Link from 'next/link';
import ContentCard from '@/components/ContentCard';
import ContactForm from '@/components/ContactForm';
import CrossMarks from '@/components/CrossMarks';
import Emphasise from '@/components/Emphasise';
import EventCard from '@/components/EventCard';
import MaterialIcon from '@/components/MaterialIcon';
import ProgramCard from '@/components/ProgramCard';
import SpeakerCard from '@/components/SpeakerCard';
import Watermark from '@/components/Watermark';
import {
  getFactCounts,
  getLatestSermon,
  getMedia,
  getPosts,
  getPrograms,
  getSettings,
  getSpeakers,
  getUpcomingEvents,
} from '@/lib/queries';
import { socialLinks } from '@/lib/socials';

/* Standing invitations rather than church content: these are the three doors
   into the site, so they live in code next to the nav, not in the database. */
const AUDIENCES = [
  { icon: 'groups', tone: 'plum', title: 'For You', note: 'Grow in faith and purpose.', href: '/content' },
  {
    icon: 'auto_stories',
    tone: 'gold',
    title: 'For Your Family',
    note: 'Resources and support for every stage.',
    href: '/programs',
  },
  { icon: 'favorite', tone: 'plum', title: 'For Our Community', note: 'Love God, love people.', href: '/contact' },
];

export default async function HomePage() {
  const [settings, programs, events, posts, media, counts, speakers, sermon] = await Promise.all([
    getSettings(),
    getPrograms(),
    getUpcomingEvents(4),
    getPosts({ limit: 4 }),
    getMedia({ limit: 8 }),
    getFactCounts(),
    getSpeakers({ limit: 6 }),
    getLatestSermon(),
  ]);

  const scheduled = programs.filter((program) => program.meeting_day);
  const ministries = programs.filter((program) => !program.meeting_day);
  const [leadMinistry, ...otherMinistries] = ministries;
  const [nextEvent, ...laterEvents] = events;
  const [leadPost, ...otherPosts] = posts;

  const facts = counts;

  const socials = socialLinks(settings);

  return (
    <main id="main">
      <section className="hero">
        <div className="hero-media">
          <img src={settings.hero_image_url} alt={settings.church_name} />
        </div>
        <div className="container hero-inner">
          {sermon ? (
            <Link className="hero-play" href={`/content/${sermon.slug}`} aria-label={`Watch ${sermon.title}`}>
              <span className="hero-play-disc">
                <MaterialIcon name="play_arrow" />
              </span>
              <span className="hero-play-note">Watch the last message</span>
            </Link>
          ) : null}

          {settings.hero_eyebrow ? <p className="hero-script">{settings.hero_eyebrow}</p> : null}
          <h1>
            <Emphasise text={settings.hero_title} />
          </h1>
          <p className="hero-lede">{settings.hero_body}</p>
          <div className="hero-actions">
            <Link className="btn btn-pill" href="/contact">
              Plan your visit
            </Link>
            <Link className="btn btn-pill" href="/programs">
              Explore our church
            </Link>
          </div>
        </div>
        {/* The reference tears the photograph open into the white page rather than
            closing it on a straight rule. */}
        <span className="hero-tear" aria-hidden="true" />
      </section>

      {/* Two decisions, one gold rule between them: when to come, and where to
          belong. Both lines are the church's own settings text. */}
      <section className="split-band" aria-label="Visiting and belonging">
        <div className="container split-inner">
          <div className="split-cell">
            <h2>{settings.hero_badge_one_label}</h2>
            <p>
              {settings.hero_badge_one_value}
              <br />
              {settings.address}
            </p>
            <Link className="btn btn-pill btn-pill-plum" href="/contact">
              Start here
            </Link>
          </div>

          <span className="split-rule" aria-hidden="true" />

          <div className="split-cell">
            <h2>{settings.hero_badge_two_label}</h2>
            <p>{settings.hero_note}</p>
            <Link className="btn btn-pill btn-pill-plum" href="/programs">
              Find your group
            </Link>
          </div>
        </div>
      </section>

      <section className="section belong" id="belong">
        <CrossMarks seed="home-belong" />
        <div className="container belong-grid">
          <div className="belong-head">
            <div className="section-label">{settings.hero_badge_two_label}</div>
            <h2>
              Find your place
              <br />
              in the family.
            </h2>
            <span className="rule-gold" aria-hidden="true" />
          </div>
          <div className="belong-cards">
            {AUDIENCES.map((item) => (
              <Link className="belong-card" key={item.title} href={item.href}>
                <span className={`belong-well is-${item.tone}`}>
                  <MaterialIcon name={item.icon} />
                </span>
                <span className="belong-text">
                  <strong>{item.title}</strong>
                  <span>{item.note}</span>
                </span>
                <MaterialIcon name="arrow_forward" className="belong-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mission">
        <Watermark art="ascension" />
        <div className="container mission-inner">
          <div className="mission-media">
            <img
              src={media[0]?.url || settings.about_image_url}
              alt={media[0]?.alt || settings.church_short}
              loading="lazy"
            />
          </div>
          <div className="mission-copy">
            <div className="section-label">Our mission</div>
            <p>{settings.about_tag}</p>
            <Link className="link-inline" href="/programs">
              Learn more
              <MaterialIcon name="arrow_forward" />
            </Link>
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

      <section className="section section-story" id="about">
        <Watermark art="blessing-children" />
        <div className="container story-grid">
          <div className="story-image">
            <img src={settings.about_image_url} alt={settings.church_short} loading="lazy" />
          </div>
          <div className="story-copy">
            <div className="section-label">{settings.about_kicker}</div>
            <h2>{settings.about_title}</h2>
            <span className="rule-gold" aria-hidden="true" />
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
              <Link className="btn btn-pill" href="/contact">
                Directions &amp; contact
                <MaterialIcon name="place" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {ministries.length ? (
        <section className="section" id="programs">
          <CrossMarks seed="home-programs" />
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
                  <Link className="btn btn-pill btn-pill-gold" href={`/programs/${leadMinistry.slug}`}>
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
        <CrossMarks seed="home-content" />
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
          <CrossMarks seed="home-teachers" />
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

      <section className="section section-ivory" id="gallery">
        <CrossMarks seed="home-gallery" />
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

      <section className="visit-cta">
        <div className="container visit-inner">
          <div>
            <h2>{settings.cta_title}</h2>
            <p>{settings.cta_body}</p>
          </div>
          <div className="hero-actions">
            <Link className="btn btn-pill btn-pill-gold" href="/contact">
              Plan your visit
              <MaterialIcon name="arrow_forward" />
            </Link>
            {settings.give_url ? (
              <a
                className="btn btn-pill"
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
        <CrossMarks seed="home-contact" />
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
