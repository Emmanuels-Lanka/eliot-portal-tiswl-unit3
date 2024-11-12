"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export type ReportData = {
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
  employeeId: string;
  seqNo: string;
  first: any;
  last: any;
};

export type ReportDataOut = ReportData & {
  diffInMinutes: number;
};

const ReportTable = ({ obbSheets }: AnalyticsChartProps) => {
  const [date, setDate] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const reportRef = useRef<HTMLDivElement | null>(null);

  const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split("T")[0];
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);
  };

  const calculateAverageEfficiency = (groupedData: { [key: string]: ReportDataOut[] }) => {
    return Object.values(groupedData).map((operatorData) => {
      // Get all valid timestamps for the operator
      const allTimestamps = operatorData.flatMap(op => [
        new Date(op.first).getTime(),
        new Date(op.last).getTime()
      ]).filter(time => !isNaN(time));

      if (allTimestamps.length === 0) {
        return {
          operatorname: operatorData[0].operatorname,
          employeeId: operatorData[0].employeeId,
          unitname: operatorData[0].unitname,
          buyer: operatorData[0].buyer,
          style: operatorData[0].style,
          linename: operatorData[0].linename,
          efficiency: 0,
          achievements: "Below Target",
          smv:operatorData[0].smv,
          seqNo:operatorData[0].seqNo
        };
      }

      // Find the actual working period
      const earliestStart = new Date(Math.min(...allTimestamps));
      const latestEnd = new Date(Math.max(...allTimestamps));

      // Calculate total working minutes
      const totalMinutes = Math.max(0, Math.round((latestEnd.getTime() - earliestStart.getTime()) / (1000 * 60)));
      
      // Subtract break time (60 minutes) only if working time is more than 60 minutes
      const breakTime = totalMinutes > 60 ? 60 : 0;
      const actualWorkingMinutes = Math.max(1, totalMinutes - breakTime); // Ensure minimum 1 minute to avoid division by zero

      // Calculate total earned minutes across all operations
      const totalEarnedMinutes = operatorData.reduce((acc, operation) => {
        const count = Number(operation.count) || 0;
        const smv = operation.smv || 0;
        return acc + (count * smv);
      }, 0);

      // Calculate efficiency (ensure non-negative value)
      const efficiency = Math.max(0, Math.min(100, Math.round((totalEarnedMinutes / actualWorkingMinutes) * 100)));

      // Achievement based on efficiency
      const achievement =
        efficiency >= 80
          ? "Exceeded Target"
          : efficiency >= 70
          ? "On Target"
          : "Below Target";

      return {
        operatorname: operatorData[0].operatorname,
        employeeId: operatorData[0].employeeId,
        unitname: operatorData[0].unitname,
        buyer: operatorData[0].buyer,
        style: operatorData[0].style,
        linename: operatorData[0].linename,
        efficiency,
        achievements: achievement,
        smv:operatorData[0].smv,
        seqNo:operatorData[0].seqNo
      };
    });
  };

  const groupByOperator = (details: ReportDataOut[]) => {
    const operatorsMap: { [key: string]: ReportDataOut[] } = {};
    details.forEach((data) => {
      if (!operatorsMap[data.employeeId]) {
        operatorsMap[data.employeeId] = [];
      }
      operatorsMap[data.employeeId].push(data);
    });
    return operatorsMap;
  };

  function getMinutesDifference(data: ReportData[]): ReportDataOut[] {
    return data.map((d) => {
      const start = new Date(d.first);
      const end = new Date(d.last);
      const diffInMs = Math.max(0, end.getTime() - start.getTime());
      const diffInMinutes = Math.round(diffInMs / (1000 * 60));

      return {
        ...d,
        diffInMinutes,
      };
    });
  }

  const getDetails = async () => {
    const details = await getDailyData(obbSheetId, date);
    const timeData = getMinutesDifference(details);
    const groupedData = groupByOperator(timeData);
    const result = calculateAverageEfficiency(groupedData);
    setData(result);
  };

  useEffect(() => {
    if (obbSheetId && date) {
      getDetails();
    }
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
            <h5>Unit: ${data[0]?.unitname}</h5>
            <h5>Buyer: ${data[0]?.buyer}</h5>
            <h5>Style Name: ${data[0]?.style}</h5>
            <h5>Line Name: ${data[0]?.linename}</h5>
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
   
  return (
    <div>
      <SelectObbSheetAndDate obbSheets={obbSheets} handleSubmit={handleFetchProductions} />
      {data.length > 0 && (
        <Button className="mt-5" onClick={handlePrint}>
          Download as PDF
        </Button>
      )}
      <div ref={reportRef} className="mt-5 mb-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seq No</TableHead>
              <TableHead>Emp ID</TableHead>
              <TableHead>Operator Name</TableHead>
              <TableHead>100% SMV Target/Hr</TableHead>
              <TableHead>Efficiency(%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d, rid) => (
              <TableRow key={rid}>
                <TableCell>{d.seqNo}</TableCell>
                <TableCell>{d.employeeId}</TableCell>
                <TableCell>{d.operatorname}</TableCell>
                <TableCell>{d.smv ? (60 / d.smv).toFixed(2) : 0}</TableCell>

                <TableCell>{d.efficiency}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportTable;