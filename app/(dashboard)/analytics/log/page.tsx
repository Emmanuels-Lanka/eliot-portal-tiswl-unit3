
import { Cog } from 'lucide-react'
import React from 'react'
import LogTable from '../../../../components/log/LogTable'
import { db } from '@/lib/db';

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
        <LogTable obbSheets={obbSheets} ></LogTable>
      </div>
  </div>
  )
}

export default page