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
import { TablePropType } from "./barchart"
import { useRef } from "react";
import { Button } from "@/components/ui/button";


  export interface TableProps {
    tableProp: TablePropType[];
    date:string
}
export function TableDemo({ tableProp,date }: TableProps) {

  const reportRef = useRef<HTMLDivElement | null>(null);
  const reportRef2 = useRef<HTMLDivElement | null>(null);



  const handlePrint = () => {
    const baseUrl = window.location.origin;
    const printContent = reportRef.current?.innerHTML;
    const footer = reportRef2.current?.innerHTML;
    // let selectedDate = new Date(date);
  
    // Subtract one day from the selected date
    // selectedDate.setDate(selectedDate.getDate());
  
    // Format the adjusted date back to a string
    // const formattedDate = selectedDate.toISOString().split('T')[0];
    const formattedDate = date
    
    const htmlContent = `
      <html>
        <head>
          <title>Line Efficiency Report</title>
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
          <h1 class="text-center">Line Efficiency Report</h1>
          <hr />
          <div>
            <h5>Factory Name: Apparel Gallery LTD</h5>
            <h5>Title: Line Efficiency Report</h5>
            <h5>Date: ${formattedDate}</h5>
          
          </div>
          ${printContent}
          ${footer}

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



    console.log("td",tableProp)



    function calculateEfficiencyRatio(tableProp: TablePropType[]): string {
      const totalAvailableHours = tableProp.reduce((a, b) => a + b.availableHours, 0);
      const totalStdHours = tableProp.reduce((a, b) => a + b.stdHours, 0);
      
    
      // Avoid division by zero
      if (totalAvailableHours === 0) return "0.0";
    
      return ((totalStdHours / totalAvailableHours)*100).toFixed(2); // Format to 2 decimal places
    }

    function calculateOnEfficiencyRatio(tableProp: TablePropType[]): string {
      const totalAvailableHours = tableProp.reduce((a, b) => a + b.availableHours, 0);
      const totalStdHours = tableProp.reduce((a, b) => a + b.stdHours, 0);
      const offStand = tableProp.reduce((a, b) => a + b.offStand, 0);
      
      const res = Math.max(0,Number((totalStdHours/(totalAvailableHours-offStand)*100).toFixed(2)))
    
      // Avoid division by zero
      if (totalAvailableHours === 0) return "0.0";
    
      return res.toString()// Format to 2 decimal places
    }


    return (

    <div>
      <div>
      {true && (
        <Button className="" onClick={handlePrint}>
          Download as PDF
        </Button>
      )}
      </div>
      
      <div ref={reportRef} className="mt-5 mb-10">
      <Table>
       
        {/* <TableCaption>LINE EFFICIENCY.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>SeqNo</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Available Hours</TableHead>
            <TableHead>Prodution Standard Hours </TableHead>
            <TableHead>Off Stand Hours </TableHead>
            <TableHead>Overall Efficiency </TableHead>
            <TableHead>On Stand Efficiency </TableHead>
            {/* <TableHead className="text-right">Amount</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableProp.map((invoice,index) => (
            <TableRow key={index}>
              
              <TableCell className="text-right">{invoice.seqNo}</TableCell>
              <TableCell className="font-medium">{invoice.operator}</TableCell>

              <TableCell className="text-right">{invoice.availableHours}</TableCell>
              <TableCell className="text-right">{invoice.stdHours}</TableCell>
              <TableCell className="text-right">{invoice.offStand}</TableCell>
              <TableCell className="text-right">{invoice.ovlEff}</TableCell>
              <TableCell className="text-right">{invoice.onStndEff}</TableCell>
              {/* <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
        
      </Table>
      </div>
      <div ref={reportRef2} className="mt-5 mb-10">
      <Table>
      <TableFooter>
        
        <TableRow >
          <TableCell colSpan={2} >Line Efficiency</TableCell>
          <TableCell className="text-center">{tableProp.reduce((a,b)=>a+b.availableHours,0).toFixed(1)}</TableCell>
          <TableCell className="text-center">{tableProp.reduce((a,b)=>a+b.stdHours,0).toFixed(1)}</TableCell>
          <TableCell className="text-center">{tableProp.reduce((a,b)=>a+b.offStand,0).toFixed(1)}</TableCell>
          <TableCell className="text-center">{calculateEfficiencyRatio(tableProp)}</TableCell>
          <TableCell className="text-center">{calculateOnEfficiencyRatio(tableProp)}</TableCell>
        </TableRow>

      </TableFooter>
      </Table>
      </div>
    </div>
    )
  }
  