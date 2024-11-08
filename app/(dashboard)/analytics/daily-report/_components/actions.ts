

"use server";
import { neon } from "@neondatabase/serverless";

import { ReportData } from "./daily-report";


export async function getDailyData(obbsheetid:string,date:string)  : Promise<ReportData[]>   {
    
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`
    SELECT 
    opr.id,
    obbop."seqNo",
    opr.name AS operatorname,
    op.name AS operationname,
    SUM(pd."productionCount") AS count,
    obbop.smv AS smv,
    obbop.target,
    unt.name AS unitname,
    obbs.style AS style,
    sm."machineId" AS machineid,
    pl.name AS linename,
    obbs.buyer,
    opr."employeeId",
    os.first_login AS first,  -- Earliest timestamp from subquery
    MAX(pd."timestamp") AS last  -- Latest timestamp in the group
FROM "ProductionData" pd
INNER JOIN "Operator" opr ON pd."operatorRfid" = opr.rfid 
INNER JOIN "ObbOperation" obbop ON pd."obbOperationId" = obbop.id
INNER JOIN "ObbSheet" obbs ON obbop."obbSheetId" = obbs.id
INNER JOIN "Operation" op ON obbop."operationId" = op.id
INNER JOIN "Unit" unt ON obbs."unitId" = unt.id
INNER JOIN "SewingMachine" sm ON obbop."sewingMachineId" = sm.id
INNER JOIN "ProductionLine" pl ON pl.id = obbs."productionLineId"
-- Subquery to get the earliest LoginTimestamp for each operator on the selected date
LEFT JOIN (
    SELECT 
        "operatorRfid",
        MIN("LoginTimestamp") AS first_login
    FROM "OperatorSession"
    WHERE "LoginTimestamp" LIKE ${date}
    GROUP BY "operatorRfid"
) AS os ON os."operatorRfid" = opr.rfid
WHERE pd."timestamp" LIKE ${date} 
    AND obbs.id = ${obbsheetid}
GROUP BY 
    opr.id, 
    opr.name, 
    op.name, 
    obbop."seqNo", 
    obbop.smv, 
    obbop.target, 
    unt.name, 
    obbs.style, 
    sm.id, 
    pl.name, 
    obbs.buyer, 
    opr."employeeId", 
    os.first_login
ORDER BY obbop."seqNo";
`;
    
   console.log(obbsheetid,date)

 
    return new Promise((resolve) => resolve(data as ReportData[]  ))
}


