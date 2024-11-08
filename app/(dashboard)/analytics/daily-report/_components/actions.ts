

"use server";
import { neon } from "@neondatabase/serverless";

import { ReportData } from "./daily-report";


export async function getDailyData(obbsheetid:string,date:string)  : Promise<ReportData[]>   {
    
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`
    select opr.id,obbop."seqNo", opr.name as operatorname,
           op.name as operationname,
           sum(pd."productionCount") as count,
           obbop.smv as smv,
           obbop.target,
           unt.name as unitname,
           obbs.style as style,
           sm."machineId" as machineid,
           pl.name as linename,
           obbs.buyer,
           opr."employeeId",  MIN(pd."timestamp") AS first, -- Earliest timestamp in the group
    MAX(pd."timestamp") AS last  -- Latest timestamp in the group
    from "ProductionData" pd
    inner join "Operator" opr on pd."operatorRfid" = opr.rfid 
    inner join "ObbOperation" obbop on pd."obbOperationId" = obbop.id
    inner join "ObbSheet" obbs on obbop."obbSheetId" = obbs.id
    inner join "Operation" op on obbop."operationId" = op.id
    inner join "Unit" unt on obbs."unitId" = unt.id
    inner join "SewingMachine" sm on obbop."sewingMachineId"=sm.id
     inner join "ProductionLine" pl on pl.id=obbs."productionLineId"
    where pd."timestamp" LIKE ${date} AND obbs.id = ${obbsheetid}
    group by opr.id, opr.name, op.name,obbop."seqNo", obbop.smv, obbop.target, unt.name, obbs.style,sm.id,pl.name,obbs.buyer, opr."employeeId"
    order by obbop."seqNo"`;
    
   console.log(obbsheetid,date)

 
    return new Promise((resolve) => resolve(data as ReportData[]  ))
}


