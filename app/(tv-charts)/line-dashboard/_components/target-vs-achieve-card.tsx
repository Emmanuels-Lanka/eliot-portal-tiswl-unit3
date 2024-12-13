"use client"

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { fetchLineEndPassCount } from '../_actions/dhu/fetch-line-end-pass-count';

const RadialbarCircleChart = dynamic(() => import('./charts/radialbar-circle-chart'), {
    ssr: false
});

interface TargetVsAchieveCardProps {
    obbSheetId: string;
    target: number;
}

const TargetVsAchieveCard = ({
    obbSheetId,
    target
}: TargetVsAchieveCardProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        (async () => {
            const res = await fetchLineEndPassCount(obbSheetId);
            setCount(res);
        })();
    }, []);

    return (
        <div className='h-full w-full bg-white pl-8 flex items-center gap-x-2 rounded-xl drop-shadow-sm border'>
            <div className='w-1/3 flex flex-col items-end'>
                <img src='/icons/tv/achieve.gif' alt="efficiency" className={cn("size-[12vh] p-2 pointer-events-none")} />
                <div className='text-end pr-6'>
                    <p className='text-lg font-medium text-slate-500 tracking-[0.01em]'>Target vs Achieve in pcs</p>
                    <p className={cn("mt-1 font-semibold text-3xl")}><span className='text-emerald-600'>{count}</span> <span className='text-sky-600'>/ {target}</span></p>
                </div>
            </div>
            <div className='w-2/3'>
                <RadialbarCircleChart total={target} count={count} label="Achieve" />
            </div>
        </div>
    )
}

export default TargetVsAchieveCard