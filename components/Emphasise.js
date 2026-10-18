export default function Emphasise({ text }) {
  return (text || '')
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, index) =>
      part.startsWith('*') && part.endsWith('*') ? (
        <em key={index}>{part.slice(1, -1)}</em>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
}
