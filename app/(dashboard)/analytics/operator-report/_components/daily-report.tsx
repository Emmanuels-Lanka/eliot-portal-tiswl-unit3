"use client"
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import SelectObbSheetAndDate from "./select-style-and-date";
import { EmployeeRecord, getNewData,  newData } from './actions';
import { getFormattedTime } from '@/lib/utils-time';
import { getObbData } from '../../line-efficiency/_components/actions';

interface ProcessedData {
  total?: number;
  operator: string;
  data: {
    diff: number;
    eff: number;
    production_date: string;
    operatorRfid: string;
    daily_total: number;
    name: string;
    LoginDate: string;
    smv: number;
    LoginTimestamp: Date;
    LogoutTimestamp: Date;
    date: string;
  }[];
}

interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
  operators:EmployeeRecord[]
   

}

const ReportTable = ({ obbSheets, operators }: AnalyticsChartProps) => {
  const [date, setDate] = useState<string>("");
  const [startdate, setStartDate] = useState<string>("");
  const [enddate, setendDate] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [obb, setObb] = useState<any>();
  const [operatorID, setOperatorID] = useState<string>("");
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const reportRef = useRef<HTMLDivElement | null>(null);

  const handleFetchProductions = async (data: {operatorId: string; date: Date; endDate: Date }) => {
    const start = getFormattedTime(data.date.toString());
    const end = getFormattedTime(data.endDate.toString());
    
    setStartDate(start);
    setendDate(end);
console.log(data)
    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split("T")[0];
  
    setOperatorID(data.operatorId)
  };

 



  const processDatas = (data: newData[]) => {
    
  
    const effMap = data.map((d)=>{
      const login = new Date (d.LoginTimestamp)
      const logout = new Date (d.LogoutTimestamp)
      const diff = (Number(((logout.getTime() - login.getTime()) / 60000-60).toFixed(2)))
      const earnMins = (Number(d.daily_production))*d.smv
      const eff = Number(((earnMins / diff) * 100).toFixed(2));

      console.log("lo")
      return {

        ...d,
        diff,eff,earnMins


      }
      
    }
    
  )
  console.log(effMap)
  return effMap
  };

  const getDetails = async () => {
    
    const data = await getNewData(startdate,enddate,operatorID)
    console.log(data)
    const pData = processDatas(data)
    setData(pData)
    console.log(data)
    const o = pData[0].obbSheetId
    const obb = await getObbData(o)
    setObb(obb)


  };

  useEffect(() => {
    if (operatorID && startdate && enddate) {
      getDetails();
    }
  }, [operatorID, startdate, enddate]);

      const handlePrint = () => {
        const baseUrl = window.location.origin;
        const printContent = reportRef.current?.innerHTML;
        const today = new Date();
        const day = getFormattedTime(today.toString())
        
        // let selectedDate = new Date(date);
        // selectedDate.setDate(selectedDate.getDate());
        // // const formattedDate = selectedDate.toISOString().split('T')[0];
        const fileName = `Operator_Monthly_Efficiency_Report_${data[0].name}_${startdate}_${enddate}.pdf`;
        const htmlContent = `
          <html>
            <head>
              <title>Operator Monthly Efficiency Report</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 10px; font-size: 12px; }
                .container { width: 90%; margin: 0 auto; padding: 10px; box-sizing: border-box; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #ddd; padding: 4px; font-size: 12px; }
                th { text-align: center; background-color: gray; }
                td { text-align: center; }
                .logo-div { text-align: center; }
                .logo-div img { width: 120px; height: auto; }
                .text-center { text-align: center; }
                .footer-logo img { width: 100px; height: auto; }
              </style>
            </head>
            <body>
              <div class="logo-div">
                <img src="${baseUrl}/ha-meem.png" alt="Ha-Meem Logo" style="margin-top:10px;"/>
                <h5 style="margin-top:10px;">~ Bangladesh ~</h5>
              </div>
              <h1 class="text-center">Operator Monthly Efficiency Report</h1>
              <hr />
              <div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 14px;">
                <div style="flex: 1; margin-right: 10px; line-height: 1.5;">
                  <h5 style="margin: 0;">Factory Name: Apparel Gallery LTD</h5>
                  <h5 style="margin: 0;">Operator: ${data[0].name}'s Daily Efficiency Report</h5>
                  <h5 style="margin: 0;">Employee Id: ${data[0].employeeId}</h5>
                  <h5 style="margin: 0;">Starting Date: ${startdate}</h5>
                  <h5 style="margin: 0;">Ending Date: ${enddate}</h5>
                </div>
                <div style="flex: 1; margin-left: 10px; line-height: 1.5;">
                  <h5 style="margin: 0;">Unit: ${obb?.[0]?.unit}</h5>
                  <h5 style="margin: 0;">Buyer: ${obb?.[0]?.buyer}</h5>
                  <h5 style="margin: 0;">Style Name: ${obb?.[0]?.style}</h5>
                  <h5 style="margin: 0;">Line Name: ${obb?.[0]?.line}</h5>
                  <h5 style="margin: 0;">Generated Date: ${day}</h5>
                </div>
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
        }

        
      };

  // const uniqueDates = Array.from(
  //   new Set(data.flatMap((d) => d.data.map((o) => o.LoginDate)))
  // );

  return (
    <div>
      <SelectObbSheetAndDate operators={operators} handleSubmit={handleFetchProductions} />
      {data.length > 0 && (
        <Button className="mt-5" onClick={handlePrint}>
          Download as PDF
        </Button>
      )}
      <div ref={reportRef} className="mt-5 mb-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Operation Performed</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Daily Production</TableHead>
              <TableHead> Available Minutes</TableHead>
              <TableHead> Operation SMV</TableHead>
              <TableHead>100% Target</TableHead>
              <TableHead>Efficiency</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d,index) => {
              // Take first data entry for consistent operator info
        
              return (
                <TableRow key={index}>
                  <TableCell>{d.operation}</TableCell>
                  <TableCell>{d.LoginDate}</TableCell>
                  <TableCell>{d.daily_production}</TableCell>
                  <TableCell>{d.diff}</TableCell>
                  <TableCell>{d.smv}</TableCell>
                  <TableCell>{(60/d.smv).toFixed(2)}</TableCell>
                  <TableCell>{d.eff}</TableCell>
                  
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportTable