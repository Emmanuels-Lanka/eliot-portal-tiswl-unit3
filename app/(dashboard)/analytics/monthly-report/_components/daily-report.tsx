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
import { getCount, getCountType, getDailyData, getDateTypes, getEffData, getPrisma, getTimeslot, ProductionData } from "./actions";
// import SelectObbSheetAndDate from "@/components/dashboard/common/select-style-and-date";
import { Button } from "@/components/ui/button";
import SelectObbSheetAndDate from "./select-style-and-date";
import { getFormattedTime } from "@/lib/utils-time";
import { getObbData } from "../../line-efficiency/_components/actions";

interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
}


interface OperatorData {
  production_date: string;
  operatorRfid: string;
  daily_total: string;
  name: string;
  LoginDate: string;
  smv: number;
  LoginTimestamp: string;
  LogoutTimestamp: string;
  date: string;
  diff: number;
  eff: number;
}

interface Operator {
  operator: string;
  data: OperatorData[];
}

type OperatorsList = Operator[];



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

interface ProcessedData {
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

interface PropsD {
  processed: ProcessedData[];
}


export type ReportDataOut = ReportData & {
  diffInMinutes: number;
};

type outputMergeArr = getCountType & getDateTypes


export type MergedType = getCountType & getDateTypes;

const ReportTable = ({ obbSheets }: AnalyticsChartProps) => {
  const [date, setDate] = useState<string>("");
  const [startdate, setStartDate] = useState<string>("");
  const [enddate, setendDate] = useState<string>("");
  const [data, setData] = useState<ProcessedData[]>([]);
  const [obb,setObb]=useState<any>()
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const reportRef = useRef<HTMLDivElement | null>(null);

  const handleFetchProductions = async (data: { obbSheetId: string; date: Date;endDate:Date }) => {

    const start = getFormattedTime(data.date.toString())
    const end = getFormattedTime(data.endDate.toString())
    
    setStartDate(start)
    setendDate(end)
    console.log("dates",start,end)


    data.date.setDate(data.date.getDate() + 1);
    const formattedDate = data.date.toISOString().split("T")[0];
    setDate(formattedDate);
    setObbSheetId(data.obbSheetId);
  };


  function getDayDifference(startDate: string, endDate: string): number {
 
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    
    const timeDifference = end.getTime() - start.getTime();
  
    
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  }

  const averageCalculation = (data:ProductionData[],diff:number)=>{

    const map = data.map((d)=>{
      const totalWorkingMinutesPerDay = 8 * 60; 
      const totalWorkingMinutes = diff * totalWorkingMinutesPerDay;
      const earnMins = d.counts*d.smv
      const eff = Number(((earnMins/(totalWorkingMinutes))* 100).toFixed(2))
      return {
        ...d,eff,mins:totalWorkingMinutes
      }
    })

    return map

  }


  const mergeArr = (time: getDateTypes[], count: getCountType[]): any[] => {

    console.log(time)
    console.log(count)

    const newArre = time.map((c) => {

      const found = count.find((t) => t.operatorRfid === c.operatorRfid && t.LoginDate == c.LoginDate);
     
    return {

        ...found,...c,

    };

});

    console.log("new", newArre);

    return newArre;

};




const processData = (data:outputMergeArr[])=> {


  const operationsMap: { [key: string]: outputMergeArr[] } = {};
  data.forEach(data => {
      if (!operationsMap[data.operatorRfid]) {
          operationsMap[data.operatorRfid] = [];
      }
      operationsMap[data.operatorRfid].push(data);
  });

  console.log("asdasda",operationsMap)
  
  const operations = Object.values(operationsMap).map(group => ({
    operator: group[0].operatorRfid,
    data: group.map((g)=>{
      const login = new Date(g.LoginTimestamp)
      const logout = new Date (g.LogoutTimestamp)
      const diff = (logout.getTime()- login.getTime())/60000
      const earnMins = (g.daily_total*g.smv)
      const eff = Number(((earnMins/diff)*100).toFixed(2))

      return {
        ...g,diff,eff
      }
    })

})).sort();


console.log("ooo",operations)


return operations



  }

  


  // const calculateAverageEfficiency = (groupedData: { [key: string]: ReportDataOut[] }) => {
  //   return Object.values(groupedData).map((operatorData) => {
  //     // Get all valid timestamps for the operator
  //     const allTimestamps = operatorData.flatMap(op => [
  //       new Date(op.first).getTime(),
  //       new Date(op.last).getTime()
  //     ]).filter(time => !isNaN(time));

  //     if (allTimestamps.length === 0) {
  //       return {
  //         operatorname: operatorData[0].operatorname,
  //         employeeId: operatorData[0].employeeId,
  //         unitname: operatorData[0].unitname,
  //         buyer: operatorData[0].buyer,
  //         style: operatorData[0].style,
  //         linename: operatorData[0].linename,
  //         efficiency: 0,
  //         achievements: "Below Target",
  //         smv:operatorData[0].smv,
  //         seqNo:operatorData[0].seqNo
  //       };
  //     }

  //     // Find the actual working period
  //     const earliestStart = new Date(Math.min(...allTimestamps));
  //     const latestEnd = new Date(Math.max(...allTimestamps));

  //     // Calculate total working minutes
  //     const totalMinutes = Math.max(0, Math.round((latestEnd.getTime() - earliestStart.getTime()) / (1000 * 60)));
      
  //     // Subtract break time (60 minutes) only if working time is more than 60 minutes
  //     const breakTime = totalMinutes > 60 ? 60 : 0;
  //     const actualWorkingMinutes = Math.max(1, totalMinutes - breakTime); // Ensure minimum 1 minute to avoid division by zero

  //     // Calculate total earned minutes across all operations
  //     const totalEarnedMinutes = operatorData.reduce((acc, operation) => {
  //       const count = Number(operation.count) || 0;
  //       const smv = operation.smv || 0;
  //       return acc + (count * smv);
  //     }, 0);

  //     // Calculate efficiency (ensure non-negative value)
  //     const efficiency = Math.max(0, Math.min(100, Math.round((totalEarnedMinutes / actualWorkingMinutes) * 100)));

  //     // Achievement based on efficiency
  //     const achievement =
  //       efficiency >= 80
  //         ? "Exceeded Target"
  //         : efficiency >= 70
  //         ? "On Target"
  //         : "Below Target";

  //     return {
  //       operatorname: operatorData[0].operatorname,
  //       employeeId: operatorData[0].employeeId,
  //       unitname: operatorData[0].unitname,
  //       buyer: operatorData[0].buyer,
  //       style: operatorData[0].style,
  //       linename: operatorData[0].linename,
  //       efficiency,
  //       achievements: achievement,
  //       smv:operatorData[0].smv,
  //       seqNo:operatorData[0].seqNo
  //     };
  //   });
  // };

  // const groupByOperator = (details: ReportDataOut[]) => {
  //   const operatorsMap: { [key: string]: ReportDataOut[] } = {};
  //   details.forEach((data) => {
  //     if (!operatorsMap[data.employeeId]) {
  //       operatorsMap[data.employeeId] = [];
  //     }
  //     operatorsMap[data.employeeId].push(data);
  //   });
  //   return operatorsMap;
  // };

  // function getMinutesDifference(data: ReportData[]): ReportDataOut[] {
  //   return data.map((d) => {
  //     const start = new Date(d.first);
  //     const end = new Date(d.last);
  //     const diffInMs = Math.max(0, end.getTime() - start.getTime());
  //     const diffInMinutes = Math.round(diffInMs / (1000 * 60));

  //     return {
  //       ...d,
  //       diffInMinutes,
  //     };
  //   });
  // }

  const getDetails = async () => {
    // const details = await getDailyData(obbSheetId, startdate,enddate);
    // const eff = await getEffData(obbSheetId, startdate,enddate);
    // // console.log(eff)
    // const obb = await getObbData(obbSheetId)

    // setObb(obb)


    // const diff = getDayDifference(startdate,enddate)
    // const final = averageCalculation(eff,diff)
    // // console.table(final)
    // const grouped  = [...final,...obb]
    // mergeArr(final,obb)
    // console.log(grouped)
    
    // // const timeData = getMinutesDifference(details);
    // // const groupedData = groupByOperator(timeData);
    // // const result = calculateAverageEfficiency(groupedData);
    
    const time = await getTimeslot(" "," ","")
    const count = await getCount(" "," ","")
   
    const merged = mergeArr(time,count)
    const processed = processData(merged)
    setData(processed);
    

    


  };

  useEffect(() => {
    if (obbSheetId && date) {
      getDetails();
    }
  }, [obbSheetId, startdate,enddate]);

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
          padding: 10px; /* Reduced padding */
          font-size: 12px; /* Reduced font size */
        }
        .container {
          width: 90%; /* Reduced width */
          margin: 0 auto;
          padding: 10px; /* Reduced padding */
          box-sizing: border-box;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px; /* Reduced margin */
        }
        th, td {
          border: 1px solid #ddd;
          padding: 4px; /* Reduced padding */
          font-size: 12px; /* Reduced font size for table cells */
        }
        th {
          text-align: center;
          background-color: gray;
        }
        td {
          text-align: center;
        }
        .logo-div {
          text-align: center;
        }
        .logo-div img {
          width: 120px; /* Reduced logo size */
          height: auto;
        }
        .text-center {
          text-align: center;
        }
        .footer-logo img {
          width: 100px; /* Reduced footer logo size */
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

<div style="display: flex; justify-content: space-between; margin-top: 20px; font-size: 14px;">
  <!-- First Part -->
  <div style="flex: 1; margin-right: 10px; line-height: 1.5;">
    <h5 style="margin: 0;">Factory Name: Apparel Gallery LTD</h5>
    <h5 style="margin: 0;">Title: Operator Daily Efficiency Report</h5>
    <h5 style="margin: 0;">Starting Date: ${startdate}</h5>
    <h5 style="margin: 0;">Ending Date: ${enddate}</h5>
  </div>

  <!-- Second Part -->
  <div style="flex: 1; margin-left: 10px; line-height: 1.5;">
    <h5 style="margin: 0;">Unit: ${obb[0]?.unit}</h5>
    <h5 style="margin: 0;">Buyer: ${obb[0]?.buyer}</h5>
    <h5 style="margin: 0;">Style Name: ${obb[0]?.style}</h5>
    <h5 style="margin: 0;">Line Name: ${obb[0]?.line}</h5>
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
              <TableHead>Emp ID</TableHead>
              <TableHead>Operator Name</TableHead>
              <TableHead>total</TableHead>
              <TableHead>SMV</TableHead>
              <TableHead>date</TableHead>
              <TableHead>Efficiency(%)</TableHead>
              <TableHead>smvvvvvv(%)</TableHead>
              {data.map((d:ProcessedData, index:any) => (
                d.data.map((o,indexw)=>{
                  return (
              <TableHead key={indexw}> { o.LoginDate } </TableHead>
              )
              })
              ))}

            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d:ProcessedData, index:any) => (
                d.data.map((o,indexw)=>{
                  return (
                    
              <TableRow key={indexw}>
              <TableCell>{o.operatorRfid}</TableCell>
              <TableCell>{o.name}</TableCell>
              <TableCell>{o.daily_total}</TableCell>
              <TableCell>{o.smv}</TableCell>
              <TableCell>{o.LoginDate}</TableCell>
              <TableCell>{o.eff}</TableCell>
              <TableCell className="text-center">{o.smv ? (60 / o.smv).toFixed(2) : 0}</TableCell>
            

              <TableCell className="text-center">{o.daily_total}</TableCell>
            </TableRow>
                  )
                })



              
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportTable;