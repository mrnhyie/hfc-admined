export default function Watermark({ art }) {
  return (
    <span
      aria-hidden="true"
      className="watermark"
      style={{ backgroundImage: `url(/images/watermarks/${art}.jpg)` }}
    />
  );
}
