"use client"

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";

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

    const handleFetchProductions = async (data: {obbSheetId: string; date: Date }) => {
        console.log(data.date.toISOString().split('T')[0]);
    }
    
    return (
        <div className="mx-auto max-w-7xl">
            <SelectObbSheetAndDate 
                obbSheets={obbSheets}
                handleSubmit={handleFetchProductions}
            />
            <div className="mt-12">
                <h2 className="text-lg mb-2 font-medium text-slate-700">{title}</h2>
                <HeatmapChart
                    xAxisLabel='Operations'
                    height={580}
                />
            </div>
        </div>
    )
}

export default AnalyticsChart