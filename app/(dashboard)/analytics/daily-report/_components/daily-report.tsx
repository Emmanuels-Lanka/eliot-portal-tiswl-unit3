"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useEffect, useState } from "react";
import { getDailyData } from "./actions";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-style-and-date";


interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
}

export type ReportData={
  id:string,
  operatorname:string,
  operationname:string,
  count:number,
  smv:number,
  target:number,
  efficiency: number
}
const ReportTable=({
  obbSheets,
}: AnalyticsChartProps)=>{

  const[date,setDate]=useState<string>("")
  const[data,setData]=useState<ReportData[]>([])
  const [obbSheetId, setObbSheetId] = useState<string>("");


  const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {


    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split('T')[0].toString() + "%";
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);
    console.log("formated date",formattedDate)

  };

  const calculateEfficiency = (reportData: ReportData[]) => {

    return reportData.map(d=> ({...d,efficiency:((d.count / (d.target*10)) * 100).toFixed(2)}))
    

    
  }

  const getDetails= async()=>{
const details=await getDailyData(obbSheetId,date)
const res = calculateEfficiency(details)
setData(res)
 
  }

  useEffect(()=>{
    getDetails()
   
    
  },[obbSheetId,date])
 

  return(
    <>
   <SelectObbSheetAndDate
            obbSheets={obbSheets}
            handleSubmit={handleFetchProductions}
          />
    <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead >Employment Id</TableHead>
      <TableHead>Operator Name</TableHead>
      <TableHead>Operation Name</TableHead>
      <TableHead >Target(100% SMV Target)</TableHead>
      <TableHead >Units Produced</TableHead>
      <TableHead >Efficiency(%)</TableHead>
      <TableHead >Achievement</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
  {data.map((d:any)=>(

     
<TableRow key={d.rid} className="bg-accent">
<TableCell>
    <div className="font-medium"></div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.operatorname}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.operationname}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.smv*100}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.count}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.efficiency}</div>
  </TableCell>
</TableRow>
))}
  </TableBody>
</Table>

    </>
  )
}

export default ReportTable;