"use client"

import React, { useEffect } from 'react'
import { getData } from './actions'




const TvDailyAchivements = ({linename}:{linename:string}) => {


const getValues = async ()=> {

  const obbSheetId = await getData(linename)
  console.log(linename)
  console.log(obbSheetId)
  


}

useEffect(()=> {
  getValues()
},[])


  return (
    <div>DailyAchivementsvvv
      <p>{linename}</p>

    </div>
  )
}

export default TvDailyAchivements