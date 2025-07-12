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
// import { getHours, getOperatorEfficiency } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { count } from 'console';
import { newOperationEfficiencyOutputTypes } from './analytics';
import { finalDataTypes } from '../efficiency-rate/_components/analytics-chart';

const chartConfig = {
    efficiency: {
        label: "Operator Efficiency",
        color: "hsl(var(--chart-1))",
    },

} satisfies ChartConfig

type BarChartData = {
    count:number;
earnMinute: number;
efficiency:number;
name:string;
}
interface BarChartGraphProps {


    finalData : finalDataTypes[]
}

const EfficiencyBarChart = ({finalData}: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(250);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);


    const processProductionData = ()=> {

            setisSubmitting(true)
         
          
    setChartData(finalData)
        
        setisSubmitting(false)
    }

    useEffect(()=>{
        processProductionData()
    },[finalData])

    

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
   
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.9); // JPEG, 70% quality

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
      pdf.text('Dashboard - Operator Efficiency Overview', logoX + logoWidth + 20, 60, { align: 'left' });

      // Add chart image (JPEG, compressed)
      pdf.addImage(imgData, 'JPEG', 0, 100, canvas.width, canvas.height);

      pdf.save('Operator Efficiency Overview.pdf');
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
  <div className="flex justify-center ">
        <Loader2 className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")} />
       </div>
    
    
        

            {chartData.length > 0 ?
                    // <div className='bg-slate-100 pt-5 -pl-8 rounded-lg border w-full mb-16 overflow-x-auto'>

               <div className='w-full'>
  <Card className="w-full  rounded-2xl border border-slate-200 bg-white shadow-xl">
    <CardContent className="p-6">
<div className='flex justify-between items-center'>
        <h2 className="text-xl font-semibold text-gray-700 my-2">Operator Efficiency Overview</h2>
 <Button type="button" className="my-2 " onClick={saveAsPDF}>
            Save as PDF
          </Button>
</div>
      <div className="w-full overflow-auto">
        
        <p className="text-xs text-gray-500 italic my-2">📌 indicates operator has multiple operations</p>

        <div style={{ minWidth: Math.max(700, chartData.length * 50), maxHeight: 700 }}>
          <ChartContainer
            ref={chartRef}
            config={chartConfig}
            className="w-full h-full bg-slate-50 p-4 rounded-xl"
            style={{ width: "100%", height: 500 }}
          >
            <BarChart
              data={chartData}
              margin={{ top: 30, right: 30, left: 0, bottom: 250 }}
              barGap={24}
              className="h-[400px] w-full"
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <YAxis
                dataKey="efficiency"
                type="number"
                tickLine
                tickMargin={10}
                axisLine
              />
              <XAxis
                dataKey="operatorOperation"
                tickLine
                tickMargin={10}
                axisLine
                angle={90}
                interval={0}
                textAnchor='start'
              />
              <ChartTooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-lg shadow-xl border border-slate-200 bg-white/80 backdrop-blur text-xs">
                        <div><strong>Operation:</strong> {data.operation}</div>
                        <div><strong>Efficiency:</strong> {data.efficiency}%</div>
                        <div><strong>Sewing Machine:</strong> {data.machine}</div>
                        <div><strong>Operator RFID:</strong> {data.operatorId}</div>
                        <div><strong>Serial Number:</strong> {data.eliotSerialNumber}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="efficiency" fill="#0ea5e9" radius={5} barSize={50}>
                <LabelList
                  dataKey="efficiency"
                  position="top"
                  offset={10}
                  className="fill-slate-700"
                  fontSize={13}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

                
                : <div className="mt-12 w-full">
                    <p className="text-center text-slate-500">No Data Available.</p>
                </div>
            }
           {chartData.length > 0 && (
      <div className="flex flex-col items-center mt-5">
        

        {/* <div className="flex gap-3 mt-3">
          <Button type="button" className="mr-3" onClick={saveAsPDF}>
            Save as PDF
          </Button>
          <Button type="button" onClick={saveAsExcel}>
            Save as Excel
          </Button>
        </div> */}
      </div>
    )}
            
        </>
    )
}

export default EfficiencyBarChart