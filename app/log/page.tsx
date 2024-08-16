import LogComponent from '@/components/log/log-component'
import { Cog } from 'lucide-react'
import React from 'react'
import LogTable from './LogTable'

const page = () => {
  return (
    <div>
    <div className="shadow-sm mb-4">
      <div className="h-[200]">
        <div className="flex justify-center items-center gap-3">
          <Cog className="w-16 h-16 text-voilet" />
          <h1 className="text-slate-500 m-4 text-3xl">
            Logs for ELIoT
          </h1>
          
        </div>
      </div>
     
    </div>
        <div className="container">
        <LogTable></LogTable>
      </div>
  </div>
  )
}

export default page