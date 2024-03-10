import { db } from '@/lib/db'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'


const EliotDevices = async () => {
  const devices = await db.eliotDevice.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className='mx-auto max-w-7xl mt-12'>
      <DataTable columns={columns} data={devices} />
    </div>
  )
}

export default EliotDevices