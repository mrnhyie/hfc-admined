import Link from 'next/link';
import AdminForm from '@/components/admin/AdminForm';
import MaterialIcon from '@/components/MaterialIcon';
import { Check, Field, TextArea } from '@/components/admin/Fields';
import { saveEvent } from '@/app/admin/actions';
import { toDateInputValue, toTimeInputValue } from '@/lib/dates';

export default function EventEditor({ event }) {
  return (
    <AdminForm
      action={saveEvent}
      submitLabel={event ? 'Update event' : 'Create event'}
      aside={
        <>
          <Check label="Published (visible on the site)" name="published" value={event ? event.published : true} />
          <Check label="Feature on the home page" name="featured" value={event?.featured} />
        </>
      }
      extra={
        event?.slug ? (
          <a className="btn-ghost" href={`/events/${event.slug}`} target="_blank" rel="noopener noreferrer">
            View on site
            <MaterialIcon name="arrow_outward" />
          </a>
        ) : (
          <span className="editor-note">Save once to get a web address.</span>
        )
      }
    >
      {event ? <input type="hidden" name="id" value={event.id} /> : null}

      <div className="form-group">
        <h2 className="admin-subhead">Headline</h2>
        <div className="form-row form-row-2">
          <Field label="Title" name="title" value={event?.title} required maxLength={200} />
          <Field label="Web address (slug)" name="slug" value={event?.slug} maxLength={200} hint="Leave blank to use the title." />
        </div>
      </div>

      <div className="form-group">
        <h2 className="admin-subhead">When and where</h2>
        <div className="form-row form-row-2">
          <Field label="Start date" name="start_date" type="date" value={toDateInputValue(event?.starts_at)} required />
          <Field label="Start time" name="start_time" type="time" value={toTimeInputValue(event?.starts_at)} />
        </div>

        <div className="form-row form-row-2">
          <Field label="End date" name="end_date" type="date" value={toDateInputValue(event?.ends_at)} />
          <Field label="End time" name="end_time" type="time" value={toTimeInputValue(event?.ends_at)} />
        </div>

        <div className="form-row form-row-2">
          <Check label="All day" name="all_day" value={event?.all_day} />
          <Check label="No end time" name="clear_end" value={!event?.ends_at} hint="Clears the end date and time on save." />
        </div>

        <div className="form-row form-row-2">
          <Field label="Venue" name="venue" value={event?.venue} maxLength={200} placeholder="Church Auditorium" />
          <Field label="Photo URL" name="cover_url" value={event?.cover_url} maxLength={600} placeholder="/images/... or https://..." />
        </div>
      </div>

      <div className="form-group">
        <h2 className="admin-subhead">Copy</h2>
        <TextArea label="Card text" name="summary" value={event?.summary} short placeholder="One or two lines shown on the event card." />
        <TextArea label="Full details" name="body" value={event?.body} hint="Markdown works: ## heading, - list, > quote." />
      </div>
    </AdminForm>
  );
}
