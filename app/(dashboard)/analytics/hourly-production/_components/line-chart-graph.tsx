"use client"

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
    target: {
        label: "target",
        color: "hsl(var(--chart-1))",
    },
    actual: {
        label: "actual",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig
interface LineChartGraphProps {
    data: {
        name: string;
        count: number;
        target: number;
    }[]
}

const LineChartGraph = ({ data }: LineChartGraphProps) => {
    const chartData = data.map((item) => ({
        name: item.name,
        target: item.target,
        actual: item.count,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Line Chart - Target vs Actual</CardTitle>
                {/* <CardDescription>January - June 2024</CardDescription> */}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Line
                            dataKey="target"
                            type="natural"
                            stroke="var(--color-target)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-target)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground font-medium"
                                fontSize={14}
                            />
                        </Line>
                        
                        <Line
                            dataKey="actual"
                            type="natural"
                            stroke="var(--color-actual)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-actual)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground font-medium"
                                fontSize={14}
                            />
                        </Line>
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default LineChartGraph