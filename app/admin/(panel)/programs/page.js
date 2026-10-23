import AdminHead from '@/components/admin/AdminHead';
import Link from 'next/link';
import MaterialIcon from '@/components/MaterialIcon';
import { WeekScheduleCard } from '@/components/admin/CalendarCards';
import { ProgramItemCard } from '@/components/admin/ItemCards';
import { deleteProgram } from '@/app/admin/actions';
import { listProgramsAdmin } from '@/lib/queries';

export const metadata = { title: 'Programs — Admin' };

export default async function AdminProgramsPage({ searchParams }) {
  const { week } = await searchParams;
  const programs = await listProgramsAdmin();
  const scheduled = programs.filter((program) => program.meeting_day).length;
  const withoutCover = programs.filter((program) => !program.cover_url).length;

  return (
    <>
      <AdminHead kicker="Weekly services and ministries" title="Programs">
        <Link className="btn-admin" href="/admin/programs/new">
          <MaterialIcon name="add" />
          Add program
        </Link>
      </AdminHead>

      {programs.length ? (
        <>
          <WeekScheduleCard
            programs={programs}
            week={typeof week === 'string' ? week : ''}
            basePath="/admin/programs"
            kicker="The week"
          />

          <div className="card-grid card-grid-md">
            {programs.map((program) => (
              <ProgramItemCard key={program.id} program={program} deleteAction={deleteProgram} />
            ))}
          </div>

          <p className="editor-note">
            {scheduled} of {programs.length} programs have a weekday, so they appear in the Service Times list; the
            rest show as ministries.
            {withoutCover
              ? ` ${withoutCover} ${withoutCover === 1 ? 'has' : 'have'} no cover photo yet.`
              : ''}
          </p>
        </>
      ) : (
        <div className="card-empty">
          No programs yet. Add a weekly service or a ministry to fill the programs page.
          <Link href="/admin/programs/new">Add a program</Link>
        </div>
      )}
    </>
  );
}
