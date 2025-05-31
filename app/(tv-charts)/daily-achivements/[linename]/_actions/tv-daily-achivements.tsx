"use client"

import React, { useEffect, useState } from 'react'

import ObbSheetId from '@/app/(dashboard)/obb-sheets/[obbSheetId]/page'
// import BarChartGraph from '@/app/(dashboard)/analytics/daily-achivement/components/BarChartGraph'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import BarChartGraph from './BarChartGraph'
import LogoImporter from '@/components/dashboard/common/eliot-logo'
import { getObbSheetID } from './actions'





 
const TvDailyAchivements = ({linename}:{linename:string}) => {
const [obbSheetId, setobbSheetId] = useState<string>("")
  const [obbSheetName, setobbSheetName] = useState<string>("")
  const [date, setdate] = useState<string>("")

  const getObbSheetID1 = async () => {
    const obbSheetId1 = await getObbSheetID(linename);
    setobbSheetId(obbSheetId1.id)
    setobbSheetName(obbSheetId1.name)
   
  }

  useEffect(() => {

    const y = new Date().getFullYear().toString()
    const m = (new Date().getMonth() + 1).toString().padStart(2, "0")
    //const d = new Date().getDate().toString().padStart(2, "0")
    const today = new Date();
    const yyyyMMdd = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
  
   const date =  yyyyMMdd.toString()+"%"
    setdate(date)

  }, [])

  useEffect(() => {
    console.log("linename", linename,)
    getObbSheetID1()
  }, [linename])

  


  return (
    <div className="h-[200]">
      {/* <div className='flex justify-center items-center gap-3'>
        <Cog className='w-7 h-7 text-voilet' />
        <h1 className='text-slate-500 m-4 text-3xl'>ELIoT Web Portal - SMV vs Cycle Time {linename}</h1>
      </div> */}
       <div className='flex justify-center items-center gap-3 w-screen'>
        {/* <Cog className='w-7 h-7 text-voilet' /> */}
        <LogoImporter/>
        <h1 className='text-[#0071c1] my-4 text-3xl '>Dashboard - Target vs Actual - {obbSheetName}</h1>
      </div>

      {obbSheetId.length > 0 ? 
       <BarChartGraph
       obbSheetId={obbSheetId}
       date={"2025-05-30%"}
      ></BarChartGraph> : <span>No Layout for Line {linename} - {date}</span>}
    </div>
  )
}

export default TvDailyAchivements