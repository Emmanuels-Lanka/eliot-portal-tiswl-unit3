import React from 'react'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import { db } from '@/lib/db';
import TvDailyAchivements from '@/components/tv-charts/daily-achivements/tv-daily-achivements';


const page = async ({ params }: { params: { linename: string}}) => {
   
  const lineid = params.linename
    

  return (
    <div>
        <div className='shadow-sm mb-4'>
        <DashboardHeader></DashboardHeader>
        </div>
        <div className='container'>
            
        <TvDailyAchivements linename={lineid}></TvDailyAchivements>
        
        </div>
    </div>
  )
}

export default page