



import { Cog } from 'lucide-react'
import React from 'react'
import LogTable from '../../../../components/log/LogTable'
import { db } from '@/lib/db';

import DailyEfficiencyReport from './_components/report-table';

const page = async () => {


  const obbSheets = await db.obbSheet.findMany({
    where: {
        isActive: true,
    },
    orderBy: {
        createdAt: "desc",
    },
    select: {
        id: true,
        name: true
    }
});

  return (
    <div>
    
        <div className="container">
        <DailyEfficiencyReport obbSheets={obbSheets} />
      </div>
  </div>
  )
}

export default page