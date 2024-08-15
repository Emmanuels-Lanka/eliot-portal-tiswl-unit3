"use client"

import React, { useEffect, useState } from 'react'
import {  getObbID,  } from './actions'
import ObbSheetId from '@/app/(dashboard)/obb-sheets/[obbSheetId]/page'
import BarChartGraph from '@/app/(dashboard)/analytics/daily-achivement/components/BarChartGraph'
import { Loader2 } from 'lucide-react'





 
const TvDailyAchivements = ({linename}:{linename:string}) => {


 

  const [obbSheet,setObbSheet]=useState<string>("")
  const [date,setData] = useState<string>("")

  const getObb = async () => {

    
    const today = new Date();
    const yyyyMMdd = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
  
   const date =  yyyyMMdd.toString()+"%"
    const obbSheetId = await getObbID(linename);
    setObbSheet(obbSheetId)
    setData(date) 

  }

  useEffect(()=>{

    getObb()

  },[linename])
 
  
  


  
  return (
    <div>

      <BarChartGraph
       obbSheetId={obbSheet}
       date={date}
      ></BarChartGraph>

    </div>
  )
}

export default TvDailyAchivements