import AdminHead from '@/components/admin/AdminHead';
import FacebookEditor from '@/components/admin/FacebookEditor';

export const metadata = { title: 'Add Facebook post — Admin' };

export default function NewFacebookPostPage() {
  return (
    <>
      <AdminHead kicker="Facebook" title="Add post">
        <a className="btn-ghost" href="/admin/facebook">
          All posts
        </a>
      </AdminHead>
      <FacebookEditor />
    </>
  );
}
