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
import { getFormattedTime } from "@/lib/utils-time";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
}


// export type ProductionSMVDataTypes = {
//     id: number;
//     obbOperationId: string;
//     operatorRfid: string;
//     obbOperation: {
//         smv: string;
//         operation: {
//             name: string;
//             code: string;
//         }
//     }
//     smv: string;
//     timestamp: string;
// }


const AnalyticsChart = ({
    obbSheets
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [barchartData, setBarchartData] = useState<{ hourGroup: string; smv: number | null }[]>([]);
    const [tsmv, settsmv] = useState< number>(0);

    const groupSMVByHour = (data: ProductionSMVDataTypes[]): { hourGroup: string; smv: number | null }[] => {
        const hourGroups = [
            "7 AM - 8 AM", "8 AM - 9 AM", "9 AM - 10 AM",
            "10 AM - 11 AM", "11 AM - 12 PM", "12 PM - 1 PM",
            "1 PM - 2 PM", "2 PM - 3 PM", "3 PM - 4 PM",
            "4 PM - 5 PM", "5 PM - 6 PM", "6 PM - 7 PM"
        ];

        // Helper function to determine hour group based on timestamp 
        const getHourGroup = (timestamp: string): string => {
            const hour = new Date(timestamp).getHours();
            return hourGroups[Math.max(0, Math.min(11, hour -7))-1];
        };

        // Map to store the SMV values by hour group
        const smvByHour: { [key: string]: number } = {};

        // Processing each data entry
        data.forEach(entry => {
            const hourGroup = getHourGroup(entry.timestamp);
            const smvValue = parseFloat(entry.smv); // convert the SMV string to a float
            smvByHour[hourGroup] = smvValue; // This assumes there is only one SMV value per hour group in the data
        });

        // Create the final structured array from the map
        return hourGroups.map(hourGroup => ({
            hourGroup,
            smv: smvByHour[hourGroup] || null // if no SMV data for the hour, default to 0
        }));
    };

    const handleFetchSmv = async (data: { obbSheetId: string; obbOperationId: string; date: Date }) => {
        try {
            // console.log("dateqq1",data.date)
           // data.date.setDate(data.date.getDate() +1);
            const formattedDate = getFormattedTime(data.date.toString())
             
            const response = await axios.get(`/api/smv/fetch-by-operation?obbOperationId=${data.obbOperationId}&date=${formattedDate}`);
            const result = groupSMVByHour(response.data.data);
            console.log("Result data",response)
            console.log("dateqq11111111111",result)

            const tsmv = response.data.tsmv.smv
            settsmv(tsmv)
            setBarchartData(result);
       

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
                <SelectObbSheetDateOperation
                    obbSheets={obbSheets}
                    handleSubmit={handleFetchSmv}
                />
            </div>
            <div className="mx-auto max-w-[1680px]">
                {barchartData.length > 0 ?
                    <div className="mt-12">
                        <SmvBarChart tsmv={tsmv} data={barchartData} />
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