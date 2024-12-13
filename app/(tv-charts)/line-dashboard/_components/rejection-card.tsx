"use client"

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { calculateRejection } from '../_actions/calculate-rejection';

interface RejectionCardProps {
    obbSheetId: string;
}

const RejectionCard = ({
    obbSheetId
}:RejectionCardProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        (async () => {
            const res = await calculateRejection(obbSheetId);
            // console.log("RESSSS", res);
            setCount(res);
        })();
    }, []);

    return (
        <div className='h-full w-full bg-white pl-2 pr-4 flex items-center gap-x-2 rounded-xl drop-shadow-sm border'>
            <img src='/icons/tv/reject.gif' alt="efficiency" className={cn("size-[12vh] p-2 pointer-events-none")} />
            <div className='w-full'>
                <p className='text-lg font-medium text-slate-500 tracking-[0.01em]'>Rejections</p>
                <p className={cn("mt-1 font-semibold text-3xl text-pink-600")}>{count}</p>
            </div>
        </div>
    )
}

export default RejectionCard