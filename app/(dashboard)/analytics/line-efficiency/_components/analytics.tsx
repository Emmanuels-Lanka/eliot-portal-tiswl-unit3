"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { parseISO, getHours } from 'date-fns';

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";

import { useToast } from "@/components/ui/use-toast";
import EffiencyHeatmap from "@/components/dashboard/charts/efficiency-heatmap";
import EfficiencyBarChart from "./barchart";
import SelectObbSheetAndDate from "./unit-obb";


interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title?: string;
    units:any;
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
    obbSheets,units
    
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<newOperationEfficiencyOutputTypes>();
    const [obbSheet, setObbSheet] = useState<any>();
    const [date, setDate] = useState<string>("");
    const [filterApplied,setFilterApplied]=useState<boolean>(false)
    const[unit,setUnit]=useState<string>("")


  
    const Fetchdata = async (data: { date: Date ;unit:string}) => {
        try {
            const y=data.date.getFullYear().toString()
            const m=(data.date.getMonth() + 1).toString().padStart(2,"0")
            const d=data.date.getDate().toString().padStart(2,"0")
            setUnit(data.unit)
        
            setDate(`${y}-${m}-${d}`)
            console.log(data.unit)
       
            setFilterApplied(true)
            console.log("data",data.date,data.unit)
          
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

    return (
        <>
            <div className="mx-auto max-w-7xl">
                <SelectObbSheetAndDate
                obbSheets={obbSheets}
                handleSubmit={Fetchdata}
                units={units}

                ></SelectObbSheetAndDate>
            </div>
            <div className="mx-auto max-w-[1680px]">
                {(date && unit) ?
                    <div className="mt-12">
                        {/* <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2> */}
                        {/* <EffiencyHeatmap
                            xAxisLabel='Operations'
                            height={800}
                            efficiencyLow={obbSheet?.efficiencyLevel1}
                            efficiencyHigh={obbSheet?.efficiencyLevel3}
                            heatmapData={heatmapData}
                        /> */}
                        <EfficiencyBarChart  date={date} unit = {unit}></EfficiencyBarChart>
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