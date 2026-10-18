import { notFound } from 'next/navigation';
import AdminHead from '@/components/admin/AdminHead';
import ProgramEditor from '@/components/admin/ProgramEditor';
import { getProgramForEdit } from '@/lib/queries';

export const metadata = { title: 'Edit program — Admin' };

export default async function EditProgramPage({ params }) {
  const { id } = await params;
  const program = await getProgramForEdit(Number(id));
  if (!program) notFound();

  return (
    <>
      <AdminHead kicker="Programs" title={program.title}>
        <a className="btn-ghost" href="/admin/programs">
          All programs
        </a>
      </AdminHead>
      <ProgramEditor program={program} />
    </>
  );
}
