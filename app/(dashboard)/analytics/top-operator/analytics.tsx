"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { parseISO, getHours } from 'date-fns';

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";
import EffiencyHeatmap from "@/components/dashboard/charts/efficiency-heatmap";
import EfficiencyBarChart from "./bargraph";
import { finalDataTypes } from "../efficiency-rate/_components/analytics-chart";
import { fetchDirectProductionData } from "@/actions/efficiency-direct-action";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title: string;
}

export type newOperationEfficiencyOutputTypes = {
    data: {
        
        operation: {
            name: string,
            count: number | 0
            earnMinute:number | 0
        }[];
    }[];
    categories: string[];
    machines?: string[];
    eliot?:string[];
    
};

const AnalyticsChart = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    // const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);
    const [date, setDate] = useState<string>("");
        const[finalData,setFinalData]=useState<finalDataTypes[]>([])
    


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
                    operation: o.obbOperation.operation.name,
                    operator:o.data[0].operator.name,
                    machine:o.data[0].obbOperation.sewingMachine.machineId,
                    efficiency : Number(Math.round(efficiency))
                }
            }).sort((a, b) => b.efficiency - a.efficiency);

            console.log(formattedData,"fd")
            setFinalData(formattedData)
            
          }

   
    const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0];

            const dataa = await fetchDirectProductionData(data.obbSheetId,formattedDate)
            const heatmapData = processData(dataa.data);
     
            

           

            router.refresh();
        } catch (error: any) {
            console.error("Error fetching production data:", error);
            toast({
                title: "Something went wrong! Try again",
                variant: "error",
                description: (
                    <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                        <code className="text-slate-800">
                            ERROR: {error.message}
                        </code>
                    </div>
                ),
            });
        }
    }

    return (
        <>
            <div className="mx-auto max-w-7xl">
                <SelectObbSheetAndDate
                    obbSheets={obbSheets}
                    handleSubmit={handleFetchProductions}
                />
            </div>
            <div className="mx-auto max-w-[1680px]">
                {finalData.length > 0 ?
                    <div className="mt-12">
                        {/* <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2> */}
                        {/* <EffiencyHeatmap
                            xAxisLabel='Operations'
                            height={800}
                            efficiencyLow={obbSheet?.efficiencyLevel1}
                            efficiencyHigh={obbSheet?.efficiencyLevel3}
                            heatmapData={heatmapData}
                        /> */}
                            
                        <EfficiencyBarChart  finalData={finalData} ></EfficiencyBarChart>
                    </div>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">Please select the OBB sheet and date ☝️</p>
                    </div>
                }
            </div>
        </>
    )
}

export default AnalyticsChart