
import { Cog } from 'lucide-react'
import React from 'react'
import LogTable from '../../components/log/LogTable'
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
    <div className="shadow-sm mb-4">
      <div className="h-[200]">
        <div className="flex justify-center items-center gap-3">
          <Cog className="w-16 h-16 text-voilet" />
          <h1 className="text-slate-500 m-4 text-3xl">
            Logs for ELIoT
          </h1>
          
        </div>
      </div>
     
    </div>
        <div className="container">
        <LogTable obbSheets={obbSheets} ></LogTable>
      </div>
  </div>
  )
}

export default page