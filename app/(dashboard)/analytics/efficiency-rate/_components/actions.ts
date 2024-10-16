"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "./analytics-chart";

export async function   getOperatorEfficiency(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
    const sql = neon(process.env.DATABASE_URL || "");

    // const data1 = await sql`SELECT sum(pd."productionCount") as count,o.name  ,oo.target
    //         FROM "ProductionData" pd
    //         INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    //         INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    //         INNER JOIN "Operation" o ON o.id= pd."obbOperationId"
    //         WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
    //         group by o.name,oo."seqNo",oo.target order by  oo."seqNo" ;`;
    
     const data = await sql`
WITH avg_smv AS (
    SELECT oo."seqNo", o.name, AVG(CAST(oo.smv AS NUMERIC)) AS avg
    FROM "ProductionSMV" ps
    INNER JOIN "ObbOperation" oo ON oo."id" = ps."obbOperationId"
    INNER JOIN "ObbSheet" os ON os."id" = oo."obbSheetId"
    INNER JOIN "Operation" o ON o."id" = oo."operationId"
    WHERE os."id" = ${obbsheetid}
    GROUP BY oo."seqNo", o.name
),

production_count AS (
    SELECT oo."seqNo", o.name, SUM(pd."productionCount") AS count,
    MAX(TO_TIMESTAMP(pd."timestamp", 'YYYY-MM-DD HH24:MI:SS')) AS last ,
    min(TO_TIMESTAMP(pd."timestamp", 'YYYY-MM-DD HH24:MI:SS')) AS first
    FROM "ProductionData" pd
    INNER JOIN "ObbOperation" oo ON oo."id" = pd."obbOperationId"
    INNER JOIN "ObbSheet" os ON os."id" = oo."obbSheetId"
    INNER JOIN "Operation" o ON o."id" = oo."operationId"
    WHERE pd.timestamp LIKE ${date} 
      AND os."id" = ${obbsheetid}
    GROUP BY oo."seqNo", o.name
)

SELECT a."seqNo", a.name, a.avg, p.count,p.first,p.last
FROM avg_smv a
JOIN production_count p ON a."seqNo" = p."seqNo" AND a.name = p.name
ORDER BY a."seqNo";
`
    
            // console.log(data)
    
    
    return new Promise((resolve) => resolve(data as any[] ))
}




export async function   getHours(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
    const sql = neon(process.env.DATABASE_URL || "");


     const data = await sql`select  MIN(TO_TIMESTAMP(os."LoginTimestamp", 'YYYY-MM-DD HH24:MI:SS')) AS login,
MAX(TO_TIMESTAMP(os."LogoutTimestamp", 'YYYY-MM-DD HH24:MI:SS')) AS logout , o.name as namee
from "OperatorSession" os
inner join "ObbOperation" oo  on oo.id = os."obbOperationId"
inner join "Operation" o  on o.id = oo."operationId"
inner join "ObbSheet" oss  on oss.id = oo."obbSheetId"

where "LoginTimestamp" like ${date} and
 oo."obbSheetId" = ${obbsheetid}

group by namee,oo."seqNo"
order by oo."seqNo"
`
    
            // console.log(data)
    
    
    return new Promise((resolve) => resolve(data as any[] ))
}