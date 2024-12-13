import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';

const ObbLineTvDashboard = () => {

    const date = new Date();
    const formattedDate = format(date, 'dd MMMM, yyyy');

    return (
        <div className='w-full h-screen bg-slate-100'>
            {/* Dashboard header */}
            <div className='px-4 pt-4 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link href="/line-dashboard" >
                        <div className='size-8 bg-sky-600 flex justify-center items-center rounded-md hover:bg-sky-700'>
                            <ChevronLeft className='text-white' size={28}/>
                        </div>
                    </Link>
                    <h1 className='text-2xl font-semibold'>Sewing Line TV Dashboard</h1>
                </div>
                <div className='text-end'>
                    <p className='text-lg font-semibold'>ggg</p>
                    <p className='text-sm text-slate-600'>{formattedDate}</p>
                </div>
            </div>

            {/* Dashboard content */}
            <div className="p-4 h-full grid grid-cols-5 grid-rows-6 gap-4">
                <div className='bg-white pl-2 pr-4 flex items-center gap-x-2 rounded-xl'>
                    <img src="/icons/tv/user.gif" alt="line chief" className='size-[12vh]'/>
                    <div className='w-full'>
                        <h2 className='text-violet-600 text-2xl font-semibold'>Line Chief</h2>
                        {/* <p className='mt-1 text-lg font-medium'>{obbSheet.lineChief?.name.toUpperCase()}</p> */}
                    </div>
                </div>
                <div className='bg-white pl-2 pr-4 flex items-center gap-x-2 rounded-xl'>2</div>
                <div className='bg-white'>3</div>
                <div className="bg-white col-span-3 row-span-3 col-start-1 row-start-2">4</div>
                <div className="bg-white col-span-2 row-span-2 col-start-4 row-start-1">5</div>
                <div className="bg-white row-span-2 col-start-1 row-start-5">6</div>
                <div className="bg-white row-span-2 col-start-2 row-start-5">7</div>
                <div className="bg-white row-span-2 col-start-3 row-start-5">8</div>
                <div className="bg-white col-start-4 row-start-3">9</div>
                <div className="bg-white col-start-5 row-start-3">10</div>
                <div className="bg-white col-start-4 row-start-4">11</div>
                <div className="bg-white col-start-5 row-start-4">12</div>
                <div className="bg-white row-start-5">13</div>
                <div className="bg-white row-start-5">14</div>
                <div className="bg-white col-span-2 col-start-4 row-start-6">15</div>
            </div>
        </div>
    )
}

export default ObbLineTvDashboard