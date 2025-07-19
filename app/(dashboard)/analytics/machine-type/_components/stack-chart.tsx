
"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useRef, useState } from "react"
import { getMachineTypes, getOperatorEfficiency} from "./actions"
import { Button } from "@/components/ui/button"

export const description = "A stacked bar chart with a legend"

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
 
  count: {
    label: "No. of machines",
    color: "hsl(var(--chart-1))",
  }
  
  
} satisfies ChartConfig


type BarChartData = {
  name: string;
  count: number;
  target: number;
  ratio: number;
  seqNo?:string
}
interface BarChartGraphProps {

  date: string
  obbSheetId: string
  timeValue:string
}

type smvData = {
  earnMinutes: number;
count: number;
name: string;
seqNo: string;
smv:number;

}


export function  StackChart({ date, obbSheetId,timeValue }: BarChartGraphProps) {


  const [chartDatas, setChartDatas] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(100);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);
    const[smvData,setSmvData] = useState<any[]>([])
    

    

const Fetchdata = async () => {
  try {
     
      setisSubmitting(true)
     

     const machines = await  getMachineTypes(obbSheetId)

    const machineMap : {[key:string]:any[]} = {};
    machines.data.forEach(machine => {
      const type = machine.machineType;
      if(!machineMap[type]){
        machineMap[type] = [];

      }
      machineMap[type].push(machine)
    })

    const machineTypes = Object.values(machineMap).map((m)=>({
      type: m[0].machineType,
      count: m.length,
      brandName:m[0].brandName,
      isAssigned:m[0].isAssigned,
      isNotAssigned:m.filter((i:any)=>!i.isAssigned).length
    }))
    .sort((a, b) => a.type - b.type);
    
    console.log(machines,"mac")
     console.log(machineTypes,"macTypes")
   
      setChartDatas(machineTypes)

  }

  catch (error) {
      console.error("Error fetching data:", error);
  }
  setisSubmitting(false)

};

const saveAsPDF = async () => {
  if (chartRef.current) {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height + 150],
    });

    const baseUrl = window.location.origin;
    const logoUrl = `${baseUrl}/logo.png`;

    const logo = new Image();
    logo.src = logoUrl;
    logo.onload = () => {
      const logoWidth = 110;
      const logoHeight = 50;
      const logoX = (canvas.width / 2) - (logoWidth + 150); // Adjust to place the logo before the text
      const logoY = 50;

      // Add the logo to the PDF
      pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

      // Set text color to blue
      pdf.setTextColor(0,113,193); // RGB for blue

      // Set larger font size and align text with the logo
      pdf.setFontSize(24);
      pdf.text('Dashboard -Machine Types', logoX + logoWidth + 20, 83, { align: 'left' });

      // Add the chart image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 150, canvas.width, canvas.height);

      // Save the PDF
      pdf.save('chart.pdf');
    };
  }
};



//create Excel sheet




const saveAsExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(chartDatas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Chart Data");
  XLSX.writeFile(workbook, `chart-data.xlsx`);
};


useEffect(() => {
  Fetchdata()
}, [date, obbSheetId,timeValue])





  return (

<>
  {chartDatas.length > 0 ? (
    <div className="w-full">
      <Card className="w-full rounded-2xl border border-slate-200 bg-white shadow-xl mb-16">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 my-2">Machine types</h2>
            <div className="flex gap-3">
              <Button type="button" onClick={saveAsPDF}>
                Save as PDF
              </Button>
              <Button type="button" onClick={saveAsExcel}>
                Save as Excel
              </Button>
            </div>
          </div>

          <div className="w-full overflow-auto">
            {/* <p className="text-xs text-gray-500 italic my-2">📌 Legend or notes here</p> */}

            <div style={{ minWidth: Math.max(700, chartDatas.length * 50), maxHeight: 700 }}>
              <ChartContainer
                ref={chartRef}
                config={chartConfig}
                className="w-full h-full bg-slate-50 p-4 rounded-xl"
                style={{ width: '100%', height: 600 }}
              >
                <BarChart
                  data={chartDatas}
                  margin={{ top: 30, right: 30, left: 0, bottom: 100 }}
                  barGap={24}
                  className="h-[400px] w-full"
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <YAxis
                    dataKey="count"
                    type="number"
                    tickLine
                    tickMargin={10}
                    axisLine
                  />
                  <XAxis
                    dataKey="type"
                    tickLine
                    tickMargin={10}
                    axisLine
                    angle={-90}
                    interval={0}
                    fontSize={14}
                    textAnchor="end"
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 rounded-lg shadow-xl border border-slate-200 bg-white/80 backdrop-blur text-xs">
                            <div><strong>Type:</strong> {data.type}</div>
                            <div><strong>Count:</strong> {data.count}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ChartLegend
                    verticalAlign="top"
                    content={<ChartLegendContent />}
                    className="mt-2 text-sm"
                  />
                  <Bar dataKey="count" fill="var(--color-count)" radius={5}>
                    <LabelList
                      dataKey="count"
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

      {/* <div className="flex flex-col items-center mt-5">
        <div className="flex gap-2">
          <Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300">
            +
          </Button>
          <Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300">
            -
          </Button>
        </div>
      </div> */}
    </div>
  ) : (
    <div className="mt-12 w-full">
      <p className="text-center text-slate-500">No Data Available...</p>
    </div>
  )}
</>

  )
}
