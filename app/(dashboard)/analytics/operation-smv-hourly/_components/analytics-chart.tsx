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
import ObbSheetId from "@/app/(dashboard)/obb-sheets/[obbSheetId]/page";
import { getHrSmv } from "./actions";

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
    const [data1,setdata1]=useState<any[]>()

    const [barchartData, setBarchartData] = useState<{ hourGroup: string; smv: number | null; operationName: string }[]>([]);
    const [tsmv, settsmv] = useState< number>(0);
    const [operationName, setOperationName] = useState< string>("");

    const groupSMVByHour = (data: ProductionSMVDataTypes[]): { hourGroup: string; smv: number | null; operationName: string }[] => {
        const hourGroups = [
            "7 AM - 8 AM", "8 AM - 9 AM", "9 AM - 10 AM",
            "10 AM - 11 AM", "11 AM - 12 PM", "12 PM - 1 PM",
            "1 PM - 2 PM", "2 PM - 3 PM", "3 PM - 4 PM",
            "4 PM - 5 PM", "5 PM - 6 PM", "6 PM - 7 PM"
        ];
    
        const getHourGroup = (timestamp: string): string => {
            const hour = new Date(timestamp).getHours();
            return hourGroups[Math.max(0, Math.min(11, hour - 7)) - 1];
        };
    
        const smvByHour: { [key: string]: { smv: number, operationName: string } } = {};
    
        data.forEach(entry => {
            const hourGroup = getHourGroup(entry.timestamp);
            const smvValue = parseFloat(entry.smv);
            const operationName = entry.obbOperation.operation.name; // Capture operation name
            smvByHour[hourGroup] = { smv: smvValue, operationName }; // Store SMV and operation name by hour group
        });
    
        return hourGroups.map(hourGroup => ({
            hourGroup,
            smv: smvByHour[hourGroup]?.smv || null,
            operationName: smvByHour[hourGroup]?.operationName || "N/A" // Default to "N/A" if no operationName
        }));
    };
    

    const handleFetchSmv = async (data: { obbSheetId: string; obbOperationId: string; date: Date; operationName:string}) => {
        try {
            // console.log("dateqq1",data.date)
           // data.date.setDate(data.date.getDate() +1);

           console.log("data",data)
            const formattedDate = getFormattedTime(data.date.toString())
             
            const response = await axios.get(`/api/smv/fetch-by-operation?obbOperationId=${data.obbOperationId}&date=${formattedDate}`);
           
            const result = groupSMVByHour(response.data.data);
<<<<<<< HEAD
           
=======
            
            console.log("Result data",response)
            console.log("dateqq11111111111",result)
>>>>>>> e5a7927e2a6ed888305eda1ef826b5caada94ea7

            response.data.data.forEach((entry: any) => {
                console.log("Operation Name:", entry.obbOperation.operation.name);
                setdata1( entry.obbOperation.operation.name)
            });

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
<<<<<<< HEAD
                        <SmvBarChart tsmv={tsmv} data={barchartData} operationName={operationName} />
=======
                        <SmvBarChart tsmv={tsmv} data={barchartData}  />
>>>>>>> e5a7927e2a6ed888305eda1ef826b5caada94ea7
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