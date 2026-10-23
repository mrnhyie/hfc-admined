import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';

export default function NotFoundBody() {
  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <div className="section-label">404</div>
          <h1>This page has moved or is not published yet.</h1>
          <p>Check the link, or start again from the home page.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Link className="btn btn-pill btn-pill-plum" href="/">
            Go to home
            <MaterialIcon name="arrow_forward" />
          </Link>
          <div className="social-row" style={{ marginTop: 22 }}>
            <Link href="/programs">Programs</Link>
            <Link href="/events">Events</Link>
            <Link href="/content">Sermons</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
