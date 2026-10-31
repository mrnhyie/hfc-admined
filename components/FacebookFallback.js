export default function FacebookFallback({ pageName, avatar }) {
  return (
    <div className="facebook-page-card">
      <img src={avatar} alt="" loading="lazy" />
      <div>
        <strong>{pageName}</strong>
        <span>Photos, announcements and moments are posted on our Facebook page.</span>
      </div>
    </div>
  );
}
