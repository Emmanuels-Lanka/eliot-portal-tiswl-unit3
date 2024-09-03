"use server"
import { neon } from "@neondatabase/serverless";
import { ReportData } from "./efficiency-report";


export async function getDailyData(obbsheetid:string,date:string) : Promise<ReportData[]>   {
    
  const sql = neon(process.env.DATABASE_URL || "");

  const data = await sql`
  SELECT 
      CONCAT(op."employeeId", '=>', op.name, '[', op."designation", ']') AS name,
      SUM(pd."productionCount") AS "productionCount",
      EXTRACT(hour FROM pd.timestamp::TIMESTAMP) AS hour,
      obbop.target,
      sw."machineType" as machine,
      obbop.id as obboperation
  FROM 
      "ProductionData" pd
  INNER JOIN "Operator" op ON op.rfid = pd."operatorRfid"
  INNER JOIN "ObbOperation" obbop ON obbop.id = pd."obbOperationId"
  INNER JOIN "ObbSheet" obs ON obs.id = obbop."obbSheetId"
  INNER JOIN "SewingMachine" sw ON sw.id = obbop."sewingMachineId"
  WHERE pd.timestamp::TEXT LIKE ${date} AND obs.id = ${obbsheetid}
  GROUP BY 
      hour, 
      op."employeeId", 
      op.name, 
      op."designation", 
      obbop.target, 
      sw."machineType",
      obbop.id 
        having  sum(pd."productionCount")<>0     
`; 
   
console.log("Effeciency Data",data)
return new Promise((resolve) => resolve(data as ReportData[]))

}

