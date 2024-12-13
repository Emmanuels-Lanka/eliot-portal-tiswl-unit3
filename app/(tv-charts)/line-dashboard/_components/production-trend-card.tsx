"use client"

import { useEffect, useState } from 'react';
import { addHours, format, parse } from "date-fns";

import { cn } from '@/lib/utils';
import { fetchPassProductionData } from '../_actions/fetch-pass-production-data';
import { ProductionTrendLineChart } from './charts/production-trend-line-chart';

interface ProductionTrendCardProps {
    obbSheetId: string;
    productionTarget: number;
    workingHours: number;
}

type ProductionDataType = {
    id: string;
    obbSheetId: string | null;
    createdAt: Date;
    timestamp: string;
    productId: string;
    qcStatus: string;
    qcPointId: string;
    obbOperationId: string | null;
    operatorId: string | null;
    operatorName: string | null;
    part: string;
}[];

type ChartDataType = {
    hour: string;
    target: number;
    production: number;
}[];

const ProductionTrendCard = ({
    obbSheetId,
    productionTarget,
    workingHours,
}: ProductionTrendCardProps) => {
    const [chartData, setChartData] = useState<ChartDataType>([]);
    const workStartTime = "2024-12-12 08:00:00";

    // Helper function to generate hourly targets
    function generateHourlyTargets(
        dayTarget: number,
        workingHours: number,
        workStartTime: string
    ) {
        const hourlyTarget = dayTarget / workingHours;
        const targets: { hour: string; cumulativeTarget: number }[] = [];

        const startTime = parse(workStartTime, "yyyy-MM-dd HH:mm:ss", new Date());

        let cumulativeTarget = 0;
        for (let i = 0; i < workingHours + 1; i++) {
            const currentHour = addHours(startTime, i);
            const nextHour = addHours(currentHour, 1);

            // Skip 13:00 hour group
            if (format(currentHour, "HH:mm") === "12:00") continue;

            cumulativeTarget = Math.min(cumulativeTarget + hourlyTarget, dayTarget);
            targets.push({
                hour: format(nextHour, "HH:mm"),
                cumulativeTarget: Math.round(cumulativeTarget),
            });
        }

        return targets;
    }

    // Helper function to group production data by hour
    function groupProductionByHour(
        productionData: ProductionDataType,
        workStartTime: string,
        workingHours: number
    ) {
        const groupedProduction: { [hour: string]: number } = {};
        const startTime = parse(workStartTime, "yyyy-MM-dd HH:mm:ss", new Date());

        let cumulativeProduction = 0;

        for (let i = 0; i < workingHours + 1; i++) {
            const currentHour = addHours(startTime, i);

            // Skip 13:00 hour group
            if (format(currentHour, "HH:mm") === "12:00") continue;

            const nextHour = addHours(currentHour, 1);

            groupedProduction[format(currentHour, "HH:mm")] = cumulativeProduction;

            // Accumulate production for the current hour
            productionData.forEach((data) => {
                const productionTime = parse(data.timestamp, "yyyy-MM-dd HH:mm:ss", new Date());
                if (
                    productionTime >= currentHour &&
                    productionTime < (format(currentHour, "HH:mm") === "12:00" ? addHours(nextHour, 2) : nextHour)
                ) {
                    cumulativeProduction++;
                }
            });

            groupedProduction[format(nextHour, "HH:mm")] = cumulativeProduction;
        }

        return groupedProduction;
    }

    // Combine target and production data
    function generateTrendChartData(
        dayTarget: number,
        workingHours: number,
        workStartTime: string,
        productionData: ProductionDataType
    ) {
        const hourlyTargets = generateHourlyTargets(dayTarget, workingHours, workStartTime);
        const productionGrouped = groupProductionByHour(productionData, workStartTime, workingHours);

        return hourlyTargets.map((target) => ({
            hour: target.hour,
            target: target.cumulativeTarget,
            production: productionGrouped[target.hour] || 0,
        }));
    }

    useEffect(() => {
        (async () => {
            const productionData = await fetchPassProductionData(obbSheetId);
            console.log("RESSSS", productionData);

            const trendData = generateTrendChartData(productionTarget, workingHours, workStartTime, productionData);
            console.log(trendData);
            setChartData(trendData);
        })();
    }, []);

    return (
        <div className='h-full w-full bg-white p-4 flex flex-col items-start gap-x-2 rounded-xl'>
            <p className='text-lg font-medium text-slate-500 tracking-[0.01em]'>Production Trend</p>
            {chartData.length > 0 &&
                <ProductionTrendLineChart data={chartData} />
            }
        </div>
    )
}

export default ProductionTrendCard