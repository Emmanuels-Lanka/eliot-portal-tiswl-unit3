"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { parseISO, getHours } from 'date-fns';

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";
import EffiencyHeatmap from "@/components/dashboard/charts/efficiency-heatmap";
import { getData } from "../actions";
import BarChartGraph from "./BarChartGraph";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title: string;
}

export type ProductionDataType = {
    name: string;
    count: number;
    target: number;
}



const AnalyticsChart = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<OperationEfficiencyOutputTypes>();
    const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);
    const [prodData,setProdData] = useState<ProductionDataType []>([])
    
    const [userMessage,setUserMessage] = useState<string>("Please select a style and date ☝️")
    const [filterApplied,setFilterApplied] = useState<boolean>(false)

    const [obbSheetId,setObbSheetId] = useState<string>("")
    const [date,setDate] = useState<string>("")


    // function processProductionData(productionData: ProductionDataForChartTypes[]): OperationEfficiencyOutputTypes {
    //     const hourGroups = ["7:00 AM - 8:00 AM", "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM"];

    //     const getHourGroup = (timestamp: string): string => {
    //         const hour = new Date(timestamp).getHours();
    //         return hourGroups[Math.max(0, Math.min(11, hour - 7))];
    //     };

    //     const operatorsMap: { [key: string]: ProductionDataForChartTypes[] } = {};
    //     productionData.forEach(data => {
    //         if (!operatorsMap[data.operatorRfid]) {
    //             operatorsMap[data.operatorRfid] = [];
    //         }
    //         operatorsMap[data.operatorRfid].push(data);
    //     });

    //     const operations = Object.values(operatorsMap).map(group => ({
    //         operator: group[0],
    //         data: group
    //     })).sort((a, b) => a.operator.obbOperation.seqNo - b.operator.obbOperation.seqNo);

    //     const categories = operations.map(op => `${op.operator.operator.name}-${op.operator.obbOperation.seqNo}`);

    //     const resultData = hourGroups.map(hourGroup => ({
    //         hourGroup,
    //         operation: operations.map(op => {
    //             const filteredData = op.data.filter(data => getHourGroup(data.timestamp) === hourGroup);
    //             const totalProduction = filteredData.reduce((sum, curr) => sum + curr.productionCount, 0);
    //             const efficiency = filteredData.length > 0 ? (totalProduction === 0 ? 0 : (totalProduction / op.operator.obbOperation.target) * 100) : null;
    //             return { name: `${op.operator.obbOperation.seqNo}-${op.operator.obbOperation.operation.name}`, efficiency: efficiency !== null ? parseFloat(efficiency.toFixed(1)) : null };
    //         })
    //     }));

    //     return {
    //         data: resultData,
    //         categories
    //     };
    // }

    useEffect(()=>{
        
    },[])
    const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0].toString()+"%";

            // const response = await axios.get(`/api/obb-date-prod-data?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);

            
               setObbSheetId(data.obbSheetId) 
               setDate(formattedDate)
     
            setFilterApplied(true)


            console.log(filterApplied)
            

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



    useEffect(()=> {

        if(filterApplied)
        {
            setUserMessage("No Data Available...")
            
        }
    },[filterApplied])
    
    return (
        <>
            <div className="mx-auto max-w-7xl">
                <SelectObbSheetAndDate 
                    obbSheets={obbSheets}
                    handleSubmit={handleFetchProductions}
                />
            </div>
            <div className="mx-auto max-w-[1680px]">
                {obbSheetId.length > 0 ?
                    <div className="my-8">
                        {/* <LineChartGraph 
                            data={production}
                        />  */}
                        <BarChartGraph
                            obbSheetId={obbSheetId}
                            date={date}
                            filterApplied={filterApplied}

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

export default AnalyticsChart