"use client"
import React, { useEffect, useState } from 'react'
import { AnalyticsChartProps } from './analytics'

import { Loader2, TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"
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
import { getCapacity, getOperationSmv, getTargetValues } from './action'
import { cn } from '@/lib/utils'
export const description = "A line chart with a label"

const GraphCompo  = ({date,obbSheet}:any) => {

    const [chartData, setChartData] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(170);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)

      const chartConfig = {
        target: {
          label: "Target",
          color: "hsl(var(--chart-1))",
        },
        capacity: {
          label: "Capacity",
          color: "hsl(var(--chart-2))",
        },
      } satisfies ChartConfig
      


      const Fetchdata = async () => {
        try {          
            
          
            
            // setisSubmitting(true)
            setisSubmitting(true)
            const cap = await getCapacity(obbSheet,date)
            console.log("first",cap)
        
      
            
           
           
           
            const chartData: any[] = cap.map((item: any) => {

                const smv = Number(item.avg);
                const bundle =Number(item.bundleTime);
                const pers = Number(item.personalAllowance);
                const cap = Number((60 / (smv + bundle + ((pers / 100) * smv))).toFixed(2));
                

      

          


              
                return(
                  
                
                {
                  smv:smv,
                  bundle:bundle,
                  personalAllowance:pers,
                  capacity:cap,
                  name:item.name+" ("+item.machineId+" ) - "+item.seqNo  ,
                  target:item.target

                  // capacity:capacity
                // name:item.seqNo+"-"+item.name,
               
                // smv:item.smv,
                // target:target
                
        

          

            })}
            
            );
           
            setChartData(chartData)
            console.log("chart",chartData)
        }

        catch (error) {
            console.error("Error fetching data:", error);
        }
        setisSubmitting(false)

        // setisSubmitting(false)

    };

    useEffect(() => {
        Fetchdata()
        
    }, [date, obbSheet])



  return (
    <div>
      <Loader2
        className={cn("animate-spin w-7 h-7 hidden", isSubmitting && "flex")}
      />

      {chartData.length > 0 ? (
        <div className="bg-slate-50 pt-5 -pl-8 rounded-lg border w-full h-max-[600px] mb-16 overflow-scroll">
          <Card
            className="bg-slate-50 pt-4"
            style={{ width: chartWidth + "%" }}
          >
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className={`min-h-[200px] max-h-[600px] `}
                style={{ width: chartWidth + "%" }}
              >
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                    left: 12,
                    right: 25,
                    bottom: 260,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={true}
                    tickMargin={10}
                    axisLine={true}
                    angle={-90}
                    interval={0}
                    textAnchor="end"
                  />
                  <YAxis
                    dataKey="capacity"
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                    // label="Target"
                    //   tickFormatter={(value) => value.slice(0, 3)}
                  />
                 <ChartLegend
                  verticalAlign="top"
                  content={<ChartLegendContent />}
                  className="mb-10  text-sm"
                />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="capacity"
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
                      offset={10}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Line>
                  <Line
                    dataKey="target"
                    type="natural" // Use linear type for a straight line
                    stroke="green" // Change the color as needed
                    strokeWidth={2}
                    dot={{
                      fill: "green",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                    // dot={false} // No dots on the target line
                    // strokeDasharray="5 5" // Optional: make it dashed
                  >
                    <LabelList
                      position="top"
                      offset={10}
                      className="fill-foreground"
                      fontSize={12}
                    />
                    </Line>
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mt-12 w-full">
          <p className="text-center text-slate-500">No Data Available....</p>
        </div>
      )}
    </div>
  );
}

export default GraphCompo 