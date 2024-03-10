"use client"

import { usePathname } from 'next/navigation';
import { Cog } from 'lucide-react';

import { HEADER_INFO } from '@/constants';

const DashboardHeader = () => {
  const pathname = usePathname();
  const filteredData = HEADER_INFO.filter(header => header.href === pathname);

  return (
    <header className='w-full h-[60px] px-4 bg-white flex justify-between items-center'>
      {filteredData && filteredData.map((item) => (
        <div key={item.href} className='flex items-center gap-3'>
          <item.icon className='w-7 h-7 text-voilet' />
          <h1 className='text-slate-500'>{item.label}</h1>
        </div>
      ))}
      {filteredData.length === 0 && (
        <div className='flex items-center gap-3'>
          <Cog className='w-7 h-7 text-voilet' />
          <h1 className='text-slate-500'>ELIoT Web Portal</h1>
        </div>
      )}
    </header>
  )
}

export default DashboardHeader