import Link from 'next/link';
import Emphasise from '@/components/Emphasise';

export default function PageHead({ label, title, body, crumbs = [] }) {
  return (
    <header className="page-hero">
      <div className="container">
        {crumbs.length ? (
          <div className="crumbs">
            <Link href="/">Home</Link>
            {crumbs.map((crumb) => (
              <span key={crumb.href}>
                {' / '}
                <Link href={crumb.href}>{crumb.label}</Link>
              </span>
            ))}
          </div>
        ) : null}
        {label ? <div className="section-label">{label}</div> : null}
        <h1>
          <Emphasise text={title} />
        </h1>
        {body ? <p>{body}</p> : null}
      </div>
    </header>
  );
}
