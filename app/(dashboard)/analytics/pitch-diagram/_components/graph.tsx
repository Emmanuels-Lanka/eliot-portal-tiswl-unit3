"use client"
import React, { useEffect, useState } from 'react'
import { AnalyticsChartProps } from './analytics'

import { TrendingUp } from "lucide-react"
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getOperationSmv, getTargetValues } from './action'
export const description = "A line chart with a label"

const GraphCompo  = ({date,obbSheet}:any) => {

    const [chartData, setChartData] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(170);

      const chartConfig = {
        desktop: {
          label: "Desktop",
          color: "hsl(var(--chart-1))",
        },
        mobile: {
          label: "Mobile",
          color: "hsl(var(--chart-2))",
        },
      } satisfies ChartConfig
      


      const Fetchdata = async () => {
        try {          
            
            
            // setisSubmitting(true)
            const ops = await getOperationSmv(obbSheet, date)
            const vls = await getTargetValues(obbSheet)
        
           console.log(ops)

            const newProd = ops.map((o) => ({
                ...o, // Spread the current operation
                ...vls // Spread the values from vls
            }));
            
           
            console.log("nnn",newProd)
           
            const chartData: any[] = newProd.map((item: any) => {

                const man = item[0].obbManPowers
                const tsmv = item[0].tsmv

                const target= tsmv/man
                console.log("na",target)

              
                return(
                  
                
                {
                name:item.seqNo+"-"+item.name,
               
                smv:item.smv,
                target:target
                
        

          

            })}
            
            );
           
            setChartData(chartData)
            console.log("chart",chartData)
        }

        catch (error) {
            console.error("Error fetching data:", error);
        }
        // setisSubmitting(false)

    };

    useEffect(() => {
        Fetchdata()
        
    }, [date, obbSheet])



  return (
   <div>
  
  {chartData.length > 0 ?
    <div className='bg-slate-50 pt-5 -pl-8 rounded-lg border w-full h-[450px] mb-16 overflow-scroll'>
    <Card className='bg-slate-50 pt-4' style={{width:(chartWidth)+"%"}}>
      
      <CardContent>
        <ChartContainer 
        config={chartConfig} className={`min-h-[300px] max-h-[600px] `} style={{ width: chartWidth + "%", height: 600 + "%" }}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
              bottom: 200
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={true}
                                    tickMargin={15}
                                    axisLine={true}
                                    angle={90}
                                    interval={0}
                                    textAnchor='start'
            />
            <YAxis
              dataKey="smv"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="smv"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
                
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
            <Line
                                dataKey="target"
                                type="linear" // Use linear type for a straight line
                                stroke="red" // Change the color as needed
                                strokeWidth={2}
                                dot={false} // No dots on the target line
                                // strokeDasharray="5 5" // Optional: make it dashed
                            />

          </LineChart>
        </ChartContainer>
      </CardContent>
 
    </Card>
    </div>
     : <div className="mt-12 w-full">
     <p className="text-center text-slate-500">No Data Available.</p>
 </div>
  }
    
   
   </div>
  )
}

export default GraphCompo 