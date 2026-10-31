import AdminForm from '@/components/admin/AdminForm';
import { Check, Field, TextArea } from '@/components/admin/Fields';
import { saveFacebookPost } from '@/app/admin/actions';
import { toDateInputValue, toTimeInputValue } from '@/lib/dates';

export default function FacebookEditor({ item }) {
  return (
    <AdminForm
      action={saveFacebookPost}
      submitLabel={item ? 'Update post' : 'Add post'}
      aside={
        <>
          <Check label="Published (visible on the site)" name="published" value={item ? item.published : true} />
          <Field
            label="Posted on"
            name="post_date"
            type="date"
            value={toDateInputValue(item?.posted_at) || toDateInputValue(new Date())}
            required
          />
          <Field label="Time" name="post_time" type="time" value={toTimeInputValue(item?.posted_at)} />
          <Field
            label="Reactions"
            name="reactions"
            type="number"
            value={item?.reactions ?? ''}
            hint="Enter the real count, or leave blank to hide it."
          />
          <Field
            label="Comments"
            name="comments"
            type="number"
            value={item?.comments ?? ''}
            hint="Optional. Blank counts stay hidden on the site."
          />
        </>
      }
      extra={
        item?.post_url ? (
          <a className="btn-ghost" href={item.post_url} target="_blank" rel="noopener noreferrer">
            View on Facebook
          </a>
        ) : null
      }
    >
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="form-group">
        <h2 className="admin-subhead">Post</h2>
        <TextArea
          label="Caption"
          name="caption"
          value={item?.caption}
          short
          placeholder="The text as it appears on Facebook."
        />
        <Field
          label="Link to the original post"
          name="post_url"
          value={item?.post_url}
          maxLength={800}
          placeholder="https://www.facebook.com/..."
          hint="Makes the whole card open the post on Facebook."
        />
      </div>

      <div className="form-group">
        <h2 className="admin-subhead">Photo</h2>
        <Field
          label="Image URL"
          name="image_url"
          value={item?.image_url}
          maxLength={800}
          placeholder="/images/... or https://..."
          hint="Leave blank for a text-only post."
        />
        <Field
          label="Alt text"
          name="image_alt"
          value={item?.image_alt}
          maxLength={300}
          hint="Describe the photo for screen readers. Falls back to the caption."
        />
      </div>
    </AdminForm>
  );
}
