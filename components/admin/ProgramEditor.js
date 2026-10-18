import AdminForm from '@/components/admin/AdminForm';
import MaterialIcon, { ICON_NAMES } from '@/components/MaterialIcon';
import { Check, Field, Select, TextArea } from '@/components/admin/Fields';
import { saveProgram } from '@/app/admin/actions';
import { PROGRAM_CATEGORIES } from '@/lib/forms';

const CATEGORY_OPTIONS = PROGRAM_CATEGORIES.map((name) => [
  name,
  name.charAt(0).toUpperCase() + name.slice(1),
]);

const ICON_OPTIONS = ICON_NAMES.map((name) => [
  name,
  name.replaceAll('_', ' ').replace(/^\w/, (c) => c.toUpperCase()),
]);

export default function ProgramEditor({ program }) {
  const iconName = program?.icon || ICON_OPTIONS[0][0];

  return (
    <AdminForm
      action={saveProgram}
      submitLabel={program ? 'Update program' : 'Create program'}
      aside={
        <>
          <Check label="Published (visible on the site)" name="published" value={program ? program.published : true} />
          <Check label="Feature on the home page" name="featured" value={program?.featured} />
        </>
      }
      extra={
        program?.slug ? (
          <a className="btn-ghost" href={`/programs/${program.slug}`} target="_blank" rel="noopener noreferrer">
            View on site
            <MaterialIcon name="arrow_outward" />
          </a>
        ) : (
          <span className="editor-note">Save once to get a web address.</span>
        )
      }
    >
      {program ? <input type="hidden" name="id" value={program.id} /> : null}

      <div className="form-group">
        <h2 className="admin-subhead">Headline</h2>
        <div className="form-row form-row-2">
          <Field label="Title" name="title" value={program?.title} required maxLength={200} />
          <Field label="Web address (slug)" name="slug" value={program?.slug} maxLength={200} hint="Leave blank to use the title." />
        </div>
      </div>

      <div className="form-group">
        <h2 className="admin-subhead">Type and icon</h2>
        <div className="form-row form-row-2">
          <Select label="Type" name="category" value={program?.category} options={CATEGORY_OPTIONS} />
          <Select label="Icon" name="icon" value={program?.icon} options={ICON_OPTIONS} />
        </div>
        <p className="editor-note">
          Shown on the program card as <MaterialIcon name={iconName} className="msvg-inline" />. Fill the weekday to list
          this program under Service Times; leave it blank for a ministry card.
        </p>
      </div>

      <div className="form-group">
        <h2 className="admin-subhead">When and where</h2>
        <div className="form-row form-row-2">
          <Field label="Weekday" name="meeting_day" value={program?.meeting_day} maxLength={40} placeholder="Sunday" />
          <Field label="Time" name="meeting_time" value={program?.meeting_time} maxLength={80} placeholder="8:00 AM — 12:00 PM" />
        </div>

        <div className="form-row form-row-2">
          <Field label="Venue" name="venue" value={program?.venue} maxLength={200} />
          <Field label="Photo URL" name="cover_url" value={program?.cover_url} maxLength={600} />
        </div>

        <div className="form-row form-row-2">
          <Field label="Card text" name="summary" value={program?.summary} maxLength={600} />
          <Field label="Sort order" name="sort_order" type="number" value={program?.sort_order ?? 100} hint="Lower numbers appear first." />
        </div>
      </div>

      <div className="form-group">
        <h2 className="admin-subhead">Copy</h2>
        <TextArea label="Full details" name="body" value={program?.body} hint="Markdown works." />
      </div>
    </AdminForm>
  );
}
