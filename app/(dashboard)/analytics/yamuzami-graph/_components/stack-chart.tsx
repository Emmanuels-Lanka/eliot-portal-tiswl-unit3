
"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { getOperatorEfficiency, getSMV } from "./actions"

export const description = "A stacked bar chart with a legend"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
 
  nnva: {
    label: "Necessary Non Value Added",
    color: "hsl(var(--chart-4))",
  },
  nva: {
    label: "Non Value Added",
    color: "hsl(var(--chart-1))",
  },
  
  earnMinutes: {
    label: "Earn Minutes",
    color: "hsl(var(--chart-2))",
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
    const [chartWidth, setChartWidth] = useState<number>(250);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);
    const[smvData,setSmvData] = useState<any[]>([])


const Fetchdata = async () => {
  try {
     
      setisSubmitting(true)
      const smvs :any = await getSMV(obbSheetId, date,timeValue)
      const prods:any = await getOperatorEfficiency(obbSheetId,date,timeValue)

     console.log("test",date,obbSheetId,timeValue)
      console.log(smvs)
      console.log(prods)
      const joined = [] 

      for (const smv of smvs) {
        for (const prod of prods){
          if(smv.name === prod.name)
            joined.push({...smv,...prod})
        }
      }

      console.log("j",joined)
      setSmvData(joined)

  
   
     

      const convertToMinutes = (timeString: string) => {
        const [hours, minutes, seconds] = timeString.split(' ').map(time => parseInt(time.replace(/\D/g, ''), 10) || 0);
        return hours * 60 + minutes + seconds / 60;
      };
     
      const chartData: smvData[] = joined.map((item) => 
        
        { 
          const em = item.count*item.avg;
          const nm = 60-em; 

         
           console.log(item)         


           const lb=convertToMinutes(item.lunchBreakTime);
           const md=convertToMinutes(item.mechanicDownTime);
           const ne=convertToMinutes(item.nonEffectiveTime);
           const os=convertToMinutes(item.offStandTime);
           const pd=convertToMinutes(item.productionDownTime);
           const tt=convertToMinutes(item.totalTime);

           const nnva= os+lb;
           const nva = (tt-(em+md+pd)-nnva);

          //  console.log(nnva,nva,item.name) 
           


          // Process mechanic down time

          return {
          
            // name:item.name,
            // seqNo:item.seqNo,
            // count:item.count,
            // earnMinutes:em,
            // smv:nm
            name:item.name,
            seqNo:item.seqNo,
            count:item.count,
            earnMinutes:em,
            nva:nva,
            nnva:nnva,
            smv:nm
            
      }}
      
      );
     console.log(chartData)
      setChartDatas(chartData)

  }

  catch (error) {
      console.error("Error fetching data:", error);
  }
  setisSubmitting(false)

};


useEffect(() => {
  Fetchdata()
}, [date, obbSheetId,timeValue])

  return (
    <div className='bg-slate-50 pt-5 -pl-8 rounded-lg border w-full mb-16 overflow-x-auto'>

    <Card style={{ width: 200 + "%", height: 200 + "%" }}>
      {/* <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      <CardContent >
        <ChartContainer config={chartConfig} >
          <BarChart accessibilityLayer data={chartDatas}
          margin={{
            top: 0,
            bottom: 200
        }}
        
        barGap={10}>
            <CartesianGrid vertical={false} />
            <XAxis
                                    dataKey="name"
                                    tickLine={true}
                                    tickMargin={10}
                                    axisLine={true}
                                    angle={90}
                                    interval={0}
                                    textAnchor='start'
                                />
                                <YAxis
                                    dataKey="nva"
                                    type="number"
                                    tickLine={true}
                                    tickMargin={10}
                                    axisLine={true}

                                />
            <ChartTooltip content={<ChartTooltipContent  />} />
            <ChartLegend content={<ChartLegendContent />} 
                  verticalAlign="top"
            
            />
            <Bar
              dataKey="earnMinutes"
              stackId="a"
              fill="var(--color-earnMinutes)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="nva"
              stackId="a"
              fill="var(--color-nva)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="nnva"
              stackId="a"
              fill="var(--color-nnva)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
     
    </Card>
    </div>
  )
}
