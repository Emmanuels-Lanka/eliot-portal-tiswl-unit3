import AddOperation from '@/components/dashboard/forms/add-operation'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { db } from '@/lib/db';

const Operations = async () => {
  const operations = await db.operation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section>
      <AddOperation mode="create"/>

      <div className='mx-auto max-w-7xl mt-16'>
        <DataTable columns={columns} data={operations} />
      </div>
    </section>
  )
}

export default Operations