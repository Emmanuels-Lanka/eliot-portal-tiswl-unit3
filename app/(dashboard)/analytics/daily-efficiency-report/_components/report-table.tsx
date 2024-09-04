"use client"

import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
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

interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
}
export type ReportData={
 name:string,
 buyer:string,
 style:string,
 smv:number,
 target:number,
 count:number,
 startingDate:string
}



const DailyEfficiencyReport=({obbSheets}:AnalyticsChartProps)=>{
  const[date,setDate]=useState<string>("")
  const[data,setData]=useState<ReportData[]>([])
  const [obbSheetId, setObbSheetId] = useState<string>("");

  const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {

    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split('T')[0].toString() + "%";
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);
  

  };


  const getDetails= async()=>{

    const details=await getDailyData(obbSheetId,date)
          
    setData(details)
    
    
     
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
      <TableHead >Line No</TableHead>
      <TableHead>Buyer</TableHead>
      <TableHead>Style</TableHead>
      <TableHead>smv</TableHead>
      <TableHead>cm $</TableHead>
      <TableHead>In put Date</TableHead>
      <TableHead>Run Day</TableHead>
      <TableHead>Manpow</TableHead>
      <TableHead>P/Day WIP</TableHead>
      <TableHead>Per Hour Target</TableHead>
      <TableHead>Target</TableHead>
      <TableHead>Prod.</TableHead>
      <TableHead>Working Hour</TableHead>
      <TableHead>commit ment Tgt</TableHead>
      <TableHead>(+)/(-) qty</TableHead>
      <TableHead>Avg Achieve ment%</TableHead>
      <TableHead>Overall Eff%</TableHead>
      <TableHead>Per Hour PCS</TableHead>
      <TableHead>Commitment Tgt Hour</TableHead>
      <TableHead>Commitment Tgt/Prod</TableHead>
      <TableHead>REMARKS</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    
    {data.map((d:any)=>(
<TableRow key={d.name} className="bg-accent">
<TableCell>
    <div className="font-medium align-center">{d.name}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.buyer}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.style}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium"></div>
  </TableCell>
  </TableRow>
))}
    
  </TableBody>
</Table>

   </>
  )
}


export default DailyEfficiencyReport;