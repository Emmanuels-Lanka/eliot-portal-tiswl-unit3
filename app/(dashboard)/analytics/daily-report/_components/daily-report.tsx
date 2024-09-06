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
import Image from 'next/image';

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
  style:string,
  machineid:string,
  linename:string,
  buyer:string
}
const ReportTable=({
  obbSheets,
}: AnalyticsChartProps)=>{

  const[date,setDate]=useState<string>("")
  const[data,setData]=useState<ReportData[]>([])
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const reportRef = useRef<any>(null);


  const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {


    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split('T')[0].toString() + "%";
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);
    

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
 console.log("details0000",details)

setData(res)


 
  }

  useEffect(()=>{
    getDetails()
   
    
  },[obbSheetId,date])


    const handlePrint = () => {
    const printContent: any = reportRef.current;
    const windowToPrint = window.open("", "", "width=800,height=600");
    windowToPrint?.document.write(`
      <html>
        <head>
          <title>Operator Daily Efficiency Report</title>
           
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
              font-size:12px;
              background-color:'#d3d3d3';
              text-align:center;
            }
              td{
              font-size:11px;
              }
            .text-left{
              text-align:left;
              margin-top:8px;
              }
            .text-right {
              text-align: right;
            }
              .text-right img{
               width: 110px; /* Adjust the logo width */
            height: auto; /* Maintain aspect ratio */
              }

            .text-center {
              text-align: center;
            }
            .logo-div {
            width: 100%; 
            text-align: center; 
            color:gray;
            margin-bottom: 20px; /* Add space between logo and the rest of the content */
          }
          .logo-div img {
            width: 170px; /* Adjust the logo width */
            height: auto; /* Maintain aspect ratio */
          }
            .title{
            text-align:center;
            color:black;
            margin-top: 30px;
            }
            hr{
            width:95%;
            color:black;
            margin-top:15px;
            }
              @media print {
            .footer {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              text-align: center;
              margin-bottom: 20px;
            }
          }
            .pas{
            flex: 1
            }
          </style>
        </head>
        <body>
        <div class="logo-div">
          <img src="/logo/ha-meem.png" alt="Company Logo" />
           <h5 style={{ marginTop: '-10px' }}>~ Bangladesh ~  </h5>
          </div>
        <div class="title">
          <h1>Operator Daily Efficiency Report</h1>
        </div>
        <hr></hr>
         <div style={{ marginBottom: '5px',paddingLeft:'50px' }}>
            <h5>  Factory Name : Apparel Gallery LTD</h5>
          </div>
      
          <div style={{ marginBottom: '5px',paddingLeft:'50px' }}>
            <h5>Title: Operator Daily Efficiency Report</h5>
          </div>
          <div style={{ marginBottom: '5px',marginLeft:'50px' }}>
            <h5>Date: ${date}</h5>
          </div>
          <div style={{ marginBottom: '5px',marginLeft:'50px' }}>
            <h5>Unit: ${data[0].unitname}</h5>
          </div>
          <div style={{ marginBottom: '5px',marginLeft:'50px' }}>
            <h5>Buyer: ${data[0].buyer}</h5>
          </div>
          <div style={{ marginBottom: '5px',marginLeft:'50px' }}>
            <h5>Style Name: ${data[0].style}</h5>
          </div>
           <div style={{ marginBottom: '5px',marginLeft:'50px' }}>
            <h5>Line Name: ${data[0].linename}</h5>
          </div>
    
                   
          ${printContent?.innerHTML}
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 50px;">
  <div>
    <p style="margin: 0;">
      <a href="https://rfid-tracker.eliot.global/" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: black;">
        https://rfid-tracker.eliot.global/
      </a>
    </p>
  </div>
  <div>
    <img src="/logo/logo.png" alt="Company Footer Logo" style="width: 120px; height: auto;" />
  </div>
</div>

        </body>
      </html>
    `);
    windowToPrint?.document.close();
    windowToPrint?.focus();
    windowToPrint?.print();
  };

  



 

  return(
    <>
    
   <SelectObbSheetAndDate
            obbSheets={obbSheets}
            handleSubmit={handleFetchProductions}
          />
           <Button className="mt-5" onClick={handlePrint}>Print</Button>
          <div ref={reportRef} className="container mt-5 mb-10" >
          
    <Table className="mt-10">
  {/* <TableCaption>Operator Daily Efficiency Report</TableCaption> */}
  <TableHeader className="mt-5" >
      
    <TableRow>
      <TableHead >Emp.ID</TableHead>
      <TableHead>Operator Name</TableHead>
      <TableHead>Operation Name</TableHead>
      <TableHead>Operated Machine</TableHead>
      <TableHead >100% SMV Target/Hr</TableHead>
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
    <div className="font-medium">{d.machineid}</div>
  </TableCell>
  <TableCell>
    <div className="font-medium">{(60/d.smv).toFixed(2)}</div>
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