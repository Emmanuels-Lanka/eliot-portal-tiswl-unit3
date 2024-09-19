"use client"

import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getDailyData, getDHUData } from "./actions";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";


interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
}

type ReportData={
  name:string;
  count:number;
  target:number;
}

export type ReportData1 = {
  id: string;
  operatorname: string;
  operationname: string;
  count: number;
  smv: number;
  target: number;
  efficiency: number;
  achievements: string;
  unitname: string;
  style: string;
  machineid: string;
  linename: string;
  buyer: string;
};
const DhuReport=({ obbSheets }: AnalyticsChartProps)=>{

  const [date, setDate] = useState<string>("");
  const [data, setData] = useState<ReportData[]>([]);
  const [data1,setData1]=useState<ReportData1[]>([]);
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const reportRef = useRef<any>(null);


  const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split('T')[0].toString() + "%";
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);
  };


  const getDetails = async () => {
    const details = await getDHUData(obbSheetId, date);
    const details1=await getDailyData(obbSheetId,date);
    setData(details);
    setData1(details1);
    console.log("details",details)
    console.log("details1",details1)
  };

  useEffect(() => {
    getDetails();
  }, [obbSheetId, date]);




  const handlePrint = () => {
    const baseUrl = window.location.origin;
    const printContent = reportRef.current?.innerHTML;
    let selectedDate = new Date(date);
  
    // Subtract one day from the selected date
    selectedDate.setDate(selectedDate.getDate());
  
    // Format the adjusted date back to a string
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
  
    const htmlContent = `
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
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
            }
            th {
              text-align: center;
              background-color: gray;
            }
            td {
              text-align: left;
            }
            .logo-div {
              text-align: center;
            }
            .logo-div img {
              width: 170px;
              height: auto;
            }
            .text-center {
              text-align: center;
            }
            .footer-logo img {
              width: 120px;
              height: auto;
            }
          </style>
        </head>
        <body>
          <div class="logo-div">
            <img src="${baseUrl}/ha-meem.png" alt="Ha-Meem Logo" style="margin-top:10px;"/>
            <h5 style="margin-top:10px;">~ Bangladesh ~</h5>
          </div>
          <h1 class="text-center">Operator Daily Efficiency Report</h1>
          <hr />
          <div>
            <h5>Factory Name: Apparel Gallery LTD</h5>
            <h5>Title: Operator Daily Efficiency Report</h5>
            <h5>Date: ${formattedDate}</h5>
           
          </div>
          ${printContent}
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 50px;">
            <div>
              <p><a href="https://rfid-tracker.eliot.global/">https://rfid-tracker.eliot.global/</a></p>
            </div>
            <div class="footer-logo">
              <img src="${baseUrl}/logo.png" alt="Company Footer Logo" />
            </div>
          </div>
        </body>
      </html>
    `;
  
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url, '', 'width=800,height=600');
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        URL.revokeObjectURL(url);
      };
    } else {
      console.error("Failed to open print window");
    }
  };
   
    
    


    return(
   <>
   <SelectObbSheetAndDate
        obbSheets={obbSheets}
        handleSubmit={handleFetchProductions}
      />
       {data.length>0?(
 <Button className="mt-5" onClick={handlePrint}>Print</Button>
      ):(
        <></>
      )
    }
     <div  className="container mt-5 mb-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Emp.ID</TableHead>
              <TableHead>Operator Name</TableHead>
              <TableHead>Operation Name</TableHead>
              <TableHead>Operated Machine</TableHead>
              <TableHead>No. Of Gmt inspect</TableHead>
              <TableHead>No. Of defects</TableHead>
              <TableHead>DHU</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d, rid) => (
              <TableRow key={rid}>
                <TableCell>{rid + 1}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>{d.count.toFixed(2)}</TableCell>
                              
              </TableRow>
            ))}
           
          </TableBody>
        </Table>
      </div>
   </>
    )
}

export default DhuReport