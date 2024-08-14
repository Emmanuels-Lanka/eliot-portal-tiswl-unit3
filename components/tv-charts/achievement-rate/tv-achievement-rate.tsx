"use client"
import { useEffect } from "react";
import { getData } from "./route";

const AchievementRate=({linename}:{linename:string})=>{
  const getProduction=async()=>{
   const obbSheetId=await getData(linename);
   console.log(obbSheetId)
  }

  useEffect(()=>{
    getProduction()
  },[])
  return(
    <div>
    Line Id: 
     {linename}
    </div>
  )
}
export default AchievementRate;