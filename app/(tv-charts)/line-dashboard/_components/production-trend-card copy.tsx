"use client"

import { useEffect, useState } from 'react';
import { addHours, format, parse } from "date-fns";

import { cn } from '@/lib/utils';
import { fetchPassProductionData } from '../_actions/fetch-pass-production-data';

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

const ProductionTrendCard = ({
    obbSheetId,
    productionTarget,
    workingHours,
}: ProductionTrendCardProps) => {
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

            // Skip 13:00 hour group
            if (format(currentHour, "HH:mm") === "13:00") continue;

            cumulativeTarget = Math.min(cumulativeTarget + hourlyTarget, dayTarget);
            targets.push({
                hour: format(currentHour, "HH:mm"),
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
            if (format(currentHour, "HH:mm") === "13:00") continue;

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

            groupedProduction[format(currentHour, "HH:mm")] = cumulativeProduction;
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
        })();
    }, []);

    return (
        <div className='h-full w-full bg-white pl-2 pr-4 flex items-center gap-x-2 rounded-xl'>
            {/* <img src='/icons/tv/wip.gif' alt="efficiency" className={cn("size-[12vh] p-5 pointer-events-none")} /> */}
            <div className='w-full'>
                <p className='text-lg font-medium text-slate-500 tracking-[0.01em]'>Production Trend</p>
                {/* <p className={cn("mt-1 font-semibold text-3xl text-pink-600")}>{count}</p> */}
            </div>
        </div>
    )
}

export default ProductionTrendCard