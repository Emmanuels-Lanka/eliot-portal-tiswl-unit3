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
    


//       const processData = (productionData: any[]) => {
//     // Group by both operation and operator
//     const operationsMap: { [key: string]: any[] } = {};
//     productionData.forEach(data => {
//         const operationId = data.obbOperation?.id;
//         const operatorId = data.operator?.id;
//         const key = `${operationId}_${operatorId}`;
//         if (!operationsMap[key]) {
//             operationsMap[key] = [];
//         }
//         operationsMap[key].push(data);
//     });

//     const operations = Object.values(operationsMap).map(group => ({
//         obbOperation: group[0].obbOperation,
//         operator: group[0].operator,
//         data: group
//     })).sort((a, b) => a.obbOperation.seqNo - b.obbOperation.seqNo);

//     const formattedData = operations.map((o) => {
//         const log = o.data[0].operator.operatorSessions?.find((s: any) => s.obbOperationId === o.obbOperation.id)?.LoginTimestamp;
//         const loginTime = new Date(log);
//         const lastProductionTime = o.data[0].timestamp;
//         const lastTime = new Date(lastProductionTime);
//         let timeDiffMinutes = (lastTime.getTime() - loginTime.getTime()) / (1000 * 60);
//         let is2Passed: boolean = false;
//         let isLoggedBfr2: boolean = false;
//         if (
//             lastTime.getHours() > 14 ||
//             (lastTime.getHours() === 14 && lastTime.getMinutes() >= 5)
//         ) {
//             if (
//                 loginTime.getHours() < 14 ||
//                 (loginTime.getHours() === 14 && loginTime.getMinutes() < 5)
//             ) {
//                 timeDiffMinutes -= 60;
//                 isLoggedBfr2 = true;
//             }
//             is2Passed = true;
//         }

//         const smv = o.obbOperation.smv;
//         const lastProd = o.data[0].totalPcs;
//         const earnMins = smv * lastProd;
//         const efficiency = timeDiffMinutes > 0 ? Math.max(Math.min((earnMins * 100) / timeDiffMinutes, 100), 0) : 0;
//         return {
//             operation: o.obbOperation.operation.name,
//             operator: o.operator.name,
//             machine: o.obbOperation.sewingMachine.machineId,
//             operatorId:o.operator.rfid,
//             efficiency: Number(Math.round(efficiency)),
//             seqNo : o.obbOperation.seqNo,
//             operatorOperation:o.operator.name+"-"+o.obbOperation.operation.name

//         };
//     }).sort((a, b) => {
//     const nameCompare = a.operator.localeCompare(b.operator);
//     if (nameCompare !== 0) return nameCompare;
//     return a.seqNo - b.seqNo; // group operations side-by-side by sequence
// });

//     setFinalData(formattedData);
// }

const processData = (productionData: any[]) => {
  // Group by both operation and operator
  const operationsMap: { [key: string]: any[] } = {};
  productionData.forEach(data => {
    const operationId = data.obbOperation?.id;
    const operatorId = data.operator?.id;
    const key = `${operationId}_${operatorId}`;
    if (!operationsMap[key]) {
      operationsMap[key] = [];
    }
    operationsMap[key].push(data);
  });

  // Grouped by operator and operation
  const operations = Object.values(operationsMap)
    .map(group => ({
      obbOperation: group[0].obbOperation,
      operator: group[0].operator,
      data: group
    }))
    .sort((a, b) => a.obbOperation.seqNo - b.obbOperation.seqNo);

  // Step 1: Build initial raw data
  const formattedDataRaw = operations.map(o => {
    const log = o.data[0].operator.operatorSessions?.find((s: any) => s.obbOperationId === o.obbOperation.id)?.LoginTimestamp;
    const loginTime = new Date(log);
    const lastProductionTime = o.data[0].timestamp;
    const lastTime = new Date(lastProductionTime);
    let timeDiffMinutes = (lastTime.getTime() - loginTime.getTime()) / (1000 * 60);

    if (
      lastTime.getHours() > 14 ||
      (lastTime.getHours() === 14 && lastTime.getMinutes() >= 5)
    ) {
      if (
        loginTime.getHours() < 14 ||
        (loginTime.getHours() === 14 && loginTime.getMinutes() < 5)
      ) {
        timeDiffMinutes -= 60;
      }
    }

    const smv = o.obbOperation.smv;
    const lastProd = o.data[0].totalPcs;
    const earnMins = smv * lastProd;
    const efficiency = timeDiffMinutes > 0
      ? Math.max(Math.min((earnMins * 100) / timeDiffMinutes, 100), 0)
      : 0;

    return {
      operation: o.obbOperation.operation.name,
      operator: o.operator.name,
      operatorId: o.operator.rfid,
      machine: o.obbOperation.sewingMachine.machineId,
      efficiency: Number(Math.round(efficiency)),
      seqNo: o.obbOperation.seqNo,
      eliotSerialNumber:o.data[0].eliotSerialNumber
    };
  });

  // Step 2: Count how many times each operator appears
  const operatorCountMap: { [key: string]: number } = {};
  formattedDataRaw.forEach(item => {
    operatorCountMap[item.operator] = (operatorCountMap[item.operator] || 0) + 1;
  });

  // Step 3: Add operatorOperation with "*" if multiple ops
  const formattedData = formattedDataRaw
    .map(item => ({
      ...item,
      operatorOperation: operatorCountMap[item.operator] > 1
        ? `📌 ${item.operator} - ${item.operation}` // mark multi-ops
        : `${item.operator} - ${item.operation}`
    }))
    .sort((a, b) => {
      const nameCompare = a.operator.localeCompare(b.operator);
      if (nameCompare !== 0) return nameCompare;
      return a.seqNo - b.seqNo;
    });

  setFinalData(formattedData);
};

   
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