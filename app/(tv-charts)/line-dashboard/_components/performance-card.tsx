"use client"

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { fetchProductionCount } from '../_actions/fetch-data-for-efficiency';

const ProgressBar = dynamic(() => import('./charts/progress-bar'), {
    ssr: false
});

interface PerformanceCardProps {
    obbSheetId: string;
    target: number;
}

const PerformanceCard = ({
    obbSheetId,
    target,
}: PerformanceCardProps) => {
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const count = await fetchProductionCount(obbSheetId);
            // console.log("count:", count);
            const performance = (count / target) * 100;
            setValue(performance);
        })();
    }, []);

    return (
        <div className='h-full w-full bg-white py-4 pl-2 pr-6 flex items-center gap-x-2 rounded-xl drop-shadow-sm border'>
            <img src='/icons/tv/performance.gif' alt="efficiency" className={cn("size-[11vh] p-3 pointer-events-none")} />
            <div className='w-full flex flex-col items-start'>
                <div className='w-full flex justify-between items-end'>
                    <p className='text-xl font-medium text-slate-500 tracking-[0.01em]'>Performance</p>
                    <p className={cn("mt-1 font-semibold text-3xl text-red-600")}>{value ? `${value.toFixed(1)}%` : "NAN"}</p>
                </div>
                <div className='w-full'>
                    <ProgressBar percentage={value} startColor="#ff800d" endColor="#dc2626" />
                </div>
            </div>
        </div>
    )
}

export default PerformanceCard