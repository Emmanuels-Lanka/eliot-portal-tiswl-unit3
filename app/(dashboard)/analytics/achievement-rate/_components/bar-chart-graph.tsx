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
import { useEffect, useState } from "react";
import { getOperatorEfficiency } from "./actions";

const chartConfig = {
    target: {
        label: "",
        color: "hsl(var(--chart-1))",
    },
    
} satisfies ChartConfig
type BarChartData={
    name: string;
    count: number;
    target: number;
    ratio:number;
}
interface BarChartGraphProps {
    
    date:string
    obbSheetId:string
}

const BarChartGraph = ({ date,obbSheetId}: BarChartGraphProps) => {
  const[chartData,setChartData]=useState<BarChartData[]>([])



  const Fetchdata = async () => {
    try {
        const getShortName=(name:any)=>{
            const parts = name.split(".");
            return parts.length > 1 ? parts.slice(1).join(".") : name;
          }
     const prod = await getOperatorEfficiency(obbSheetId, date)
     console.log(date)
     const chartData:BarChartData[] = prod.map((item) => ({
        name: getShortName(item.name),
        count:item.count,
        target:item.target,
        ratio: parseFloat((item.count / item.target).toFixed(2)),
        
    }));
    setChartData(chartData)
    
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    
  };

 useEffect(()=>{
    Fetchdata()
 },[date,obbSheetId])
    

   
    
   
    return (
        <>
       {chartData.length >0? 
        <Card className='pr-2 pt-6 pb-4 border rounded-xl bg-slate-50'>
            <div className="px-8">
                <CardHeader>
                    <CardTitle>Average Rate</CardTitle>
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
                            dataKey="ratio"
                            type="number"
                            tickLine={true}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={45}
                            axisLine={false}
                            angle={60}
                            
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <ChartLegend content={<ChartLegendContent />} className="mt-2 text-sm"/>
                        <Bar dataKey="ratio" fill="blue" radius={5}>
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
        :  <div className="mt-12 w-full">
        <p className="text-center text-slate-500">No Data Available.</p>
    </div>
}
        </>
    )
}

export default BarChartGraph