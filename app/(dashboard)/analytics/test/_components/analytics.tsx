
"use client"

import { useEffect } from 'react';
import moment from 'moment-timezone';

import { cn } from '@/lib/utils';
import { getData } from './actions';


const EfficiencyCard = () => {
    const timezone: string = 'Asia/Dhaka';
    
    const processData = (data: any[]) => {
        const dataMap = data.map((d) => {
            const currentTime = moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss");
            const end = new Date(currentTime);

            const start = d.start
            const [hours, minutes] = start.split(":").map(Number); 

            const startDate = new Date()
            startDate.setHours(hours, minutes, 0, 0);

            const availableMins = (end.getTime() - startDate.getTime()) / (1000 * 60);
            


            const earnMins = Number(d.count) * Number(d.totalSMV)

            const Efficiency = Number(((earnMins/availableMins)*100).toFixed(2))
            const count = Number(d.count)
            const smv = d.totalSMV

            console.log("asdasd",startDate)
            console.log("asdasds",start)
            console.log("asdasds",currentTime)
            
            return {
                Efficiency,earnMins,availableMins,count,smv
            }
        })
        return dataMap
    }


    const fetchData = async () => {
        const data = await getData()
        console.log("DATAA:", data)
        // const today = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
        // const currentTime = moment().tz(timezone).format('YYYY-MM-DD HH:mm');
        // console.log(currentTime)
        const datas = processData(data)
        console.log("final",datas)
       
       


    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className='h-full w-full bg-white pl-2 pr-4 flex items-center gap-x-2 rounded-xl'>
            <img src='/icons/tv/measure.gif' alt="efficiency" className={cn("size-[12vh] pointer-events-none")} />
            <div className='w-full'>
                <p className='text-lg font-medium text-slate-500 tracking-[0.01em]'>Efficency</p>
                {/* <p className={cn("mt-1 font-semibold text-3xl", color)}>{value.toUpperCase()}</p> */}
            </div>
        </div>
    )
}

export default EfficiencyCard
