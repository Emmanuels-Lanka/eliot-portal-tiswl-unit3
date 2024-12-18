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
import { ExtendedOperatorRfidData, TablePropType } from "./barchart"
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { getObbData } from "./actions";
import { ObbSheet } from "@prisma/client";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';



  export interface TableProps {
    tableProp: ExtendedOperatorRfidData[];
    date:string;
    obbData: any []
}
export function TableDemo({ tableProp,date,obbData }: TableProps) {

  const reportRef = useRef<HTMLDivElement | null>(null);
  const reportRef2 = useRef<HTMLDivElement | null>(null);



//   const handlePrint = async () => {

    
//     const baseUrl = window.location.origin;
//     const printContent = reportRef.current?.innerHTML;
//     const footer = reportRef2.current?.innerHTML;
//     // let selectedDate = new Date(date);
  
//     // Subtract one day from the selected date
//     // selectedDate.setDate(selectedDate.getDate());
  
//     // Format the adjusted date back to a string
//     // const formattedDate = selectedDate.toISOString().split('T')[0];
//     const formattedDate = date
    
    
//     const htmlContent = `
//       <html>
//         <head>
//           <title>Line Efficiency Report</title>
//           <style>
//   body {
//     font-family: Arial, sans-serif;
//     margin: 0;
//     padding: 20px;
//     font-size: 12px; /* Reduce font size */
//   }
//   .container {
//     width: 100%;
//     margin: 0 auto;
//     padding: 10px; /* Reduce padding */
//     box-sizing: border-box;
//   }
//   table {
//     width: 100%;
//     border-collapse: collapse;
//     margin-top: 10px; /* Reduce margin */
//     font-size: 10px; /* Smaller font size for table */
//   }
//   th, td {
//     border: 1px solid #ddd;
//     padding: 4px; /* Reduce cell padding */
//   }
//   th {
//     text-align: center;
//     background-color: gray;
//     color: white; /* Add contrast for better readability */
//   }
//   td {
//     text-align: right;
//   }
//   .logo-div {
//     text-align: center;
//     margin-bottom: 10px; /* Reduce spacing */
//   }
//   .logo-div img {
//     width: 150px; /* Adjust logo size */
//     height: auto;
//   }
//   .text-center {
//     text-align: center;
//   }
//   .footer-logo img {
//     width: 100px; /* Adjust footer logo size */
//     height: auto;
//   }
// </style>

//         </head>
//         <body>
//           <div class="logo-div">
//             <img src="${baseUrl}/ha-meem.png" alt="Ha-Meem Logo" style="margin-top:10px;"/>
//             <h5 style="margin-top:10px;">~ Bangladesh ~</h5>
//           <h3 class="text-center">Individual Line Efficiency Report</h3>

//           </div>

//          <div style="display: flex; justify-content: space-around; gap: 20px;">
//   <!-- Left Block -->
//   <div>
//     <h5>Factory Name: Apparel Gallery LTD</h5>
//     <h5>Title: Individual Line Efficiency Report</h5>
//     <h5>Date: ${formattedDate}</h5>
//     <h5>Style: ${obbData[0].style}</h5>
//   </div>
//   <!-- Right Block -->
//   <div>
//     <h5>Buyer: ${obbData[0].buyer}</h5>
//     <h5>Color: ${obbData[0].colour}</h5>
//     <h5>Line: ${obbData[0].line}</h5>
//     <h5>Unit: ${obbData[0].unit}</h5>
//   </div>
// </div>
//           ${printContent}
//           ${footer}

//           <div style="display:  flex; justify-content: space-between; align-items: center; margin-top: 50px;">
//             <div>
//               <p><a href="https://www.portal.eliot.global/">https://www.portal.eliot.global/</a></p>
//             </div>
//             <div class="footer-logo">
//               <img src="${baseUrl}/eliot-logo.png" alt="Company Footer Logo" />
//             </div>
//           </div>
//         </body>
//       </html>
//     `;
  
//     const blob = new Blob([htmlContent], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
    
//     const printWindow = window.open(url, '', 'width=800,height=600');
    
//     if (printWindow) {
//       printWindow.onload = () => {
//         printWindow.print();
//         URL.revokeObjectURL(url);
//       };
//     } else {
//       console.error("Failed to open print window");
//     }
//   };



    // console.log("td",tableProp)



    function calculateEfficiencyRatio(tableProp: ExtendedOperatorRfidData[]): string {
      const totalAvailableHours = tableProp.reduce((a, b) => a + b.hours, 0);
      const totalStdHours = tableProp.reduce((a, b) => a + b.earnHours, 0);
      
    
      // Avoid division by zero
      if (totalAvailableHours === 0) return "0.0";
    
      return ((totalStdHours / totalAvailableHours)*100).toFixed(2); // Format to 2 decimal places
    }

    function calculateOnEfficiencyRatio(tableProp: ExtendedOperatorRfidData[]): string {
      const totalAvailableHours = tableProp.reduce((a, b) => a + b.hours, 0);
      const totalStdHours = tableProp.reduce((a, b) => a + b.earnHours, 0);
      const offStand = tableProp.reduce((a, b) => a + b.offStandHours, 0);
      
      const res = Math.max(0,Number((totalStdHours/(totalAvailableHours-offStand)*100).toFixed(2)))
    
      // Avoid division by zero
      if (totalAvailableHours === 0) return "0.0";
    
      return res.toString()// Format to 2 decimal places
    }



    const handleDownloadPDF = async () => {
      if (!reportRef.current || !obbData.length) return;
    
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
    
        const canvas = await html2canvas(reportRef.current, {
          scale: 1,
          logging: false,
          useCORS: true,
        } as any);
    
        const imgWidth = 190; // Adjust for margins (A4 width is 210mm, minus 10mm margins on both sides)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        let position = 0;
    
        // Split content into multiple pages if necessary
        while (position < canvas.height) {
          const canvasSlice = document.createElement('canvas');
          canvasSlice.width = canvas.width;
          canvasSlice.height = Math.min(canvas.height - position, (pageHeight * canvas.width) / imgWidth);
    
          const ctx = canvasSlice.getContext('2d');
          if (ctx) {
            ctx.drawImage(
              canvas,
              0,
              position,
              canvas.width,
              canvasSlice.height,
              0,
              0,
              canvas.width,
              canvasSlice.height
            );
          }
    
          const imgData = canvasSlice.toDataURL('image/png', 0.5);
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, (canvasSlice.height * imgWidth) / canvas.width);
    
          position += canvasSlice.height;
    
          if (position < canvas.height) {
            pdf.addPage(); // Add new page
          }
        }
    
        const fileName = `Operator Daily Efficiency Report_${obbData[0]?.line}_${date}.pdf`;
        pdf.save(fileName);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    };




    return (

    <div>
      <div>
      {true && (
        <Button className="" onClick={handleDownloadPDF}>
          Download as PDF
        </Button>
      )}
      </div>
      
      <div ref={reportRef} className="mt-5 mb-10">

<div className="text-center">
    <img src="/ha-meem.png" alt="Ha-Meem Logo" className="mx-auto w-[120px] h-auto mt-[10px]" />
    <h5 className="mt-[10px]">~ Bangladesh ~</h5>
    <h1 className="text-center">Line Efficiency Report</h1>
    <hr className="my-4" />
  </div>



  <div className="flex justify-around mt-5 text-sm mb-5">
    <div className="flex-1 mr-[10px] leading-[1.5]">
      <h5 className="m-0 font-semibold">Factory Name: Apparel Gallery LTD</h5>

      <h5 className="m-0 font-semibold">Unit: {obbData[0].unit}</h5>

      <h5 className="font-semibold">Line Name: {obbData[0]?.line}</h5>
    </div>
    <div className="flex-1 justify-around ml-[10px] leading-[1.5]">
      <h5 className="m-0 font-semibold">Buyer: {obbData[0]?.buyer}</h5>
      <h5 className="m-0 font-semibold">Style Name: {obbData[0]?.style}</h5>
      <h5 className="m-0 font-semibold"> Date: {date}</h5>
    </div>
  </div>
      <Table>
       
        {/* <TableCaption>LINE EFFICIENCY.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">MO ID</TableHead>
            <TableHead className="">MO Name</TableHead>
            <TableHead className="w-[200px]">Operation</TableHead>
            <TableHead className="text-center">Production pieces</TableHead>
            <TableHead className="text-center">SMV</TableHead>
            <TableHead className="text-center">Available Hours</TableHead>
            <TableHead className="text-center">Prodution Standard Hours </TableHead>
            <TableHead className="text-center">Off Stand Hours </TableHead>
            <TableHead className="text-center">Overall Efficiency </TableHead>
            <TableHead className="text-center">On Stand Efficiency </TableHead>
            {/* <TableHead className="text-right">Amount</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableProp.map((invoice,index) => (
            <TableRow key={index}>
              
              <TableCell className="text-center px-2 py-2">{invoice.operatorRfid}</TableCell>
              <TableCell className="font-medium px-2 py-2">{invoice.name}</TableCell>
              <TableCell className="font-medium px-2 py-2">{invoice.operation}</TableCell>
              <TableCell className="font-medium text-right px-2 py-2">{invoice.production}</TableCell>
              <TableCell className="font-medium text-right px-2 py-2">{invoice.smv}</TableCell>

              <TableCell className="text-right px-2 py-2">{invoice.hours}</TableCell>
              <TableCell className="text-right px-2 py-2">{invoice.earnHours}</TableCell>
              <TableCell className="text-right px-2 py-2">{invoice.offStandHours}</TableCell>
              <TableCell className="text-right px-2 py-2">{invoice.ovlEff}</TableCell>
              <TableCell className="text-right px-2 py-2">{invoice.onStndEff}</TableCell>
              {/* <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
        
      </Table>
     
      <Table>
      <TableFooter>
      <TableRow >
          <TableCell colSpan={5} ></TableCell>
          <TableCell className="text-right">Total Available Hours</TableCell>
          <TableCell className="text-center">Total Prodution Standard Hours</TableCell>
          <TableCell className="text-center">Total Off Stand Hours</TableCell>
          <TableCell className="text-center">Overall Efficiency</TableCell>
          <TableCell className="text-center">On Stand Efficiency</TableCell>
        </TableRow>
        <TableRow >
          <TableCell colSpan={5} >Total Line Efficiency</TableCell>
          <TableCell className="text-right">{tableProp.reduce((a,b)=>a+b.hours,0).toFixed(1)}</TableCell>
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
    )
  }
  