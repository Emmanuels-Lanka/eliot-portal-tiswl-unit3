"use client"

import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getDailyData, getDefects, getDHUData, inspaetfetch } from "./actions";
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
  operatorid:string;
}

export type ReportData1 = {
  id: string;
  operatorid:string;
  operatorname: string;
  operationname: string;
  smv: number;
  target: number;
  efficiency: number;
  achievements: string;
  unitname: string;
  style: string;
  machineid: string;
  linename: string;
  buyer: string;
  seqNo:number;
  inspect:number;
};
type combinedData={
 count:number;
 id:string;
 linename:string;
 machineid:string;
 name:string;
  operationname:string;
  operatorid:string;
  operatorname:string;
  qc:string;
  style:string;
  target:number;
  unitname:string;
  defectcount:number;
  seqNo:number;
  inspectcount:number;
  

}
type ReportData2={
  defectcount:number;
  operatorid:string;
}
type ReportData3={
  inspectcount:number;
  operatorid:string;
}
const DhuReport=({ obbSheets }: AnalyticsChartProps)=>{

  const [date, setDate] = useState<string>("");
  const [data, setData] = useState<ReportData[]>([]);
  const [data1,setData1]=useState<ReportData1[]>([]);
  const [data2,setData2]=useState<ReportData2[]>([]);
  const [data3,setData3]=useState<ReportData3[]>([]);
  const[combined,setcombined]=useState<combinedData[]>([]);
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const reportRef = useRef<any>(null);


  const handleFetchProductions = async (data: { obbSheetId: string; date: Date }) => {
    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split('T')[0].toString() + "%";
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);
  };


  // const getDetails = async () => {
  //   const details = await getDHUData(obbSheetId, date);
  //   const details1=await getDailyData(obbSheetId,date);
  //   const details2=await getDefects(obbSheetId,date);

  //   setData(details);
  //   setData1(details1);
  //   setData2(details2)
  //   console.log("details",details)
  //   console.log("details1",details1)
  //   console.log("details1",details2)

  //   const combinedDetails = [];

  //   console.log("Iterating through details");
  //   for (const detail of details) {
  //     for (const detail1 of details1) {
  //       for (const detail2 of details2) {
  //         if (detail.operatorid === detail1.operatorid && detail.operatorid === detail2.operatorid) {
  //           console.log("Match found:", { ...detail, ...detail1, ...detail2 });
  //           combinedDetails.push({ ...detail, ...detail1, ...detail2});
  //           setcombined(combinedDetails)
  //         }
  //       }
  //     }
  //   }
  //   console.log("combined Details000000",combinedDetails)
    
  // };


  const getDetails = async () => {
    const details = await getDHUData(obbSheetId, date);
    const details1 = await getDailyData(obbSheetId, date);
    const details2 = await getDefects(obbSheetId, date);
    const details3 = await inspaetfetch(obbSheetId, date);
   
    
    setData(details);
    setData1(details1);
    setData2(details2);
    setData3(details3);
    console.log("details 3333333333333333",details3)
    const combinedMap = new Map<string, combinedData>();
  
    for (const detail of details) {
      for (const detail1 of details1) {
        for (const detail2 of details2) {
         for(const detail3 of details3){
          if (detail.operatorid === detail1.operatorid && detail.operatorid === detail2.operatorid && detail3.inspectcount>0) {
            const key = detail.operatorid;
            const existing = combinedMap.get(key);
  
            if (existing) {
              // If a record for this operator already exists, sum the defectcount as numbers
              existing.defectcount += Number(detail2.defectcount);
              // Add an instance number if needed
              
            } else {
              // Add new record to the map
              combinedMap.set(key, {
                ...detail,
                ...detail1,
                ...detail2,
                ...detail3,
                defectcount: Number(detail2.defectcount),  // Ensure defectcount is treated as a number
                name: `${detail.name}`,    // Include seqNo in the name
              });
            }
          }
         }
        }
      }
    }
  
    // Convert Map back to array for rendering
    setcombined(Array.from(combinedMap.values()));
  };
  

  // const getDetails = async () => {
  //   const details = await getDHUData(obbSheetId, date);
  //   const details1 = await getDailyData(obbSheetId, date);
  //   const details2 = await getDefects(obbSheetId, date);
  
  //   setData(details);
  //   setData1(details1);
  //   setData2(details2);
  
  //   const combinedMap = new Map<string, combinedData>();
  //   const nameCountMap = new Map<string, number>();  // Track how many times a name appears
  
  //   for (const detail of details) {
  //     for (const detail1 of details1) {
  //       for (const detail2 of details2) {
  //         if (detail.operatorid === detail1.operatorid && detail.operatorid === detail2.operatorid) {
  //           const key = detail.operatorid;
  //           const existing = combinedMap.get(key);
  
  //           if (existing) {
  //             // Combine defect counts
  //             existing.defectcount += Number(detail2.defectcount);
  
  //             // Get the current count for this operator name and increment it
  //             let nameCount = nameCountMap.get(detail.name) || 1;
  //             nameCountMap.set(detail.name, nameCount + 1);
  
  //             // Append instance number if not already appended
  //             if (nameCount === 2) {
  //               existing.name = `${existing.name} 1&2`;
  //             } else if (nameCount > 2) {
  //               existing.name = `${existing.name.split(" ")[0]} 1&${nameCount}`;
  //             }
  //           } else {
  //             // Initialize new record
  //             combinedMap.set(key, {
  //               ...detail,
  //               ...detail1,
  //               ...detail2,
  //               defectcount: Number(detail2.defectcount),
  //               name: detail.name,  // Just use the name, no seqNo
  //             });
  
  //             // Initialize count for this name
  //             nameCountMap.set(detail.name, 1);
  //           }
  //         }
  //       }
  //     }
  //   }
  
  //   // Convert Map back to array for rendering
  //   setcombined(Array.from(combinedMap.values()));
  // };
  


  
  
  
  

  useEffect(() => {
    console.log("Combined Data:", combined); // Log combined data
  }, [combined]);
 

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
            <h5>Title: Operator DHU Report</h5>
            <h5>Date: ${formattedDate}</h5>
 
          <h5>Unit: ${data1[0].unitname}</h5>
         <h5>Style Name: ${data1[0].style}</h5>
           <h5>Line Name: ${data1[0].linename}</h5>
                
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
        <div ref={reportRef} className="container mt-5 mb-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Emp ID:</TableHead>
              <TableHead>Operator Name</TableHead>
              <TableHead>Operation Name</TableHead>
              <TableHead>Operated Machine</TableHead>
              <TableHead>No. Of Gmt inspect</TableHead>
              <TableHead>No. Of defects</TableHead>
              <TableHead>DHU</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combined.map((d, rid) => (
              <TableRow key={rid}>
                <TableCell>{rid+1}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.operationname}</TableCell>
                <TableCell>{d.machineid}</TableCell>
                <TableCell>{d.inspectcount}</TableCell>
                <TableCell>{d.defectcount}</TableCell>
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