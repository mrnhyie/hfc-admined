import AdminForm from '@/components/admin/AdminForm';
import { Field, Select } from '@/components/admin/Fields';
import { saveMedia } from '@/app/admin/actions';
import { GALLERY_ALBUMS } from '@/lib/forms';

const ALBUM_OPTIONS = GALLERY_ALBUMS.map((name) => [name, name.charAt(0).toUpperCase() + name.slice(1)]);

export default function MediaEditor({ item }) {
  return (
    <AdminForm
      action={saveMedia}
      sideTitle="Placement"
      submitLabel={item ? 'Update photo' : 'Add photo'}
      aside={
        <>
          <Select label="Album" name="album" value={item?.album} options={ALBUM_OPTIONS} />
          <Field label="Sort order" name="sort_order" type="number" value={item?.sort_order ?? 100} hint="Lower numbers appear first." />
        </>
      }
    >
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="form-group">
        <h2 className="admin-subhead">Image</h2>
        <Field
          label="Image URL"
          name="url"
          value={item?.url}
          required
          maxLength={800}
          placeholder="/images/img-1.jpg or an https:// link"
          hint="Upload to your Vercel Blob store, or place files in public/images and link them here."
        />
      </div>

      <div className="form-group">
        <h2 className="admin-subhead">Text</h2>
        <div className="form-row form-row-2">
          <Field label="Alt text" name="alt" value={item?.alt} maxLength={200} />
          <Field label="Caption" name="caption" value={item?.caption} maxLength={200} />
        </div>
      </div>
    </AdminForm>
  );
}
