import ContactForm from '@/components/ContactForm';
import CrossMarks from '@/components/CrossMarks';
import MaterialIcon from '@/components/MaterialIcon';
import PageHead from '@/components/PageHead';
import { getPrograms, getSettings } from '@/lib/queries';
import { socialLinks } from '@/lib/socials';

export const metadata = { title: 'Contact' };

export default async function ContactPage() {
  const [settings, programs] = await Promise.all([getSettings(), getPrograms({ scheduleOnly: true })]);
  const socials = socialLinks(settings);
  // An empty embed field is not a missing map — most locations are already
  // describable by their address, and then the pin can never drift from the
  // text an admin edits in Site settings.
  const mapSrc =
    settings.maps_embed_url ||
    (settings.address
      ? `https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&z=16&output=embed`
      : '');

  return (
    <main id="main">
      <PageHead
        label={settings.contact_kicker}
        title="We would love to *hear from you*"
        body={settings.contact_body}
        art="good-shepherd"
      />

      <section className="section">
        <CrossMarks seed="contact-form" />
        <div className="container contact-grid">
          <div className="contact-details">
            <div className="section-label">Where to find us</div>
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
                  <span>
                    {settings.hero_badge_one_value}. {settings.service_note}
                  </span>
                </div>
              </div>
            </div>

            {programs.length ? (
              <>
                <div className="section-label">Every week</div>
                <div className="schedule-list">
                  {programs.map((program) => (
                    <div className="schedule-item" key={program.id}>
                      <div className="schedule-day">{program.meeting_day}</div>
                      <div>
                        <h3>{program.title}</h3>
                      </div>
                      <div className="schedule-when">
                        <span className="schedule-time">{program.meeting_time || 'Time TBC'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

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

            {mapSrc ? (
              <div className="map-wrap">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="380"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={`${settings.church_name} location`}
                />
              </div>
            ) : (
              <div className="empty-map">{settings.address}</div>
            )}
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}
