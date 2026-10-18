import AdminForm from '@/components/admin/AdminForm';
import MaterialIcon from '@/components/MaterialIcon';
import { Check, Field, Select, TextArea } from '@/components/admin/Fields';
import { savePost } from '@/app/admin/actions';
import { POST_KINDS } from '@/lib/forms';
import { toDateInputValue } from '@/lib/dates';

const KIND_OPTIONS = POST_KINDS.map((name) => [name, name.charAt(0).toUpperCase() + name.slice(1)]);

export default function PostEditor({ post, events = [], programs = [] }) {
  const eventOptions = [['0', 'None'], ...events.map((item) => [String(item.id), item.title])];
  const programOptions = [['0', 'None'], ...programs.map((item) => [String(item.id), item.title])];

  return (
    <AdminForm
      action={savePost}
      submitLabel={post ? 'Update content' : 'Create content'}
      aside={<Check label="Published (visible on the site)" name="published" value={post ? post.published : true} />}
      extra={
        post?.slug ? (
          <a className="btn-ghost" href={`/content/${post.slug}`} target="_blank" rel="noopener noreferrer">
            View on site
            <MaterialIcon name="arrow_outward" />
          </a>
        ) : (
          <span className="editor-note">Save once to get a web address.</span>
        )
      }
    >
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="form-group">
        <h2 className="admin-subhead">Headline</h2>
        <div className="form-row form-row-2">
          <Field label="Title" name="title" value={post?.title} required maxLength={200} />
          <Field label="Web address (slug)" name="slug" value={post?.slug} maxLength={200} hint="Leave blank to use the title." />
        </div>
      </div>

      <div className="form-group">
        <h2 className="admin-subhead">Classification</h2>
        <div className="form-row form-row-2">
          <Select label="Kind" name="kind" value={post?.kind} options={KIND_OPTIONS} />
          <Field label="Publish date" name="publish_date" type="date" value={toDateInputValue(post?.published_at)} hint="Defaults to today." />
        </div>

        <div className="form-row form-row-2">
          <Field label="Sermon series" name="series" value={post?.series} maxLength={120} hint="Groups teachings into a series." />
          <Field label="Speaker" name="speaker" value={post?.speaker} maxLength={120} />
        </div>

        <div className="form-row form-row-2">
          <Select label="Attached event" name="event_id" value={post?.event_id ? String(post.event_id) : '0'} options={eventOptions} />
          <Select label="Attached program" name="program_id" value={post?.program_id ? String(post.program_id) : '0'} options={programOptions} />
        </div>
      </div>

      <div className="form-group">
        <h2 className="admin-subhead">Media</h2>
        <div className="form-row form-row-2">
          <Field label="Photo URL" name="cover_url" value={post?.cover_url} maxLength={600} />
          <Field label="Video / recording URL" name="video_url" value={post?.video_url} maxLength={600} hint="Shown as a Watch button on the card." />
        </div>
      </div>

      <div className="form-group">
        <h2 className="admin-subhead">Copy</h2>
        <TextArea label="Summary" name="excerpt" value={post?.excerpt} short placeholder="Shown on the content card." />
        <TextArea label="Content" name="body" value={post?.body} hint="Markdown works: ## heading, - list, > quote, links." />
      </div>
    </AdminForm>
  );
}
