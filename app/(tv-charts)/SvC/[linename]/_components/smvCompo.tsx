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
import { getSMV } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const chartConfig = {
    smv: {
        label: "SMV",
        color: "hsl(var(--chart-1))",
    },
    avg: {
        label: "Cycle Time",
        color: "hsl(var(--chart-2))",
    },
    realavg: {
        label: "Average",
        color: "hsl(var(--chart-3))",
    }
} satisfies ChartConfig

type BarChartData = {
    smv:number;
    name:string;
    avg: number;
    machineId?:string;
    realavg?:any;
};

interface BarChartGraphProps {
    date: string
    obbSheetId: string
}



const BarChartGraphOpSmv = ({ date, obbSheetId }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<BarChartData[]>([])
    const [productionData, setProductionData] = useState<BarChartData[]>([]);

    const[chartWidth,setChartWidth] = useState<number>(120)
    const[isSubmitting,setisSubmitting]=useState<boolean>(false)

    const chartRef = useRef<HTMLDivElement>(null);

    const Fetchdata = async () => {
        
        try {


            setisSubmitting(true)
        const prod = await getSMV(obbSheetId, date)
        console.log("first",prod)
        // setProductionData(prod)
        
              
      
            const chartData1: BarChartData[] = prod.map((item) => ({
               name:item.name+"-"+"( "+item.machineId+" )",
               smv:item.smv,
            //    avg:Number(item.avg.toFixed(2))
             avg:Number(parseFloat(item.avg.toString()).toFixed(2)),
             realavg:Math.floor(((((Number(parseFloat(item.avg.toString()).toFixed(2)))/item.smv)))*100)+"%",

            }));
            console.log("AVG values:", chartData1.map(item => item.avg));
            setProductionData(chartData1)
            setChartData(chartData1)
            console.log("chart data",chartData1)
            
            
            } 
            catch (error) {
            console.error("Error fetching data:", error);
        }
        setisSubmitting(false)
        
    };

    useEffect(() => {

        
        if(obbSheetId){
        Fetchdata()
        
        }
    }, [obbSheetId,date])


    useEffect(() => {
        const chartWidths = Math.min(250, 100 + (chartData.length * 2));
        setChartWidth(chartWidths);
      }, [chartData]); 

    


// const renderCustomLabel = ({ x, y, width, value, index }: any) => {
//     const realAvgValue = chartData[index]?.realavg || 0;
//     return (
//         <text x={x + width -15} y={y - 5} fill="black" fontSize={11} fontFamily="Inter">
//             {`${value} (${realAvgValue})`}
//         </text>
//     );
// };


    return (
  <>
    <div className="flex justify-center py-4">
      <Loader2 className={cn("animate-spin w-7 h-7", !isSubmitting && "hidden")} />
    </div>

   {chartData.length > 0 && (
  <div className="w-full flex justify-center px-2 sm:px-4">
    <div className="w-full max-w-[1850px] bg-slate-50 rounded-lg border shadow-md">
      <Card className="bg-slate-50 w-full border-none shadow-none">
        <CardContent className="p-4">
          <div className="w-full" style={{ height: "700px" }}>
          <ChartContainer config={chartConfig} ref={chartRef} style={{ width: "100%", height: "100%" }}>
            <BarChart
              data={chartData}
              margin={{ top: 60, bottom: 220 }}
              barCategoryGap={chartData.length > 20 ? "10%" : "20%"}
              barGap={2}
            >
              <CartesianGrid vertical={false} />
              <YAxis
                dataKey="smv"
                type="number"
                tickLine
                tickMargin={10}
                axisLine={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                angle={90}
                fontSize={11}
                interval={0}
                textAnchor="start"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <ChartLegend content={<ChartLegendContent />} verticalAlign="top" />

              <Bar dataKey="smv" fill="var(--color-avg)" radius={3} barSize={chartData.length > 20 ? 8 : 1}>
                  
                <LabelList position="top" offset={8} className="fill-green-600" fontSize={10} fontFamily="Inter"    />
              </Bar>

              <Bar dataKey="avg" fill="orange" radius={3} barSize={chartData.length > 20 ? 8 : 12}>
                <LabelList
                  position="top"
                  offset={8}
                  className="fill-orange-600 "
                  fontSize={10}
                  fontFamily="Inter"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
)}


    {/* {chartData.length > 0 && (
      <div className="flex flex-col items-center mt-5 gap-4 px-2 sm:px-4 lg:px-8">
        <div className="flex gap-4 flex-wrap justify-center">
          <Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300">
            +
          </Button>
          <Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300">
            -
          </Button>
        </div>

      
      </div>
    )} */}
  </>
);

}

export default BarChartGraphOpSmv