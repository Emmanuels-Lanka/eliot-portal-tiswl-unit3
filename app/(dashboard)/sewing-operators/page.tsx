import { db } from '@/lib/db';
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns';

const SewingOperators = async () => {
  const operators = await db.operator.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className='mx-auto max-w-7xl mt-12'>
      <DataTable columns={columns} data={operators} />
    </div>
  )
}

export default SewingOperators