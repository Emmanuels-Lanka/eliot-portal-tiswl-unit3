"use client"

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

interface SmvBarChartProps {
    data: {
        hourGroup: string;
        smv: number | null;
    }[]
}

const chartConfig = {
    smv: {
        label: "Actual Cycle Time",
        color: "hsl(var(--chart-2))",
    }
} satisfies ChartConfig

const SmvBarChart = ({ 
    data
}: SmvBarChartProps) => {
    const chartData = data.map((item) => ({
        name: item.hourGroup,
        smv: item.smv,
    }));

    return (
        <Card className='pr-2 pt-6 pb-4 border rounded-xl bg-slate-50'>
            <div className="px-8">
                <CardHeader>
                    <CardTitle>Actual Cycle Time - Hourly</CardTitle>
                    {/* <CardDescription>Number of items came across each scanning points today</CardDescription> */}
                </CardHeader>
            </div>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[576px] w-full">
                    <BarChart 
                        accessibilityLayer 
                        data={chartData}
                        margin={{
                            top: 30,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis
                            dataKey="smv"
                            type="number"
                            tickLine={true}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <ChartLegend content={<ChartLegendContent />} className="mt-2 text-sm"/>
                        <Bar dataKey="smv" fill="var(--color-smv)" radius={5}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={14}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default SmvBarChart