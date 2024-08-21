"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { parseISO, getHours } from 'date-fns';

import { useToast } from "@/components/ui/use-toast";
import EffiencyHeatmap from "@/components/dashboard/charts/efficiency-heatmap";
import SelectObbSheetDateOperation from "@/components/dashboard/common/select-obbsheet-date-operation";
import SmvBarChart from "./smv-bar-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { getSMV } from "./actions";
import { date } from "zod";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title:string;
}

 export type SMVChartData = {
   
    smv:number;
    name:string;
    avg:number;
};




const AnalyticsChart = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [barchartData, setBarchartData] = useState<SMVChartData[]>([]);
    const [obbSheetId, setObbSheetId] = useState<string>("");
    const [date, setDate] = useState<string>("");


    const handleFetchSmv = async (data: { obbSheetId: string; date: Date }) => {
        try {
            
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0];
            
            setObbSheetId(data.obbSheetId);
            setDate(formattedDate);
            
            // console.log("obbSheetId",obbSheetId)
            // console.log("date",formattedDate)
        
            // router.refresh();
          
        } catch (error: any) {
            console.error("Error fetching production data:", error);
            toast({
                title: "Something went wrong! Try again",
                variant: "error"
            });
        }
    }

    return (
        <>
            <div className="mx-auto max-w-7xl">
                <SelectObbSheetAndDate
                    obbSheets={obbSheets}
                    handleSubmit={handleFetchSmv}
                />
            </div>
            <div className="mx-auto max-w-[1680px]">
                {/* {barchartData.length > 0 ? */}
                    <div className="mt-12">
                        <SmvBarChart 
                            obbSheetId={obbSheetId}
                            date={date}
                                         
                        />
                    </div>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">Please select the OBB sheet, operation, and date ☝️</p>
                    </div>
                 {/* } */}
            </div>
        </>
    )
}

export default AnalyticsChart