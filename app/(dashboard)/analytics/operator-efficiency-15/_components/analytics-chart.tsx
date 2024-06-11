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

interface OperatorGroup {
    totalProduction: number;
    operations: {
        [key: string]: {
            productionCount: number;
            target: number;
        };
    };
}

const AnalyticsChart = ({
    obbSheets,
    title
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [heatmapData, setHeatmapData] = useState<number[][] | null>(null);
    const [heatmapCategories, setHeatmapCategories] = useState<string[] | null>(null);
    const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);

    function processForHeatmap(productionData: ProductionData[]): { efficiencies: number[][], xAxisCategories: string[] } {
        const quarterHourOperators: { [index: number]: { [rfid: string]: OperatorGroup } } = Array.from({ length: 48 }, () => ({})); // 4 quarters per hour * 12 hours
        const xAxisCategories = new Set<string>();

        productionData.forEach((item: any) => {
            const date = new Date(item.timestamp);
            const quarterIndex = (date.getHours() - 7) * 4 + Math.floor(date.getMinutes() / 15); // Calculate the quarter index within the day

            if (quarterIndex >= 0 && quarterIndex < 48) {
                const operators = quarterHourOperators[quarterIndex] || {};
                const operator = operators[item.operatorRfid] || {
                    totalProduction: 0,
                    operations: {}
                };

                const operation = operator.operations[item.obbOperationId] || {
                    productionCount: 0,
                    target: item.obbOperation.target / 4 // Divide the target by 4 for quarter-hour
                };
                operation.productionCount += item.productionCount;
                operator.operations[item.obbOperationId] = operation;

                operator.totalProduction += item.productionCount;
                operators[item.operatorRfid] = operator;
                quarterHourOperators[quarterIndex] = operators;

                xAxisCategories.add(item.operator.name); // Assume the name is available in item.operator
            }
        });

        // Calculate efficiencies
        const efficiencies = Object.values(quarterHourOperators).map(operators => {
            return Object.values(operators).map(operator => {
                let totalProduction = 0;
                let weightedEfficiencySum = 0;

                Object.values(operator.operations).forEach(op => {
                    totalProduction += op.productionCount;
                    weightedEfficiencySum += op.productionCount * (op.productionCount / op.target * 100);
                });

                return totalProduction > 0 ? Number((weightedEfficiencySum / totalProduction).toFixed(1)) : 0;
            });
        });

        return {
            efficiencies,
            xAxisCategories: Array.from(xAxisCategories)
        };
    }

    const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
        try {
            data.date.setDate(data.date.getDate() + 1);
            const formattedDate = data.date.toISOString().split('T')[0];
            
            const response = await axios.get(`/api/efficiency/production?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);
            const { efficiencies, xAxisCategories } = processForHeatmap(response.data.data);

            setHeatmapData(efficiencies);
            setHeatmapCategories(xAxisCategories);
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
                {heatmapData !== null && heatmapCategories !== null ?
                    <div className="mt-12">
                        <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2>
                        <HeatmapChart
                            xAxisLabel='Operators'
                            height={1800}
                            type="15min"
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
        </>
    )
}

export default AnalyticsChart