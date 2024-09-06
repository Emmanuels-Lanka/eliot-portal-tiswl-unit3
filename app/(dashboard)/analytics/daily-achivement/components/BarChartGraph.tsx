"use client";

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
import { useEffect, useState } from "react";
import { getData } from "../actions";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";


import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';

const chartConfig = {
  target: {
    label: "Target",
    color: "hsl(var(--chart-1))",
  },
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-2))",
  },
  count: {
    label: "Production",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type BarchartData = {
  name: string;
  count: number;
  target: number;
};
interface BarChartGraphProps {
  date: string;
  obbSheetId: string;
}

const BarChartGraph = ({ date, obbSheetId }: BarChartGraphProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const [productionData, setProductionData] = useState<BarchartData[]>([]);

  const [chartData, setChartData] = useState<BarchartData[]>([]);

  const[chartWidth,setChartWidth] = useState<number>(100)

  const chartRef = useRef<HTMLDivElement>(null);

  const[isSubmitting,setisSubmitting]=useState<boolean>(false)

  /////
  const handleFetchProductions = async () => {
    try {
      setisSubmitting(true)
      const prod = await getData(obbSheetId, date);

      setProductionData(prod);
      const seq=1;
      const chartData1: BarchartData[] = prod.map((item) => ({
        
        name: item.name,
        target: item.target * 10,
        count: item.count,
      }));
      setChartData(chartData1);

      router.refresh();
    } catch (error: any) {
      console.error("Error fetching production data:", error);
      toast({
        title: "Something went wrong! Try again",
        variant: "error",
        description: (
          <div className="mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md">
            <code className="text-slate-800">ERROR: {error.message}</code>

          </div>
        ),
      });
    }
    setisSubmitting(false)
  };
  ///

  useEffect(() => {
    if (date.length > 0 && obbSheetId.length > 0) {
      handleFetchProductions();
    }
    const intervalId = setInterval(() => {

      handleFetchProductions();

    }, 60000);

    return () => {
      clearInterval(intervalId);
    };


  }, [date, obbSheetId]);



  const saveAsPDF = async () => {
    if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('chart.pdf');
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
    
    
        <div className='mb-3'>
            <Button type="button" className='mr-3' onClick={saveAsPDF}>Save as PDF</Button>
            <Button type="button" onClick={saveAsExcel}>Save as Excel</Button>
        </div>


      {chartData.length > 0 ? (
        <Card className="pr-2 pt-6  border rounded-xl bg-slate-50 w-auto" style={{width:(chartWidth*1.5)+"%", height:chartWidth+"%"}}>
          <div className="px-8">
            <CardHeader>
              <CardTitle className="text-center">
                {" "}
                Daily Target vs Actual Production (LIVE Data)
              </CardTitle>
              {/* <CardDescription>Number of items came across each scanning points today</CardDescription> */}
            </CardHeader>
          </div>
          <CardContent>
            <ChartContainer
            ref={chartRef}
              config={chartConfig}
              className=" max-h-screen  min-h-[300px] w-full " 
              style={{width:chartWidth+"%", height:chartWidth+"%"}} 
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                  bottom: 200,
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
                  tickMargin={15}
                  axisLine={true}
                  angle={90}
                  fontSize={10}
                  interval={0}
                  textAnchor="start"
                  


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
                <Bar dataKey="count" fill="var(--color-actual)" radius={5}>
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
      ) : (
        <div className="mt-12 w-full">
          <p className="text-center text-slate-500">No Data Available...</p>
        </div>
      )
      }
      {<div className="flex justify-center gap-2 mt-5 2xl:hidden block">

<Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300">+</Button>
<Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300"> -</Button>

</div>
}
    </>
  );
};

export default BarChartGraph;
