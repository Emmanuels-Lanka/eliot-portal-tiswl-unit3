
"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
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
  obbSheetId: string
}

type smvDatas = {
  avg: number
  count: number
  name: string
  seqNo: string
  target: number
}


export function StackChart({ date, obbSheetId }: BarChartGraphProps) {


  const [chartDatas, setChartDatas] = useState<any[]>([])
    const [chartWidth, setChartWidth] = useState<number>(250);
    const [isSubmitting,setisSubmitting]=useState<boolean>(false)
    const chartRef = useRef<HTMLDivElement>(null);
    const[smvData,setSmvData] = useState<any[]>([])


const Fetchdata = async () => {
  try {
     
      setisSubmitting(true)
      const smvs = await getSMV(obbSheetId, date)
      const prods = await getOperatorEfficiency(obbSheetId,date)


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

  
   
      let workingHrs = (new Date().getHours() - 8) + new Date().getMinutes() / 60;
      workingHrs > 10 ? 10 : workingHrs

      
     
      const chartData: BarChartData[] = prods.map((item,index) => ({
          name:item.name,
         
          count: item.count,
          target: item.target * workingHrs,
          ratio: parseFloat((item.count / (item.target * workingHrs)*100).toFixed(2)),
          // ratio: (item.count / (item.target * workingHrs)) * 100,
          // ratio: parseFloat((item.count / (item.target * workingHrs)).toFixed(2))*100,
          

      })
      
      );
     
      setChartDatas(chartData)

  }

  catch (error) {
      console.error("Error fetching data:", error);
  }
  setisSubmitting(false)

};


useEffect(() => {
  Fetchdata()
}, [date, obbSheetId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              fill="var(--color-mobile)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
     
    </Card>
  )
}
