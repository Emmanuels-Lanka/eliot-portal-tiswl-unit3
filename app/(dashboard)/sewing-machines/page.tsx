import { db } from '@/lib/db'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'


const EliotDevices = async () => {
  const machines = await db.sewingMachine.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      eliotDevice: {
        select: {
          serialNumber: true,
          modelNumber: true
        }
      }
    }
  });

  return (
    <div className='mx-auto max-w-7xl mt-12'>
      <DataTable columns={columns} data={machines} />
    </div>
  )
}

export default EliotDevices