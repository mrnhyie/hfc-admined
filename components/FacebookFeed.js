import FacebookPostCard from '@/components/FacebookPostCard';

export default function FacebookFeed({ posts = [], limit = 9, pageName, avatar }) {
  const cards = posts.slice(0, limit);
  if (!cards.length) return null;

  return (
    <div className="fbp-grid">
      {cards.map((post) => (
        <FacebookPostCard key={post.id} post={post} pageName={pageName} avatar={avatar} />
      ))}
    </div>
  );
}
