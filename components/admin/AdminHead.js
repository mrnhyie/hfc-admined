export default function AdminHead({ kicker, title, subtitle, children }) {
  return (
    <div className="admin-head">
      <div className="admin-head-text">
        {kicker ? <div className="admin-kicker">{kicker}</div> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}
