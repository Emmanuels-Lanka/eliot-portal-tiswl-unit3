"use client"

import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
target:number,
machine:string,
obboperation:string,
productionCount:number,
hour:number
}

const PmsEfficiencyReport=({obbSheets,}:AnalyticsChartProps)=>{
  const[date,setDate]=useState<string>("")
  const[data,setData]=useState<ReportData[]>([])
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const [minh, setMinh] = useState<number>(0);
  const [maxh, setMaxh] = useState<number>(0);

  const handleFetchData=async(data:{ obbSheetId: string; date: Date })=>{
    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split('T')[0].toString() + "%";
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);

  }

  const getData=async()=>{
    const details=await getDailyData(obbSheetId,date)
    const maxh=Math.max(...details.map(o => o.hour))
    const minh=Math.min(...details.map(o => o.hour))
    setMaxh(maxh);
    setMinh(minh);
    console.log("max hour",maxh)
    console.log("max hour",minh)
 console.log("details",details)
    setData(details)
  }

  useEffect(()=>{
    getData()
  },[obbSheetId,date])


  return(
    <>
       <SelectObbSheetAndDate
            obbSheets={obbSheets}
            handleSubmit={handleFetchData}
          />
          
           <Table className="mt-5">
  <TableCaption>Operator Daily Efficiency Report</TableCaption>
  <TableHeader>
      
    <TableRow>
      <TableHead >SL NO:</TableHead>
      <TableHead>Employee Information</TableHead>
      <TableHead>Machine Name</TableHead>
      <TableHead>Obb Operation</TableHead>
      <TableHead >Hourly Tgt</TableHead>
      {/* {(() => {
              const headers = [];
              for (let hour = minh; hour <= maxh; hour++) {
                headers.push(<TableHead key={hour}>Hour {hour}</TableHead>);
              }
              return headers;
            })()} */}

{(() => {
  const headers = [];
  for (let hour = minh; hour <= maxh; hour++) {
    headers.push(<TableHead key={hour}>Hour-{hour}</TableHead>);
  }
  return headers;
})()}
      <TableHead >D:Tgt</TableHead>
      <TableHead >D:Prod</TableHead>
      <TableHead >Prod/Hr</TableHead>
      <TableHead >Achievement%</TableHead>
      <TableHead >Eff%</TableHead>
      </TableRow>
  </TableHeader>
  <TableBody>
 {
  data.map((d:any,index:number)=>(
    <TableRow key={index}>
      <TableCell>
      <div className="font-medium align-center">{index+1}</div>
      </TableCell>
      <TableCell>
      <div className="font-medium align-center">{d.name}</div>
      </TableCell>
      <TableCell>
      <div className="font-medium align-center">{d.machine}</div>
      </TableCell>
      <TableCell>
      <div className="font-medium align-center">{d.obboperation}</div>
      </TableCell>
      <TableCell>
      <div className="font-medium align-center">{d.target}</div>
      </TableCell>
      {(() => {
                const cells = [];
                for (let hour = minh; hour <= maxh; hour++) {
                  const hourData = data.find(h => Number(h.hour) === hour&& h.name === d.name);
                  console.log("Hour being checked:", hour);
                  console.log("Hour data for", hour, ":", hourData);
                  cells.push(
                    <TableCell key={hour}>
                      <div className="font-medium align-center">
                        {hourData ? hourData.productionCount : 0}
                      </div>
                    </TableCell>
                  );
                }
                return cells;
              })()}
            </TableRow>
          ))}
      </TableBody>
</Table>
    </>
  )
}

export default PmsEfficiencyReport;