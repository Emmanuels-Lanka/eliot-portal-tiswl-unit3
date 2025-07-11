"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductionData } from "@prisma/client";

import { useToast } from "@/components/ui/use-toast";
import SelectObbSheetAndDate  from "@/components/dashboard/common/select-obbsheet-and-date";
import BarChartGraph from "./bar-chart-graph";
import { fetchDirectProductionData } from "@/actions/efficiency-direct-action";



interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
}

export type ProductionDataType = {
    namee: string;
    times: any;
    logout: null;
    login?:any;
    avg: number;
    seqNo?: string;
    seqno?: string;
    name: string;
    count: number;
    target: number;
    first:any;
    last:any;
}

export type finalDataTypes = {
    operation:string;
    operator:string;
    efficiency:number;
}

const EfficiencyAnalyticsChart = ({
    obbSheets
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [production, setProduction] = useState<ProductionDataType[]>([]);
    const [userMessage,setUserMessage]=useState<string>("Please select style and date")
    const [filterApplied,setFilterApplied]=useState<boolean>(false)
    const [obbSheetId,setObbSheetId]=useState<string>("")
    const[date,setDate]=useState<string>("")
    const[finalData,setFinalData]=useState<finalDataTypes[]>([])
    

   
    
    const Fetchdata = async (data: { obbSheetId: string; date: Date }) => {
        try {
            const y=data.date.getFullYear().toString()
            const m=(data.date.getMonth() + 1).toString().padStart(2,"0")
            const d=data.date.getDate().toString().padStart(2,"0")
            setObbSheetId(data.obbSheetId)
            const date= `${y}-${m}-${d}`
            setDate(`${y}-${m}-${d}%`)
       
            setFilterApplied(true)
          


            const dataa = await fetchDirectProductionData(data.obbSheetId,date)
            console.log(dataa)
            processData(dataa.data)


        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      useEffect(()=>{
        if(filterApplied){
            setUserMessage("No data available.")
        }
        
      },[filterApplied])



    const processData = (productionData: any[]) => {
    
             const operationsMap: { [key: string]: any[] } = {};
            productionData.forEach(data => {
                if (!operationsMap[data.obbOperation?.id]) {
                    operationsMap[data.obbOperation?.id] = [];
                }
                operationsMap[data.obbOperation?.id].push(data);
            });
    
            const operations = Object.values(operationsMap).map(group => ({
                obbOperation: group[0].obbOperation,
                
                data: group
            })).sort((a, b) => a.obbOperation.seqNo - b.obbOperation.seqNo);
    
            console.log(operations)

            const formattedData = operations.map((o)=>{
               const log =  o.data[0].operator.operatorSessions?.find((s:any)=>s.obbOperationId === o.obbOperation.id )?.LoginTimestamp
               const loginTime = new Date(log);
               const  lastProductionTime = o.data[0].timestamp;
               const lastTime = new Date(lastProductionTime)
               let timeDiffMinutes = (lastTime.getTime() - loginTime.getTime()) / (1000 * 60);
               let is2Passed :boolean = false
                  let isLoggedBfr2 :boolean =false
               if (
                 lastTime.getHours() > 14 ||
                 (lastTime.getHours() === 14 && lastTime.getMinutes() >= 5)
               ) {
                 if (
                   loginTime.getHours() < 14 ||
                   (loginTime.getHours() === 14 && loginTime.getMinutes() < 5)
                 ) {
                   timeDiffMinutes -= 60;
                   isLoggedBfr2 = true;
                 }
                 is2Passed = true;
               }


                const smv = o.obbOperation.smv
                const lastProd = o.data[0].totalPcs
                const earnMins = smv* lastProd
                const efficiency = timeDiffMinutes > 0  ? Math.max(Math.min((earnMins * 100) / timeDiffMinutes, 100), 0)  : 0
                return{
                    operation: o.data[0].obbOperation.seqNo+"-"+o.obbOperation.operation.name,
                    operator:o.data[0].operator.name,
                    
                    efficiency : Number(Math.round(efficiency))
                }
            })

            console.log(formattedData,"fd")
            setFinalData(formattedData)
            
          }
    return (
        <>
            <div className="mx-auto max-w-7xl">
                <SelectObbSheetAndDate 
                    obbSheets={obbSheets}
                    handleSubmit={Fetchdata}
                />
            </div>
            <div className="mx-auto max-w-[1680px]">
                {obbSheetId.length > 0 ?
                
                    <div className="my-8">
                        
                        <BarChartGraph
                            obbSheetId={obbSheetId}
                            date={date}
                            finalData={finalData}
                           
                            
                        />
                    </div>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">{userMessage}</p>
                    </div>
                }
            </div>
        </>
    )
}

export default EfficiencyAnalyticsChart