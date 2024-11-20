"use client"
// import { FaPlus, FaMinus } from 'react-icons/fa';
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
import { getChecked, getDefects, getEfficiencyData, getProducts } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import React, { useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { count } from "console";

const chartConfig = {
    target: {
        label: "No of Target",
        color: "hsl(var(--chart-1))",
    },
    count: {
        label: "Defects Per Hundred Units   ",
        color: "hsl(var(--chart-2))",
    },

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
    obbSheetId?: string
    unit?:string
}

export type defectData = {
    target:number,
    count: number
}
export type EfficiencyData = {
    operatorRfid: string,
name: string,
min: string,
max: string,
offStandTime: string
}


export interface DataRecord {

    seqNo: number;

    operatorRfid: string;

    name: string;

    smv: number;

    sum: number;

    type: string;

}

export interface tableType {

    earnMinute: number;

    max: string;

    min: string;

    name: string;

    offStandTime: string;

    operatorRfid: string;

    seqNo: number;

    smv: number;

    sum: string;

}

function timeDifferenceInMinutes(minTime: string, maxTime: string): number {

    // Convert the datetime strings to Date objects
    const minDate = new Date(minTime);
    const maxDate = new Date(maxTime);
    // Calculate the difference in milliseconds
    const timeDifferenceInMillis = maxDate.getTime() - minDate.getTime();
    // Convert milliseconds to minutes
    const differenceInMinutes = timeDifferenceInMillis / (1000 * 60);
    return differenceInMinutes;

}

function timeStringToMinutes(timeString: string): number {

   

    const timeParts = timeString.split(' ');


    let totalMinutes = 0;

    for (const part of timeParts) {

        const value = parseInt(part); // Get the numeric value

        if (part.includes('h')) {

            totalMinutes += value * 60; // Convert hours to minutes

        } else if (part.includes('m')) {

            totalMinutes += value; // Add minutes

        } else if (part.includes('s')) {

            totalMinutes += Math.floor(value / 60); // Convert seconds to minutes

        }

    }


    return totalMinutes;

}

const BarChartGraphEfficiencyRate = ({ date,unit }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(50);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);

    console.log("asdaidshbadbadbjahdba")
    const Fetchdata = async () => {
        try {
            
            setisSubmitting(true)
            

            const time = await getEfficiencyData(date+"%")
            const prod = await getProducts(date+"%")

            console.log("timeee",time)
            console.log("prood",prod)

            


            const newMap = prod.map((t)=> {
                const found = time.find((p)=> p.operatorRfid == t.operatorRfid)
                const earnMinute =( t.smv*t.count)
                return {
                    ...t,...found,earnMinute
                }
            })

            console.log("newMao",newMap)

          
           console.log("first",time,date)
           console.log("prd",prod)
           console.log("new",newMap)


        

            const abc = [
                {
                    "defectcount": "2",
                    "obbid": "ly8o5vu8-c9cFZB9SRxjo"
                  },
                  
              ]
            console.log("abc",abc)

            const newArr = time.map((t)=> {
                // const diff = timeDifferenceInMinutes(t.min,t.max)
                const offStand = timeStringToMinutes(t.offStandTime)
                return {
                    // ...t,diff,offStand
                }
            })

            console.log("asdasdasd",newArr)
           



          

           
            setChartData(abc)

        }

        catch (error) {
            console.error("Error fetching data:", error);
        }
        setisSubmitting(false)

    };



    useEffect(() => {
        Fetchdata()
        const chartWidths = Math.min(250, 110 + (chartData.length * 2));

    setChartWidth(chartWidths)
    }, [date, unit])

    useEffect(() => {
        const interval = setInterval(() => {
            Fetchdata();
        }, 60000);

        return () => clearInterval(interval);
    }, [date, unit]);



    


    return (
        <>
  <div className="flex justify-center ">
        <Loader2 className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")} />
       </div>
    
    
       

            {chartData.length > 0 ?
                    // <div className='bg-slate-100 pt-5 -pl-8 rounded-lg border w-full mb-16 overflow-x-auto'>

                <div className='bg-slate-50 pt-5 -pl-8 rounded-lg border w-full h-[600px] mb-16'>
                 <Card className='bg-slate-50' >
               
                    <CardContent>
                        {/* <ChartContainer config={chartConfig} className={`min-h-[300px] max-h-[600px] w-[${chartWidth.toString()}%]`}> */}
                        <ChartContainer 
                        ref={chartRef}
                        config={chartConfig} className={`min-h-[300px] max-h-[550px]  `} >

                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                
                                margin={{
                                    top: 50,
                                    bottom: 50
                                }}
                                barGap={10}
                                className="h-[300px] "
                            >
                                <CartesianGrid vertical={false} />
                                <YAxis
                                    dataKey="count"
                                    type="number"
                                    tickLine={true}
                                    tickMargin={10}
                                    axisLine={true}
                                />
                                <XAxis
                                    dataKey="line"
                                    tickLine={true}
                                    tickMargin={10}
                                    axisLine={true}
                                  
                                    interval={0}
                                    // textAnchor='start'
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />

<ChartLegend content={<ChartLegendContent />} className="mt-2 text-sm" verticalAlign='bottom' />

                                
                                <Bar dataKey="count" fill="orange" radius={5} barSize={40}>
                                    <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={12}
                                    />
                                </Bar>
                               
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                </div>
                : <div className="mt-12 w-full">
                    <p className="text-center text-slate-500">No Data Available.</p>
                </div>
            }
           
            
        </>
    )
}

export default BarChartGraphEfficiencyRate