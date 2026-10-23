/* Small bulletin crosses scattered through the light bands. The seed is the
   section's name, so the marks land in the same place on every request. */
const ART = ['brush', 'draped', 'geometric', 'heart'];

function unit(seed, salt) {
  let h = 2166136261;
  const text = `${seed}:${salt}`;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h << 13;
  h ^= h >>> 17;
  h ^= h << 5;
  return (h >>> 0) / 4294967295;
}

function between(seed, salt, min, max) {
  return Math.round(min + unit(seed, salt) * (max - min));
}

export default function CrossMarks({ seed, count = 2 }) {
  const flip = unit(seed, 'side') > 0.5;
  const marks = [
    {
      art: ART[Math.floor(unit(seed, 'art-a') * ART.length)],
      side: flip ? 'left' : 'right',
      top: `${between(seed, 'top-a', 2, 6)}%`,
      inset: `${between(seed, 'in-a', 2, 5)}%`,
      size: between(seed, 'sz-a', 54, 76),
      rotate: between(seed, 'rot-a', -10, 10),
    },
    {
      art: ART[Math.floor(unit(seed, 'art-b') * ART.length)],
      side: flip ? 'right' : 'left',
      bottom: `${between(seed, 'bot-b', 2, 7)}%`,
      inset: `${between(seed, 'in-b', 2, 5)}%`,
      size: between(seed, 'sz-b', 44, 64),
      rotate: between(seed, 'rot-b', -10, 10),
    },
    {
      art: ART[Math.floor(unit(seed, 'art-c') * ART.length)],
      side: 'right',
      top: `${between(seed, 'top-c', 38, 62)}%`,
      inset: `${between(seed, 'in-c', 1, 2)}%`,
      size: between(seed, 'sz-c', 58, 84),
      rotate: between(seed, 'rot-c', -8, 8),
      edge: true,
    },
  ].slice(0, count);

  return (
    <span className="cross-marks" aria-hidden="true">
      {marks.map((mark, index) => (
        <img
          key={index}
          className={mark.edge ? 'is-edge' : undefined}
          src={`/images/watermarks/cross-${mark.art}.png`}
          alt=""
          loading="lazy"
          style={{
            [mark.side]: mark.inset,
            top: mark.top,
            bottom: mark.bottom,
            width: `${mark.size}px`,
            transform: `rotate(${mark.rotate}deg)`,
          }}
        />
      ))}
    </span>
  );
}
