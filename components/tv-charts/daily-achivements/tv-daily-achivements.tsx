"use client"

import React, { useEffect } from 'react'
import { getData, getProducts } from './actions'
import ObbSheetId from '@/app/(dashboard)/obb-sheets/[obbSheetId]/page'
import BarChartGraph from '@/app/(dashboard)/analytics/daily-achivement/components/BarChartGraph'



//  const date =  "2024-08-14%"
  const obb ="ly8o5vu8-c9cFZB9SRxjo"
  const today = new Date();
const yyyyMMdd = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');

 const date =  yyyyMMdd.toString()+"%"
const TvDailyAchivements = ({linename}:{linename:string}) => {


const getValues = async ()=> {

    const obbSheetId = await getData(linename)

  // const date =  "2024-08-14%"
  const obb ="ly8o5vu8-c9cFZB9SRxjo"
  
  
  const values= await  getProducts(obb,date)

  console.log("vak",values)
  



}

useEffect(()=> {
  getValues()
},[])


  return (
    <div>DailyAchivementsvvv
      <p>{linename}</p>
      <BarChartGraph
       obbSheetId={obb}
       date={date}
      ></BarChartGraph>

    </div>
  )
}

export default TvDailyAchivements