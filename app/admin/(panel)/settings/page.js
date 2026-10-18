import AdminForm from '@/components/admin/AdminForm';
import { Field, TextArea } from '@/components/admin/Fields';
import { saveSettings } from '@/app/admin/actions';
import { getSettings } from '@/lib/queries';

export const metadata = { title: 'Site text — Admin' };

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  const field = (name, label, options = {}) =>
    options.textarea ? (
      <TextArea key={name} label={label} name={name} value={settings[name]} short={options.short} hint={options.hint} />
    ) : (
      <Field
        key={name}
        label={label}
        name={name}
        value={settings[name]}
        maxLength={2000}
        hint={options.hint}
      />
    );

  return (
    <>
      <div className="admin-head">
        <div>
          <div className="admin-kicker">Printed across the public site</div>
          <h1>Site text</h1>
        </div>
        <a className="btn-ghost" href="/" target="_blank" rel="noopener noreferrer">
          View the site
        </a>
      </div>

      <AdminForm action={saveSettings} sideTitle="Save" submitLabel="Save site text">
        <div className="form-group">
          <h2 className="admin-subhead">Identity and photos</h2>
          <div className="form-row form-row-2">
            {field('church_name', 'Church name')}
            {field('church_short', 'Short name (navigation)')}
          </div>
          {field('logo_url', 'Logo URL')}
          <div className="form-row">
            {field('hero_image_url', 'Hero background photo')}
            {field('about_image_url', 'About photo')}
            {field('schedule_bg_url', 'Weekly services background', {
              hint: 'Shown behind the weekly times under a flat plum wash. Leave blank for plain plum.',
            })}
          </div>
        </div>

        <div className="form-group">
          <h2 className="admin-subhead">Home hero</h2>
          <div className="form-row form-row-2">
            {field('hero_eyebrow', 'Eyebrow')}
            {field('hero_title', 'Headline', { hint: 'Wrap words in *asterisks* for emphasis.' })}
          </div>
          {field('hero_body', 'Intro paragraph', { textarea: true, short: true })}
          {field('hero_note', 'Note under the buttons')}
          <div className="form-row">
            {field('hero_badge_one_label', 'Badge 1 label')}
            {field('hero_badge_one_value', 'Badge 1 value')}
            {field('hero_badge_two_label', 'Badge 2 label')}
            {field('hero_badge_two_value', 'Badge 2 value')}
          </div>
        </div>

        <div className="form-group">
          <h2 className="admin-subhead">About block</h2>
          <div className="form-row form-row-2">
            {field('about_kicker', 'Kicker')}
            {field('about_title', 'Title')}
          </div>
          {field('about_body', 'Body', { textarea: true, short: true })}
          {field('about_tag', 'Photo tag', { hint: 'Short phrase shown on the gold block over the about photo.' })}
          <div className="form-row form-row-2">
            {field('about_quote', 'Pull quote')}
            {field('about_signature', 'Signature')}
          </div>
        </div>

        <div className="form-group">
          <h2 className="admin-subhead">Section headings</h2>
          <div className="form-row">
            {field('services_kicker', 'Programs kicker')}
            {field('services_title', 'Programs heading')}
            {field('schedule_kicker', 'Service times kicker')}
            {field('schedule_title', 'Service times heading')}
            {field('events_kicker', 'Events kicker')}
            {field('events_title', 'Events heading')}
            {field('content_kicker', 'Content kicker')}
            {field('content_title', 'Content heading')}
            {field('gallery_kicker', 'Gallery kicker')}
            {field('gallery_title', 'Gallery heading')}
          </div>
        </div>

        <div className="form-group">
          <h2 className="admin-subhead">Invitation block</h2>
          <div className="form-row form-row-2">
            {field('cta_title', 'Heading')}
            {field('cta_body', 'Text')}
          </div>
        </div>

        <div className="form-group">
          <h2 className="admin-subhead">Contact and visiting</h2>
          <div className="form-row form-row-2">
            {field('contact_kicker', 'Kicker')}
            {field('contact_title', 'Title')}
          </div>
          {field('contact_body', 'Body', { textarea: true, short: true })}
          <div className="form-row">
            {field('address', 'Address')}
            {field('phone', 'Phone')}
            {field('email', 'Email')}
            {field('service_note', 'Weekly service note')}
          </div>
          {field('maps_embed_url', 'Google Maps embed URL')}
        </div>

        <div className="form-group">
          <h2 className="admin-subhead">Social media</h2>
          <p className="editor-note">
            Every link you fill in gets a mark in the pane fixed to the left edge of the site and a line in the footer.
            Leave a field empty to hide that network.
          </p>
          <div className="form-row">
            {field('facebook_url', 'Facebook URL')}
            {field('instagram_url', 'Instagram URL')}
            {field('youtube_url', 'YouTube URL')}
            {field('tiktok_url', 'TikTok URL')}
          </div>
        </div>

        <div className="form-group">
          <h2 className="admin-subhead">Giving</h2>
          <div className="form-row">
            {field('give_url', 'Giving URL', { hint: 'Leave blank to hide the Give buttons.' })}
            {field('give_label', 'Giving button label')}
          </div>
        </div>
      </AdminForm>
    </>
  );
}
