import AdminHead from '@/components/admin/AdminHead';
import { MonthCalendarCard } from '@/components/admin/CalendarCards';
import { MessageItemCard } from '@/components/admin/ItemCards';
import { markMessage } from '@/app/admin/actions';
import { toDateInputValue } from '@/lib/dates';
import { getMessageCounts, listMessages } from '@/lib/queries';

export const metadata = { title: 'Messages — Admin' };

const FILTERS = [
  { key: '', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'read', label: 'Read' },
  { key: 'archived', label: 'Archived' },
];

const MESSAGE_LEGEND = [
  { state: 'new', label: 'New' },
  { state: 'live', label: 'Read' },
  { state: 'muted', label: 'Archived' },
];

const stateOf = (status) => (status === 'new' ? 'new' : status === 'archived' ? 'muted' : 'live');

export default async function AdminMessagesPage({ searchParams }) {
  const { status, month } = await searchParams;
  const selected = FILTERS.some((filter) => filter.key === status) ? status : '';
  const [all, counts] = await Promise.all([listMessages(), getMessageCounts()]);
  const messages = selected ? all.filter((message) => message.status === selected) : all;
  const dates = all
    .map((message) => ({
      id: message.id,
      key: toDateInputValue(message.created_at),
      href: null,
      title: message.name,
      meta: message.body,
      state: stateOf(message.status),
      flag: message.status === 'new' ? 'new' : '',
    }))
    .filter((entry) => entry.key);

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

      {all.length ? (
        <>
          <MonthCalendarCard
            entries={dates}
            month={typeof month === 'string' ? month : ''}
            basePath="/admin/messages"
            query={{ status: selected }}
            kicker="Inbox calendar"
            feedTitle="This month"
            legend={MESSAGE_LEGEND}
            emptyText="No messages this month."
          />

          {messages.length ? (
            <div className="card-list">
              {messages.map((message) => (
                <MessageItemCard key={message.id} message={message} markAction={markMessage} />
              ))}
            </div>
          ) : (
            <div className="card-empty">No {selected} messages.</div>
          )}
        </>
      ) : (
        <div className="card-empty">
          No messages yet. Notes from the contact form land here.
          <a href="/contact">See the contact form</a>
        </div>
      )}
    </>
  );
}
