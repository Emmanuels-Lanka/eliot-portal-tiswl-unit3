"use client"

import { Loader2, TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getProduction, getSMV } from "../actions"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export const description = "A horizontal bar chart"

// const chartData = [
//     { month: "January", desktop: 186, mobile: 80 },
//     { month: "February", desktop: 305, mobile: 200 },
//     { month: "March", desktop: 237, mobile: 120 },
//     { month: "April", desktop: 73, mobile: 190 },
//     { month: "May", desktop: 209, mobile: 130 },
//     { month: "June", desktop: 214, mobile: 140 },
//   ]
const chartConfig = {
  desktop: {
    label: "workedTime",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "neutralTime",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type BarChartData = {
    smv:number;
    name:string;
    avg: number;
    machineId?:string;
    realavg?:any;
};



export function VerticalGraph() {


    const [chartData, setChartData] = useState<BarChartData[]>([])
    const[isSubmitting,setisSubmitting]=useState<boolean>(false)
    const[chartWidth,setChartWidth] = useState<number>(50)



    
    const Fetchdata = async () => {
        
    try {
        // setisSubmitting(true)
    const smv :any = await getSMV()

    const pCount : any = await getProduction();
    console.log("count",pCount)



    // setsmvuctionData(smv)

    
          
  
        // const chartData1: BarChartData[] =  smv.map((item:any) =>
        //      {
        //         const workedTime = item.avg * 60; // Convert avg to minutes per hour
        //         const neutralTime = 60 - workedTime;
        //         ({

        //             workedTime: workedTime.toFixed(2),
        //             neutralTime: neutralTime.toFixed(2),


        //    name:item.name+"-"+"( "+item.machineId+" )",
           
        // //    avg:Number(item.avg.toFixed(2))
        //  avg:Number(parseFloat(item.avg.toString()).toFixed(2)),


        // })});

        console.log("smv,",smv)
        const chartData1: BarChartData[] = smv.map((item: any) => {
            const workedTime = item.avg * 60; 
            const neutralTime = 60 - workedTime;
          
            return {
              name: item.name,
              avg: Number(parseFloat(item.avg.toString()).toFixed(2)),
              smv: item.smv,
              workedTime: workedTime.toFixed(2),
              neutralTime: neutralTime.toFixed(2),
            };
          });

        // setProductionData(chartData1)
         setChartData(chartData1)
        console.log("chart data",chartData1)
        
        
        } 
        catch (error) {
        console.error("Error fetching data:", error);
    }
    // setisSubmitting(false)
    
};



useEffect(() => {

        
   
    Fetchdata()


}, [])

useEffect(() => {
    if (chartData.length > 0) {
      const longestLabel = Math.max(...chartData.map(item => item.name.length));
      setChartWidth(longestLabel * 10);  
    }
  }, [chartData]);



  return (
    <>
    <div className="justify-center">
        <Loader2 className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")} />
        </div>

       






        <div className=' pt-5 -pl-8  bg-slate-50 rounded-lg border w-full mb-16 overflow-x-auto'>
    <Card className='pr-2 pt-6 pb-4 border rounded-xl bg-slate-50 w-fit'style={{width:chartWidth*2+"%"}}>
      {/* <CardHeader>
        <CardTitle>Bar Chart - Horizontal</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart

            height={1300}
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,    
            }}
          >
            <XAxis type="number"  hide />
            <YAxis


              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
             
               tickFormatter={(value) => value.slice(0, 30)}
               interval={0}
               tick={{
                
                textAnchor: 'end', 
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent  />}
            />
            <Bar
              dataKey="workedTime"
              stackId="a"
              fill="var(--color-desktop)"
              radius={[12, 0, 0, 12]}
            />
            <Bar
              dataKey="neutralTime"
              stackId="a"
              fill="var(--color-mobile)"
              radius={[0, 12, 12, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
    </div>
    
    
    </>
  )
}
