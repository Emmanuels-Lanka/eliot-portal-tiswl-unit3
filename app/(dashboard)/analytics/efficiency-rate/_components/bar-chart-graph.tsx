"use client"
import { FaPlus, FaMinus } from 'react-icons/fa';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { use, useEffect, useState } from "react";
import { getOperatorEfficiency } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const chartConfig = {
    target: {
        label: "",
        color: "hsl(var(--chart-1))",
    },

} satisfies ChartConfig
type BarChartData = {
    name: string;
    count: number;
    target: number;
    ratio: number;
}
interface BarChartGraphProps {

    date: string
    obbSheetId: string
}

const BarChartGraph = ({ date, obbSheetId }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<BarChartData[]>([])
    const [chartWidth, setChartWidth] = useState<number>(150);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)


    const Fetchdata = async () => {
        try {
            //     const getShortName = (name: any) => {
            //         const afterDot = name.split('.')[1]?.trim();
            //         return afterDot ? afterDot.split(' ')[0] : null;

            //   }
            const getShortName = (name: any) => {
                return name.substring(1, 10) + "..."

            }
            setisSubmitting(true)
            const prod = await getOperatorEfficiency(obbSheetId, date)
            console.log(date)
            let workingHrs = (new Date().getHours() - 8) + new Date().getMinutes() / 60;
            workingHrs > 10 ? 10 : workingHrs

            console.log("workingHrs", workingHrs)
            const chartData: BarChartData[] = prod.map((item,index) => ({
                name:item.name,
                count: item.count,
                target: item.target * workingHrs,
                ratio: parseFloat((item.count / (item.target * workingHrs)*100).toFixed(2)),
                // ratio: (item.count / (item.target * workingHrs)) * 100,
                // ratio: parseFloat((item.count / (item.target * workingHrs)).toFixed(2))*100,
                

            })
            
            );
            console.log("chart data", chartData)
            setChartData(chartData)

        }

        catch (error) {
            console.error("Error fetching data:", error);
        }
        setisSubmitting(false)

    };



    useEffect(() => {
        Fetchdata()
    }, [date, obbSheetId])

    useEffect(() => {
        const interval = setInterval(() => {
            Fetchdata();
        }, 60000);

        return () => clearInterval(interval);
    }, [date, obbSheetId]);




    return (
        <>
    <Loader2 className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")} />

            {chartData.length > 0 ?
                <Card className='pr-2 pt-1 pb-2 border rounded-xl bg-slate-50'>
                    <div className="px-8">
                        <CardHeader>
                            <CardTitle>Operation - Efficiency Rate(Live Data)</CardTitle>
                        </CardHeader>
                    </div>
                    <CardContent>
                        {/* <ChartContainer config={chartConfig} className={`min-h-[300px] max-h-[600px] w-[${chartWidth.toString()}%]`}> */}
                        <ChartContainer config={chartConfig} className={`min-h-[300px] max-h-[600px] `} style={{ width: chartWidth + "%", height: chartWidth + "%" }}>

                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 0,
                                    bottom: 300
                                }}
                                barGap={10}
                                className="h-[300px] "
                            >
                                <CartesianGrid vertical={false} />
                                <YAxis
                                    dataKey="ratio"
                                    type="number"
                                    tickLine={true}
                                    tickMargin={10}
                                    axisLine={true}
                                />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    tickMargin={140}
                                    axisLine={true}
                                    angle={90}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />

                                <Bar dataKey="ratio" fill="orange" radius={5}>
                                    <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={14}
                                    />
                                </Bar>
                                {/* <Bar dataKey="count" fill="var(--color-actual)" radius={5}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={14}
                            />
                        </Bar> */}
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                : <div className="mt-12 w-full">
                    <p className="text-center text-slate-500">No Data Available.</p>
                </div>
            }
            <div className="flex justify-center gap-2 mt-5 ">

                <Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300"><FaPlus size={12} color="#007bff" /></Button>
                <Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300"> <FaMinus size={12} color="#007bff" /></Button>

            </div>
            
        </>
    )
}

export default BarChartGraph