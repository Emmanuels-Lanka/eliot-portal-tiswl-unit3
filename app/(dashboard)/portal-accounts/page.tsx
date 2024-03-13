import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { db } from '@/lib/db';

const PortalUser = async () => {
  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className='mx-auto max-w-7xl mt-12'>
      <DataTable columns={columns} data={users} />
    </div>
  )
}

export default PortalUser