import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import PageHead from '@/components/PageHead';
import ProgramCard from '@/components/ProgramCard';
import { getPrograms, getSettings } from '@/lib/queries';

export const metadata = { title: 'Programs' };

export default async function ProgramsPage() {
  const [settings, programs] = await Promise.all([getSettings(), getPrograms()]);
  const scheduled = programs.filter((program) => program.meeting_day);
  const rest = programs.filter((program) => !program.meeting_day);
  const lead = rest.find((program) => program.featured && program.cover_url);
  const others = lead ? rest.filter((program) => program.id !== lead.id) : rest;

  return (
    <main>
      <PageHead
        label={settings.services_kicker}
        title="Programs & *ministries*"
        body="Everything the church runs, from weekly services to conferences and outreach."
      />

      {scheduled.length ? (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-label">Every week</div>
                <h2 className="section-title">Weekly rhythm</h2>
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

      {lead ? (
        <section className="section section-ivory">
          <div className="container">
            <div className="feature-banner">
              <img src={lead.cover_url} alt="" loading="lazy" />
              <div className="feature-content">
                <div className="section-label">Featured ministry</div>
                <h2>{lead.title}</h2>
                <p>{lead.summary}</p>
                <Link className="btn btn-gold" href={`/programs/${lead.slug}`}>
                  Read more
                  <MaterialIcon name="arrow_forward" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {others.length ? (
        <section className="section" id="ministries">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-label">Beyond the weekly services</div>
                <h2 className="section-title">{settings.services_title}</h2>
              </div>
              <p className="section-note">
                Every gathering has a place for you, whatever stage you are at.
              </p>
            </div>
            <div className="ministry-list">
              {others.map((program) => (
                <ProgramCard key={program.id} program={program} variant="boxed" />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {!programs.length ? (
        <section className="section">
          <div className="container">
            <div className="empty">No programs published yet.</div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
