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
import { getHours, getOperatorEfficiency } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { count } from 'console';
import { finalDataTypes } from './analytics-chart';

const chartConfig = {
    efficiency: {
        label: "Overall Efficiency",
        color: "hsl(var(--chart-1))",
    },

} satisfies ChartConfig
type BarChartData = {
    name: string;
    count: number;
    target: number;
    ratio: number;
    seqNo?:string
    realratio?:number;
}
interface BarChartGraphProps {

    date: string
    obbSheetId: string
    finalData : finalDataTypes[]
}

const BarChartGraphEfficiencyRate = ({ date, obbSheetId,finalData }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(250);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);

    const Fetchdata = async () => {
        try {          
           
            setisSubmitting(true)
         
            console.log(
                "asdasdasdadsa"
            )

           
            // const chartData: BarChartData[] = updatedData.map((item: any) => {

            //     const earnmins = item.count *item.avg
            //     const hours = item.timeGapHours 
              
            //     // Calculate the difference in milliseconds and convert it to hours
                
            //     // console.log("Working Hours:", workingHrs);
            //     return(
                  
                
            //     {
            //     name:item.seqNo+"-"+item.name,
               
            //     count: item.count,
            //     target: item.target * hours,
            //     ratio: Math.min(parseFloat(((earnmins / hours)).toFixed(2)), 200),
            //     realratio: parseFloat(((earnmins / hours)).toFixed(2))
            //     // ratio: (item.count / (item.target * workingHrs)) * 100,
            //     // ratio: parseFloat((item.count / (item.target * workingHrs)).toFixed(2))*100,
                

            // })}
            
            // );
           
            setChartData(finalData)
            // console.log("chart",chartData)
        }

        catch (error) {
            console.error("Error fetching data:", error);
        }
        setisSubmitting(false)

    };



    useEffect(() => {
        Fetchdata()
        
    }, [finalData])





    
    useEffect(() => {
        const chartWidths = Math.min(250, 100 + (chartData.length * 2));
        setChartWidth(chartWidths);
      }, [chartData]); 



    //create pdf
const saveAsPDF = async () => {
  if (chartRef.current) {
    // Downscale for smaller image
    const scale = 0.7; // adjust for quality/size tradeoff
    const canvas = await html2canvas(chartRef.current, {
      
      useCORS: true,
      background: "#fff",
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.7); // JPEG, 70% quality

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height + 100],
    });

    // Optional: Add logo and title as before
    const baseUrl = window.location.origin;
    const logoUrl = `${baseUrl}/logo.png`;
    const logo = new Image();
    logo.src = logoUrl;
    logo.onload = () => {
      const logoWidth = 110;
      const logoHeight = 50;
      const logoX = (canvas.width / 2) - (logoWidth + 100);
      const logoY = 30;

      pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
      pdf.setTextColor(0, 113, 193);
      pdf.setFontSize(20);
      pdf.text('Dashboard - Overall Operation Efficiency', logoX + logoWidth + 20, 60, { align: 'left' });

      // Add chart image (JPEG, compressed)
      pdf.addImage(imgData, 'JPEG', 0, 100, canvas.width, canvas.height);

      pdf.save('chart.pdf');
    };
  }
};

    
//create Excel sheet
    const saveAsExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(chartData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Chart Data");
        XLSX.writeFile(workbook, `chart-data.xlsx`);
    };

    


    return (
        <>
  <div className="flex w-full justify-center ">
        <Loader2 className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")} />
       </div>
    
    
       

            {chartData.length > 0 ? (
  <div className="w-full">
    <Card
      className="w-full shadow-xl rounded-2xl bg-white border border-slate-200"
      style={{
        margin: "0 auto",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
      }}
    >
      <CardContent className="p-4">
        <div className="w-full overflow-x-auto">
          <div style={{ minWidth: Math.max(700, chartData.length * 120) }}>
            <ChartContainer
              ref={chartRef}
              config={chartConfig}
              className="w-full h-full"
              style={{ width: "100%", height: 500 }}
            >
              <BarChart
                data={chartData}
                margin={{ top: 30, right: 30, left: 30, bottom: 80 }}
                barGap={16}
                className="h-[400px] w-full"
              >
             
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <YAxis
            dataKey="efficiency"
            type="number"
            tickLine={false}
            tickMargin={12}
            axisLine={false}
            fontSize={12}
            stroke="#888"
          />
          <XAxis
            dataKey="operation"
            tickLine={false}
            tickMargin={16}
            axisLine={false}
            angle={-30}
            interval={0}
            textAnchor="end"
            fontSize={10}
            stroke="#888"
            height={60}
          />
          <ChartTooltip
  cursor={{ fill: "rgba(0,0,0,0.04)" }}
  content={({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-white rounded shadow text-xs">
          <div><strong>Operator:</strong> {data.name || data.operator}</div>
          <div><strong>Efficiency:</strong> {data.efficiency ?? data.ratio}</div>
        </div>
      );
    }
    return null;
  }}
/>
          <Bar dataKey="efficiency" fill="#FF9800" radius={[8, 8, 0, 0]} maxBarSize={48}>
            <LabelList
              dataKey="efficiency"
              position="top"
              offset={8}
              className="fill-foreground"
              fontSize={10}
            />
          </Bar>
        </BarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>)
                : <div className="mt-12 w-full">
                    <p className="text-center text-slate-500">No Data Available.</p>
                </div>
            }
           {chartData.length > 0 && (
      <div className="flex flex-col items-center mt-5">
        <div className="flex gap-2">
          <Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300">
            +
          </Button>
          <Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300">
            -
          </Button>
        </div>

        <div className="flex gap-3 mt-3">
          <Button type="button" className="mr-3" onClick={saveAsPDF}>
            Save as PDF
          </Button>
          <Button type="button" onClick={saveAsExcel}>
            Save as Excel
          </Button>
        </div>
      </div>
    )}
            
        </>
    )
}

export default BarChartGraphEfficiencyRate