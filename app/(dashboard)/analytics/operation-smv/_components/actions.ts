"use server"
import { neon } from "@neondatabase/serverless";

export async function getSMV(obbSheetId:String,date:String) {
  
  const sql = neon(process.env.DATABASE_URL || "");

  const startDate = `${date} 00:00:00`; // Start of the day
  const endDate = `${date} 23:59:59`; // End of the day

  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);
  const smv = await sql `SELECT 
  p.id,
  o.smv,
  op.name,
  op.code
FROM 
  "ProductionSMV" p
JOIN 
  "ObbOperation" o ON p."obbOperationId" = o.id
JOIN 
  "Operation" op ON o."operationId" = op.id
WHERE 
  o."obbSheetId" = ${obbSheetId}
  AND p.timestamp >=${startDate}
  AND p.timestamp <= ${endDate }
ORDER BY 
  p.id ASC;`

  console.log("SMV Data",smv)

  return smv;
}