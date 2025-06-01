"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ExtendedOperatorRfidData } from "./barchart"
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { getObbData } from "./actions";
import { ObbSheet } from "@prisma/client";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import the autoTable function directly

export interface TableProps {
  tableProp: ExtendedOperatorRfidData[];
  date: string;
  obbData: any[];
}

export function TableDemo({ tableProp, date, obbData }: TableProps) {
  const reportRef = useRef<HTMLDivElement | null>(null);
  const reportRef2 = useRef<HTMLDivElement | null>(null);

  function calculateEfficiencyRatio(tableProp: ExtendedOperatorRfidData[]): string {
    const totalAvailableHours = tableProp.reduce((a, b) => a + b.hours, 0);
    const totalStdHours = tableProp.reduce((a, b) => a + b.earnHours, 0);

    // Avoid division by zero
    if (totalAvailableHours === 0) return "0.0";
    return ((totalStdHours / totalAvailableHours) * 100).toFixed(2); // Format to 2 decimal places
  }

  function calculateOnEfficiencyRatio(tableProp: ExtendedOperatorRfidData[]): string {
    const totalAvailableHours = tableProp.reduce((a, b) => a + b.hours, 0);
    const totalStdHours = tableProp.reduce((a, b) => a + b.earnHours, 0);
    const offStand = tableProp.reduce((a, b) => a + b.offStandHours, 0);
    
    const res = Math.max(0, Number((totalStdHours / (totalAvailableHours - offStand) * 100).toFixed(2)));
    
    // Avoid division by zero
    if (totalAvailableHours === 0) return "0.0";
    return res.toString(); // Format to 2 decimal places
  }

  const handleDownloadPDF = () => {
    if (!obbData.length) return;

    const pdf = new jsPDF('l', 'mm', 'a4');

    // Apply the autoTable plugin to the jsPDF instance
    autoTable(pdf, {
      startY: 45,
      head: [
        [
          'MO ID',
          'MO Name',
          'Operation Code',
          'Operation',
          'Production pieces',
          'SMV',
          'Available Hours',
          'Production Standard Hours',
          'Off Stand Hours',
          'Overall Efficiency',
          'On Stand Efficiency'
        ]
      ],
      body: [],
      theme: 'grid',
      headStyles: { fillColor: [128, 128, 128] },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { halign: 'center' },
        3: { halign: 'left' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
        8: { halign: 'right' },
        9: { halign: 'right' },
        10: { halign: 'right' }
      }
    });

    // Add Ha-Meem logo and header content
    const logoUrl = '/ha-meem.png'; // Path to the logo
    const logoWidth = 20; // Adjust logo width as needed
    const logoHeight = (logoWidth * 120) / 120; // Maintain aspect ratio
    pdf.addImage(logoUrl, 'PNG', (pdf.internal.pageSize.getWidth() - logoWidth) / 2, 10, logoWidth, logoHeight);
    pdf.setFontSize(12);
    pdf.text('~ Bangladesh ~', pdf.internal.pageSize.getWidth() / 2, 35, { align: 'center' });
    pdf.text('Line Individual Efficiency Report', pdf.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
    pdf.setLineWidth(0.5);
    pdf.line(15, 45, pdf.internal.pageSize.getWidth() - 15, 45); // Horizontal line

    // Add factory details
    pdf.setFontSize(10);
    pdf.text(
      [
        `Factory: Apparel Gallery LTD`,
        `Unit: ${obbData[0].unit}`,
        `Line: ${obbData[0].line}`,
      ],
      15,
      30
    );

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const currentTime = `${formattedDate} - ${formattedTime}`;
    pdf.text(
      [
        `Document Date: ${date}`,
        `Printed Date: ${currentTime}`
      ],
      pdf.internal.pageSize.getWidth() - 80,
      30
    );

    // Prepare table data
    const sortedTableProp = [...tableProp].sort((a, b) => b.onStndEff - a.onStndEff);
    const tableData = sortedTableProp.map(row => [
      row.eid,
      row.name,
      row.seqNo,
      row.operation,
      row.production,
      row.smv,
      row.hours,
      row.earnHours,
      row.offStandHours,
      row.ovlEff,
      row.onStndEff
    ]);

    // Add the main table
    autoTable(pdf, {
      startY: 45,
      head: [
        [
          'MO ID',
          'MO Name',
          'Operation Code',
          'Operation',
          'Production pieces',
          'SMV',
          'Available Hours',
          'Production Standard Hours',
          'Off Stand Hours',
          'Overall Efficiency',
          'On Stand Efficiency'
        ]
      ],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [128, 128, 128] },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { halign: 'center' },
        3: { halign: 'left' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
        8: { halign: 'right' },
        9: { halign: 'right' },
        10: { halign: 'right' }
      }
    });

    // Add totals row
    const finalY = (pdf as any).lastAutoTable.finalY || 45;
    autoTable(pdf, {
      startY: finalY + 5,
      headStyles: { fillColor: [128, 128, 128] },
      head: [
        [
          { content: '' },
          'Total Available Hours',
          'Total Production Standard Hours',
          'Total Off Stand Hours',
          'Overall Efficiency',
          'On Stand Efficiency'
        ]
      ],
      body: [
        [
          { content: 'Total Line Efficiency' },
          tableProp.reduce((a, b) => a + b.hours, 0).toFixed(1),
          tableProp.reduce((a, b) => a + b.earnHours, 0).toFixed(1),
          tableProp.reduce((a, b) => a + b.offStandHours, 0).toFixed(1),
          calculateEfficiencyRatio(tableProp),
          calculateOnEfficiencyRatio(tableProp)
        ]
      ],
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
        8: { halign: 'right' },
        9: { halign: 'right' }
      }
    });

    // Add footer
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFontSize(8);
    pdf.text('https://www.portal.eliot.global/', 15, pageHeight - 10);
    const eliotLogoUrl = '/eliot-logo.png'; // Path to the Eliot logo
    const eliotLogoWidth = 20; // Adjust logo width as needed
    const eliotLogoHeight = (eliotLogoWidth * 200) / 200; // Maintain aspect ratio
    pdf.addImage(
      eliotLogoUrl,
      'PNG',
      pdf.internal.pageSize.getWidth() - eliotLogoWidth - 15, // Right-aligned with 15mm margin
      pageHeight - eliotLogoHeight - 10, // Bottom-aligned with 10mm margin
      eliotLogoWidth,
      eliotLogoHeight
    );

    // Save the PDF
    pdf.save(`Line_Individual_Efficiency_report_${obbData[0]?.line}_${date}.pdf`);
  };

  const sortedTableProp = [...tableProp].sort((a, b) => b.onStndEff - a.onStndEff);

  return (
    <div>
      <div>
        {tableProp.length > 0 && (
          <Button className="shadow-md" onClick={handleDownloadPDF}>
            Download as PDF
          </Button>
        )}
      </div>
      
      <div ref={reportRef} className="mt-5 mb-10">
        <div className="text-center">
          <img src="/ha-meem.png" alt="Ha-Meem Logo" className="mx-auto w-[120px] h-auto mt-[10px]" />
          <h5 className="mt-[10px]">~ Bangladesh ~</h5>
          <h1 className="text-center">Line Individual Efficiency report</h1>
          <hr className="my-4" />
        </div>

        <div className="flex justify-around mt-5 text-sm mb-5">
          <div className="flex-1 mr-[10px] leading-[1.5]">
            <h5 className="m-0 font-semibold">Factory Name: Apparel Gallery LTD</h5>
            <h5 className="m-0 font-semibold">Unit: {obbData[0]?.unit}</h5>
          </div>
          <div className="flex-1 justify-around ml-[10px] leading-[1.5]">
            <h5 className="m-0 font-semibold">Date: {date}</h5>
            <h5 className="font-semibold">Line Name: {obbData[0]?.line}</h5>
          </div>
          <div>
            <div id="print-time-placeholder"></div>
          </div>
        </div>
        
        <Table style={{ tableLayout: 'fixed' }}>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">MO ID</TableHead>
              <TableHead className="">MO Name</TableHead>
              <TableHead className="w-[100px] text-center">Operation Code</TableHead>
              <TableHead className="w-[150px]">Operation</TableHead>
              <TableHead className="text-center">Production pieces</TableHead>
              <TableHead className="text-center">SMV</TableHead>
              <TableHead className="text-center">Available Hours</TableHead>
              <TableHead className="text-center">Production Standard Hours</TableHead>
              <TableHead className="text-center">Off Stand Hours</TableHead>
              <TableHead className="text-center">Overall Efficiency</TableHead>
              <TableHead className="text-center">On Stand Efficiency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTableProp.map((invoice, index) => (
              <TableRow key={index}>
                <TableCell className="text-center px-2 py-2">{invoice.eid}</TableCell>
                <TableCell className="font-medium px-2 py-2">{invoice.name}</TableCell>
                <TableCell className="font-medium text-center px-2 py-2">{invoice.seqNo}</TableCell>
                <TableCell className="font-medium px-2 py-2">{invoice.operation}</TableCell>
                <TableCell className="font-medium text-right px-2 py-2">{invoice.production}</TableCell>
                <TableCell className="font-medium text-right px-2 py-2">{invoice.smv}</TableCell>
                <TableCell className="text-right font-medium px-2 py-2">{invoice.hours}</TableCell>
                <TableCell className="text-right font-medium px-2 py-2">{invoice.earnHours}</TableCell>
                <TableCell className="text-right font-medium px-2 py-2">{invoice.offStandHours}</TableCell>
                <TableCell className="text-right font-medium px-2 py-2">{invoice.ovlEff}</TableCell>
                <TableCell className="text-right font-medium px-2 py-2">{invoice.onStndEff}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}></TableCell>
              <TableCell className="text-right">Total Available Hours</TableCell>
              <TableCell className="text-center">Total Production Standard Hours</TableCell>
              <TableCell className="text-center">Total Off Stand Hours</TableCell>
              <TableCell className="text-center">Total Overall Efficiency</TableCell>
              <TableCell className="text-center">Total On Stand Efficiency</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={5}>Total Line Efficiency</TableCell>
              <TableCell className="text-right">{tableProp.reduce((a, b) => a + b.hours, 0).toFixed(1)}</TableCell>
<TableCell className="text-center">{tableProp.reduce((a,b)=>a+b.earnHours,0).toFixed(1)}</TableCell>
          <TableCell className="text-center">{tableProp.reduce((a,b)=>a+b.offStandHours,0).toFixed(1)}</TableCell>
              <TableCell className="text-center">{calculateEfficiencyRatio(tableProp)}</TableCell>
              <TableCell className="text-center">{calculateOnEfficiencyRatio(tableProp)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div className="flex justify-between items-center mt-12">
          <div>
            <p>
              <a href="https://www.portal.eliot.global/" className="text-blue-500 hover:underline">
                https://www.portal.eliot.global/
              </a>
            </p>
          </div>
          <div className="footer-logo">
            <img src="/eliot-logo.png" alt="Company Footer Logo" className="w-[120px] h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableDemo;