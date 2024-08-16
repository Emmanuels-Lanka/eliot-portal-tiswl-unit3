"use client"

import { TrendingUp } from "lucide-react";
import { Line, LineChart,} from "recharts";
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
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
        <Card className="bg-slate-50">
            <CardHeader>
                <CardTitle>Hourly Production - Target vs Actual</CardTitle>
                {/* <CardDescription>January - June 2024</CardDescription> */}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    {/* <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 24,
                            left: 14,
                            right: 14,
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
                    </LineChart> */}



         <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                }}

              >
                <CartesianGrid vertical={false} />
                <YAxis
                  dataKey="target"
                  type="number"
                  tickLine={true}
                  tickMargin={10}
                  axisLine={true}
                />
                <XAxis
                  dataKey="name"
                  tickLine={true}
                  tickMargin={45}
                  axisLine={true}
                  angle={40}
                  fontSize={8}
                  interval={0}


                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend
                  verticalAlign="top"
                  content={<ChartLegendContent />}
                  className="mt-2 text-sm"
                />
                <Bar dataKey="target" fill="var(--color-target)" radius={5}>
                  <LabelList
                    position="top"
                    offset={7} // Increase the offset value
                    className="fill-foreground"
                    fontSize={9}
                  />
                </Bar>
                <Bar dataKey="actual" fill="var(--color-actual)" radius={5}>
                  <LabelList
                    position="top"
                    offset={20} // Increase the offset value
                    className="fill-foreground"
                    fontSize={9}
                  />
                </Bar>
              </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default LineChartGraph