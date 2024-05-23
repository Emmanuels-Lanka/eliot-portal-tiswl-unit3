import { db } from '@/lib/db'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'

const AlertLogs = async () => {
  const alertLogs = await db.alertLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  function calculateTimeDifference(startTime: string, endTime: string) {
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      // Calculate the difference in milliseconds and convert to minutes
      const difference = (end.getTime() - start.getTime()) / 1000 / 60; // Milliseconds to seconds to minutes
      const hours = Math.floor(difference / 60);
      const minutes = Math.round(difference % 60);

      if (hours > 0 && minutes > 0) {
        return `${hours}hour ${minutes}min`;
      } else if (hours > 0) {
        return `${hours}hour`;
      } else {
        return `${minutes}min`;
      }
    }
  }

  const time1: string = '2024-05-22 01:20:37';
  const time2: string = '2024-05-22 08:07:53';
  const time3: string = '2024-05-22 08:08:30';
  const timeDifference = calculateTimeDifference(time2, time3);
  console.log("DEF:", timeDifference);

  return (
    <div className='mx-auto max-w-7xl mt-12'>
      <DataTable columns={columns} data={alertLogs} />
    </div>
  )
}

export default AlertLogs