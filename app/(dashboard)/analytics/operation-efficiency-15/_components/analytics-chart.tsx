"use client"

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet, ProductionData } from "@prisma/client";

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    title: string;
}

type HourGroup = {
    [key: string]: {
        totalProduction: number;
        target: number;
        xAxis: number;
    };
}

const AnalyticsChart = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);
    const [heatmapData, setHeatmapData] = useState<number[][] | null>(null);
    const [heatmapCategories, setHeatmapCategories] = useState<string[] | null>(null);

    const processForHeatmap = (productionData: ProductionData[]) => {
        const intervalOperations: HourGroup[] = Array.from({ length: 48 }, () => ({})); // 4 intervals per hour * 12 hours = 48
        const xAxisCategories: string[] = [];
    
        productionData.forEach((item: any) => {
            const date = new Date(item.timestamp);
            // Calculate the index for 15-minute intervals, starting from 7:00 AM
            const baseHour = 7;
            const intervalsPerHour = 4; // Four 15-minute intervals per hour
            const hourIndex = date.getHours() - baseHour;
            const minuteIndex = Math.floor(date.getMinutes() / 15); // 0-14 -> 0, 15-29 -> 1, etc.
            const intervalIndex = hourIndex * intervalsPerHour + minuteIndex;
    
            if (intervalIndex >= 0 && intervalIndex < 48) { // Ensure within the 7:00 AM to 6:59 PM range
                const intervalGroup = intervalOperations[intervalIndex];
                const operation = intervalGroup[item.obbOperationId] || { 
                    totalProduction: 0, 
                    target: item.obbOperation.target / 4, 
                    xAxis: item.obbOperation.operation.name 
                };
    
                operation.totalProduction += item.productionCount;
                intervalGroup[item.obbOperationId] = operation;
            }
        });
    
        const efficiencyData = intervalOperations.map(intervalGroup => {
            const operations = Object.values(intervalGroup);
            operations.forEach(op => {
                if (!xAxisCategories.includes(op.xAxis.toString())) {
                    xAxisCategories.push(op.xAxis.toString());
                }
            });
            return operations.map(op => Number(((op.totalProduction / op.target) * 100).toFixed(1)));
        });
    
        return { efficiencyData, xAxisCategories };
    };
    

    const handleFetchProductions = async (data: {obbSheetId: string; date: Date }) => {
        try {
            const formattedDate = data.date.toISOString().split('T')[0];

            const response = await axios.get(`/api/efficiency/production?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);

            console.log("DATA", response.data.data);
            
            const heatmapData = processForHeatmap(response.data.data);
            setHeatmapData(heatmapData.efficiencyData);
            setHeatmapCategories(heatmapData.xAxisCategories);
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
        <div className="mx-auto max-w-7xl">
            <SelectObbSheetAndDate 
                obbSheets={obbSheets}
                handleSubmit={handleFetchProductions}
            />
            {heatmapData !== null && heatmapCategories !== null ? 
                <div className="mt-12">
                    <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2>
                    <HeatmapChart
                        xAxisLabel='Operations'
                        height={1800}
                        type='15min'
                        efficiencyLow={obbSheet?.efficiencyLevel1}
                        efficiencyHigh={obbSheet?.efficiencyLevel3}
                        heatmapData={heatmapData}
                        heatmapCategories={heatmapCategories}
                    />
                </div>
            :
                <div className="mt-12 w-full">
                    <p className="text-center text-slate-500">Please select the OBB sheet and date ☝️</p>
                </div>
            }
        </div>
    )
}

export default AnalyticsChart