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

const chartConfig = {
    smv: {
        label: "Target SMV",
        color: "hsl(var(--chart-1))",
    },
    avg: {
        label: "Actual Cycle Time",
        color: "hsl(var(--chart-2))",
    }
} satisfies ChartConfig

type BarChartData = {
    smv:number;
    name:string;
    avg: number;
};

interface BarChartGraphProps {
    date: string
    obbSheetId: string
}



const BarChartGraph = ({ date, obbSheetId }: BarChartGraphProps) => {
    const [chartData, setChartData] = useState<BarChartData[]>([])
    const [productionData, setProductionData] = useState<BarChartData[]>([]);

    const[chartWidth,setChartWidth] = useState<number>(100)


    const Fetchdata = async () => {
        try {
            
        const prod = await getSMV(obbSheetId, date)
        // setProductionData(prod)
        console.log("ObbsheetId111",prod)
              
      
            const chartData1: BarChartData[] = prod.map((item) => ({
               name:item.name,
               smv:item.smv,
            //    avg:Number(item.avg.toFixed(2))
             avg:Number(parseFloat(item.avg.toString()).toFixed(2))

            }));
            console.log("AVG values:", chartData1.map(item => item.avg));
            setProductionData(chartData1)
            setChartData(chartData1)
            console.log("chart data",chartData1)
            
            
            } 
            catch (error) {
            console.error("Error fetching data:", error);
        }

    };

    useEffect(() => {

        
        if(obbSheetId){
        Fetchdata()
        }
    }, [obbSheetId,date])

    // useEffect(()=>{
    //     console.log("1firstq")
    // },[])
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         Fetchdata();
    //     }, 60000); 
    
    //     return () => clearInterval(interval);
    // }, [date, obbSheetId]);
   

    return (
        <>
        <Card className='pr-2 pt-6 pb-4 border rounded-xl bg-slate-50'>
            <div className="px-8">
                <CardHeader>
                    <CardTitle>Target SMV vs Actual Cycle Time</CardTitle>
                    {/* <CardDescription>Number of items came across each scanning points today</CardDescription> */}
                </CardHeader>
            </div>
            <CardContent className="w-auto h-auto" style={{width:chartWidth+"%"}}  >
                <ChartContainer config={chartConfig} className="min-h-[650px] w-auto"  style={{width:chartWidth+"%", height:chartWidth+"%"}} >
                    <BarChart 
                        accessibilityLayer 
                        data={chartData}
                        margin={{
                            top: 50,
                            bottom: 250
                        }}
                        startAngle={10}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis
                            dataKey="smv"
                            type="number"
                            tickLine={true}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={180}
                            axisLine={false}
                            angle={90}
                            fontSize={11}
                            // fontFamily="Inter"
                            // fontWeight={600}
                            // className="z-[999]"
                            
                            interval={0}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <ChartLegend 
                            content={<ChartLegendContent />} 
                            className="-mb-10 text-xs text-blue-500 font-bold" 
                            margin={{top:10}}
                            
                        />
                        <Bar dataKey="smv" fill="var(--color-smv)" radius={5} barSize={5}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={11}
                                fontFamily="Inter"
                            />
                        </Bar>
                         <Bar dataKey="avg" fill="var(--color-avg)" radius={5} barSize={5}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={11}
                                fontFamily="Inter"
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>

        <div className="flex justify-center gap-2 mt-5 ">

<Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300">+</Button>
<Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300"> -</Button>

</div>
        </>
    )
}

export default BarChartGraph