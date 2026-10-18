import AdminHead from '@/components/admin/AdminHead';
import ProgramEditor from '@/components/admin/ProgramEditor';

export const metadata = { title: 'New program — Admin' };

export default function NewProgramPage() {
  return (
    <>
      <AdminHead kicker="Programs" title="New program">
        <a className="btn-ghost" href="/admin/programs">
          All programs
        </a>
      </AdminHead>
      <ProgramEditor />
    </>
  );
}
