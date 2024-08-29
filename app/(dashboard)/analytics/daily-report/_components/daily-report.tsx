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

import { useEffect, useRef, useState } from "react";
import { getDailyData } from "./actions";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-style-and-date";
import { Button } from "@/components/ui/button";


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
  efficiency: number,
  achievements:string,
  unitname:string,
  style:string
}
const ReportTable=({
  obbSheets,
}: AnalyticsChartProps)=>{

  const[date,setDate]=useState<string>("")
  const[data,setData]=useState<ReportData[]>([])
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const reportRef = useRef();


  const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {


    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split('T')[0].toString() + "%";
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);
    console.log("formated date",formattedDate)

  };

  // const calculateEfficiency = (reportData: ReportData[]) => {

  //   return reportData.map(d=> ({...d,efficiency:((d.count / (d.target*10)) * 100).toFixed(2)}))
       
  // }

  const calculateEfficiency = (reportData: ReportData[]) => {
    return reportData.map(d => {
      const efficiency = Number(((d.count / (d.target * 10)) * 100).toFixed(2));
      let achievement = "";
  
      achievement = efficiency >= 80 ? "Exceeded Target" : 
      efficiency >= 70 ? "On Target" : 
      "Below Target";

  
      return {
        ...d,
        efficiency,
        achievements: achievement,
      };
    });
  }
  


  const getDetails= async()=>{
const details=await getDailyData(obbSheetId,date)
const res = calculateEfficiency(details)

setData(res)


 
  }

  useEffect(()=>{
    getDetails()
   
    
  },[obbSheetId,date])


  const handlePrint = () => {
    const printContent = reportRef.current;
    const windowToPrint = window.open("", "", "width=800,height=600");
    windowToPrint.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .container {
              width: 100%;
              margin: 0 auto;
              padding: 20px;
              box-sizing: border-box;
            }
            .printable {
              padding: 8px;
              background-color: white;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h5>Title: Operator Daily Efficiency Report</h5></br>
          <h5>Obb Sheet Id: ${obbSheetId}</h5></br>
          <h5>Date : ${date} </h5></br>
          <h5>Line Unit :${data[0].unitname}</h5></br> 
          <h5> Style :${data[0].style}</h5></br> 
                   
          ${printContent.innerHTML}
        

        </body>
      </html>
    `);
    windowToPrint.document.close();
    windowToPrint.focus();
    windowToPrint.print();
  };

 

  return(
    <>
    
   <SelectObbSheetAndDate
            obbSheets={obbSheets}
            handleSubmit={handleFetchProductions}
          />
           <Button className="mt-5" onClick={handlePrint}>Print</Button>
          <div ref={reportRef} className="container mt-5" >
          
    <Table className="mt-5">
  <TableCaption>Operator Daily Efficiency Report</TableCaption>
  <TableHeader >
      
    <TableRow>
      <TableHead >Empl Id</TableHead>
      <TableHead>Operator Name</TableHead>
      <TableHead>Operation Name</TableHead>
      <TableHead >Target(100% SMV Target)</TableHead>
      <TableHead >Units Produced</TableHead>
      <TableHead >Efficiency(%)</TableHead>
      <TableHead >Achievement</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
  {data.map((d:any,rid:number)=>(

     
<TableRow key={rid} className="bg-accent">
<TableCell>
    <div className="font-medium align-center">{rid+1}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.operatorname}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.operationname}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{(d.smv*100).toFixed(2)}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.count}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.efficiency}%</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{d.achievements}</div>
  </TableCell>
</TableRow>
))}
  </TableBody>
</Table>
</div>

    </>
  )
}

export default ReportTable;