export default function AdminHead({ kicker, title, children }) {
  return (
    <div className="admin-head">
      <div>
        <div className="admin-kicker">{kicker}</div>
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  );
}
