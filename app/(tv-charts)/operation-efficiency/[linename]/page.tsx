import TvOperationEfficiency from '@/components/tv-charts/operation-efficiency/tv-operation-efficiency'
import { Cog } from 'lucide-react'
import React from 'react'

const page = ({ params }: { params: { linename: string}}) => {

  return (
    <div>
      <div className="shadow-sm mb-4">
        <div className="h-[200]">
          <div className="flex justify-center items-center gap-3">
            
            <h1 className="text-slate-500 m-4 text-3xl">
              ELIoT Web Portal - Target vs Actual Production  for {params.linename}
            </h1>
                  
          </div>
        </div>
        <div className="container">
          <TvOperationEfficiency></TvOperationEfficiency>
        </div>
      </div>
    </div>
  )
}

export default page