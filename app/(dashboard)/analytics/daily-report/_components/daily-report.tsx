"use client"

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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [data, setData] = useState<ReportDataOut[]>([]);
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const reportRef = useRef<HTMLDivElement | null>(null);

  const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split("T")[0] + "%";
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);
  };

  const calculateEfficiency = (reportData: ReportDataOut[]) => {
    return reportData.map(d => {
      const earnmins = d.smv * d.count;
      const efficiency = Math.round((earnmins / d.diffInMinutes) * 100) || 0;
      const achievement =
        efficiency >= 80
          ? "Exceeded Target"
          : efficiency >= 70
          ? "On Target"
          : "Below Target";

      return {
        ...d,
        efficiency,
        achievements: achievement,
      };
    });
  };

  function getMinutesDifference(data: ReportData[]): ReportDataOut[] {
    return data.map(d => {
      const start = new Date(d.first);
      const end = new Date(d.last);
      const diffInMs = end.getTime() - start.getTime();
      const diffInMinutes = Math.round((diffInMs / (1000 * 60))-60);

      return {
        ...d,
        diffInMinutes,
      };
    });
  }

  const getDetails = async () => {
    const details = await getDailyData(obbSheetId, date);
    const timeData = getMinutesDifference(details);
    const result = calculateEfficiency(timeData);
    console.log("res",result)
    setData(result);
  };

  useEffect(() => {
    if (obbSheetId && date) {
      getDetails();
    }
  }, [obbSheetId, date]);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
  

    
    // Capture the reportRef element with a higher scale for better quality
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,  // Increase scale for higher resolution
      useCORS: true, // Enable cross-origin resource sharing if needed
      scrollY: -window.scrollY, // Prevents the viewport from affecting the snapshot
    });
  
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
    let imgHeightLeft = pdfHeight;
    let position = 0;
  
    // Add the image to each page of the PDF if the content exceeds one page
    while (imgHeightLeft > 0) {
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      imgHeightLeft -= pdf.internal.pageSize.getHeight();
      position -= pdf.internal.pageSize.getHeight();
      if (imgHeightLeft > 0) pdf.addPage();
    }
  
    pdf.save("Operator_Daily_Efficiency_Report.pdf");
  };
  

  return (
    <div>
      <SelectObbSheetAndDate obbSheets={obbSheets} handleSubmit={handleFetchProductions} />
      {data.length > 0 && (
        <Button className="mt-5" onClick={downloadPDF}>
          Download as PDF
        </Button>
      )}
      <div ref={reportRef} className=" mt-5 mb-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seq No</TableHead>
              <TableHead>Emp ID</TableHead>
              <TableHead>Operator Name</TableHead>
              <TableHead>Operation Name</TableHead>
              <TableHead>Operated Machine</TableHead>
              <TableHead>100% SMV Target/Hr</TableHead>
              <TableHead>Units Produced</TableHead>
              <TableHead>Efficiency(%)</TableHead>
              <TableHead>Achievement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d, rid) => (
              <TableRow key={rid}>
                <TableCell>{d.seqNo}</TableCell>
                <TableCell>{d.employeeId}</TableCell>
                <TableCell>{d.operatorname}</TableCell>
                <TableCell>{d.operationname}</TableCell>
                <TableCell>{d.machineid}</TableCell>
                <TableCell>{(60 / d.smv).toFixed(2)}</TableCell>
                <TableCell>{d.count}</TableCell>
                <TableCell>{d.efficiency}%</TableCell>
                <TableCell>{d.achievements}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportTable;
