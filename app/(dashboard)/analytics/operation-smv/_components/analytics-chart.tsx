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
}

 type SMVChartData = {
    groupName: string;
    actualSMV: number;
    calculatedSMV: number;
  
};




const AnalyticsChart = ({
    obbSheets
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [barchartData, setBarchartData] = useState<SMVChartData[]>([]);

    const prepareSMVChartData = (data: ProductionSMVDataTypes[]): SMVChartData[] => {
        // Categorize data by obbOperationId
        const operationGroups: { [key: string]: ProductionSMVDataTypes[] } = {};

        data.forEach(item => {
            if (!operationGroups[item.obbOperationId]) {
                operationGroups[item.obbOperationId] = [];
            }
            operationGroups[item.obbOperationId].push(item);
        });

        // Map each operation group to the required structure
        const chartData: SMVChartData[] = Object.values(operationGroups).map(group => {
            const firstItem = group[0];
            const groupName = `${firstItem.obbOperation.operation.code} - ${firstItem.obbOperation.operation.name}`;
            const actualSMV = parseFloat(firstItem.obbOperation.smv);
            

            // Calculate the average recorded SMV
            const sumSMV = group.reduce((acc, curr) => acc + parseFloat(curr.smv), 0);
            const calculatedSMV = sumSMV / group.length;

            return {
                groupName,
                actualSMV,
                calculatedSMV
            };
        });

        return chartData;
    };

    const handleFetchSmv = async (data: { obbSheetId: string; date: Date }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0];
            const result = await getSMV(data.obbSheetId, formattedDate);
             
            // const preparedData = prepareSMVChartData(result);
            
            // setBarchartData(preparedData);
            
            console.log("Result",result)

             router.refresh();
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
                {barchartData.length > 0 ?
                    <div className="mt-12">
                        <SmvBarChart 
                        obbSheetId={obbSheetId} 
                        date={date}
                        smv={smv}
                        />
                    </div>
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">Please select the OBB sheet, operation, and date ☝️</p>
                    </div>
                }
            </div>
        </>
    )
}

export default AnalyticsChart