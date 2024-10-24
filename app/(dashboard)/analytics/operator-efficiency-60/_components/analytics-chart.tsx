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

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title: string;
}

const AnalyticsChart = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<OperationEfficiencyOutputTypes>();
    const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);

    function processProductionData(productionData: ProductionDataForChartTypes[]): OperationEfficiencyOutputTypes {
        const hourGroups = ["7:00 AM - 8:00 AM", "8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM"];

        const getHourGroup = (timestamp: string): string => {
            const hour = new Date(timestamp).getHours();
            return hourGroups[Math.max(0, Math.min(11, hour - 7))];
        };

        const operatorsMap: { [key: string]: ProductionDataForChartTypes[] } = {};
        productionData.forEach(data => {
            if (!operatorsMap[data.operatorRfid]) {
                operatorsMap[data.operatorRfid] = [];
            }
            operatorsMap[data.operatorRfid].push(data);
        });
             
        const operations = Object.values(operatorsMap).map(group => ({
            operator: group[0],
            data: group
        })).sort((a, b) => a.operator.obbOperation.seqNo - b.operator.obbOperation.seqNo);

        const categories = operations.map(op => `${op.operator.obbOperation.operation.name} - ( ${op.operator.obbOperation.sewingMachine.machineId} ) - ${op.operator.obbOperation.seqNo}`);
        const machines = operations.map(op => ` ${op.operator.obbOperation.sewingMachine.machineId}`);
        const eliot = operations.map(op => ` ${op.data[0].eliotSerialNumber}`);
        const resultData = hourGroups.map(hourGroup => ({
            hourGroup,
            operation: operations.map(op => {
                const filteredData = op.data.filter(data => getHourGroup(data.timestamp) === hourGroup);
                const totalProduction = filteredData.reduce((sum, curr) => sum + curr.productionCount, 0);
                const earnMinutes = op.operator.obbOperation.smv * totalProduction
                const efficiency = filteredData.length > 0 ? (totalProduction === 0 ? 0 : (earnMinutes / 60) * 100) : null;
                return { name: `${op.operator.obbOperation.seqNo}-${op.operator.obbOperation.operation.name}`, efficiency: efficiency !== null ? parseFloat(efficiency.toFixed(1)) : null };
            })
        }));

        return {
            data: resultData,
            categories,
            machines,
            eliot
        };
    }

    const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0];

            const response = await axios.get(`/api/efficiency/production?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);
            const heatmapData = processProductionData(response.data.data);
            console.log("HEATMAP:", heatmapData.data);
            console.log("CATEGORIES:", heatmapData.categories);

            setHeatmapData(heatmapData);
            setObbSheet(response.data.obbSheet);

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
                {heatmapData ?
                    <div className="mt-12">
                        {/* <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2> */}
                        <EffiencyHeatmap
                            xAxisLabel='Operations'
                            height={800}
                            efficiencyLow={obbSheet?.efficiencyLevel1}
                            efficiencyHigh={obbSheet?.efficiencyLevel3}
                            heatmapData={heatmapData}
                        />
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