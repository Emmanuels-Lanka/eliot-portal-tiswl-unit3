"use server";
import { neon } from "@neondatabase/serverless";
// import { ProductionDataType } from "./analytics-chart";

export async function getOperatorEfficiency(obbsheetid:string,date:string,timeValue:string)    {
    const sql = neon(process.env.DATABASE_URL || "");

    // date = date+" "+timeValue+":%"
    date = date+"%";
    // date=date+" 10:%";
    // 
    
     const data = await sql`
     
     select sum(pd."productionCount") as total,oo."seqNo" as seqNo,concat(oo."seqNo",'-',o.name) as name,o.name as oprnName,op.name as oprtName,MAX(oet.net) as net,op.rfid
from "ProductionData" pd
inner join "ObbOperation" oo on oo.id = pd."obbOperationId" 
inner join "Operation" o on o.id = oo."operationId"
inner join "ObbSheet" os on os.id =  oo."obbSheetId"
inner join "Operator" op on op.rfid = pd."operatorRfid"

INNER JOIN (
    SELECT DISTINCT ON (oet."operatorRfid") oet."operatorRfid",oet."nonEffectiveTime" net
    FROM "OperatorEffectiveTime" oet
    WHERE oet."loginTimestamp" LIKE ${date}
) oet ON oet."operatorRfid" = pd."operatorRfid"

where pd.timestamp like ${date} and os.id= ${obbsheetid}
group by oo."seqNo",o.name,op.name,net,op.rfid

     `
//      const data = await sql`SELECT 
//     concat(obbopn."seqNo", '-', opn.name) AS name,
//     SUM(pd."productionCount") AS count,
//     obbopn.target,
//     obbopn."seqNo",
//     MAX(oet."NoTime") AS "nonEffectiveTime",
//     MAX(oet."DTime") AS "mechanicDownTime",
//     MAX(oet."PTime") AS "productionDownTime",
//     MAX(oet."LTime") AS "lunchBreakTime",
//     MAX(oet."OTime") AS "offStandTime",
//     MAX(oet."TTime") AS "totalTime"
    
    
// FROM 
//     "ProductionData" pd
// INNER JOIN 
//     "ObbOperation" obbopn ON pd."obbOperationId" = obbopn.id
// INNER JOIN 
//     "Operation" opn ON opn.id = obbopn."operationId"
// INNER JOIN 
//     "ObbSheet" obbs ON obbopn."obbSheetId" = obbs.id
// -- Subquery to select distinct nonEffectiveTime per operator
// LEFT JOIN (
//     SELECT 
//         "operatorRfid", 
//         MAX("nonEffectiveTime") AS "NoTime",
//         MAX("mechanicDownTime") AS "DTime",
//         MAX("productionDownTime") AS "PTime",
//         MAX("lunchBreakTime") AS "LTime",
//         MAX("offStandTime") AS "OTime",
//         MAX("totalTime") AS "TTime"
//     FROM 
//         "OperatorEffectiveTime" oet
//     where oet."loginTimestamp" LIKE ${date}

//     GROUP BY 
//         "operatorRfid"
// ) oet ON oet."operatorRfid" = pd."operatorRfid"
// WHERE 
//     pd.timestamp LIKE ${date}  
//     AND obbs.id = ${obbsheetid}
// GROUP BY 
//     opn.name, obbopn."seqNo", obbopn.target
// ORDER BY 
//     obbopn."seqNo";`
    
            console.log(data)
            // console.log("date, ",date,"ob",obbsheetid)
    
    
    return new Promise((resolve) => resolve(data ))
}



export async function getSMV(obbsheetid:string,date:string,timeValue:string)    {
    const sql = neon(process.env.DATABASE_URL || "");

   date=date+"%";
//    date = date+" "+timeValue+":%"

    ///data avg is target smv and not the real one , change p.smv for the real one
    
     const data = await sql`SELECT 
    AVG(CAST(o.smv AS NUMERIC)) AS avg,
    
     concat(o."seqNo",'-',op.name) as name,
    o."seqNo"
   
FROM 
    "ProductionSMV" p
JOIN 
    "ObbOperation" o ON p."obbOperationId" = o.id
JOIN 
    "Operation" op ON o."operationId" = op.id

  --INNER JOIN "ProductionSMV" pd ON pd."obbOperationId" = o.id
  WHERE 
      o."obbSheetId" = ${obbsheetid}
      AND p.timestamp like ${date}
      
          
group by name,o."seqNo"

order by o."seqNo"`;
    
            // console.log(data)
    
    
    return new Promise((resolve) => resolve(data  ))
}