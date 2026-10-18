import AdminHead from '@/components/admin/AdminHead';
import { MessageItemCard } from '@/components/admin/ItemCards';
import { markMessage } from '@/app/admin/actions';
import { getMessageCounts, listMessages } from '@/lib/queries';

export const metadata = { title: 'Messages — Admin' };

const FILTERS = [
  { key: '', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'read', label: 'Read' },
  { key: 'archived', label: 'Archived' },
];

export default async function AdminMessagesPage({ searchParams }) {
  const { status } = await searchParams;
  const selected = FILTERS.some((filter) => filter.key === status) ? status : '';
  const [messages, counts] = await Promise.all([
    listMessages({ status: selected || undefined }),
    getMessageCounts(),
  ]);

  return (
    <>
      <AdminHead kicker="From the contact form" title="Messages">
        <p>
          {counts.new_count} new · {counts.total} total
        </p>
      </AdminHead>

      <div className="admin-filters">
        {FILTERS.map((filter) => (
          <a
            key={filter.key}
            href={filter.key ? `/admin/messages?status=${filter.key}` : '/admin/messages'}
            className={selected === filter.key ? 'pill pill-new' : 'pill pill-draft'}
          >
            {filter.label}
          </a>
        ))}
      </div>

      {messages.length ? (
        <div className="card-list">
          {messages.map((message) => (
            <MessageItemCard key={message.id} message={message} markAction={markMessage} />
          ))}
        </div>
      ) : (
        <div className="card-empty">
          {selected ? `No ${selected} messages.` : 'No messages yet. Notes from the contact form land here.'}
          <a href="/contact">See the contact form</a>
        </div>
      )}
    </>
  );
}
