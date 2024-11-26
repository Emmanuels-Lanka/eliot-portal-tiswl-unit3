"use server";
import { neon } from "@neondatabase/serverless";




export async function getObb(unit:any) : Promise<{ id: string; name: string }[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql`
    select os.name as name ,os.id as id from "ObbSheet" os 

inner join "Unit" u on u.id= os."unitId"

where os."unitId"=${unit} and os."isActive"
 order by os."createdAt" desc

`
console.log(unit)
    return new Promise((resolve) => resolve(data as { id: string; name: string }[]))
}


export async function getOperationSmv(obbSheetId:string,date:string) : Promise<any[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql`
      WITH OperationData AS (
    SELECT os."seqNo", os.smv, o.name
    FROM "ObbOperation" os
    INNER JOIN "Operation" o ON o.id = os."operationId"
    WHERE os."obbSheetId" = ${obbSheetId}
)
SELECT *, (SELECT COUNT(DISTINCT name) FROM OperationData) AS operations
FROM OperationData
ORDER BY "seqNo";

`
// console.log(obbSheetId)
    return new Promise((resolve) => resolve(data as any []))
}


export async function getTargetValues(obbSheetId:string) : Promise<any[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql`
      select "totalSMV" as tsmv,"obbOperationsNo"as operations , name as obb from "ObbSheet" 
where id=${obbSheetId}

`
    
//      const data = await sql`
//       select l."totalSMV" as tsmv,l."obbManPowers" from "LineEfficiencyResources" l
// where l."obbSheetId" = ${obbSheetId}

// `
// console.log(obbSheetId)
    return new Promise((resolve) => resolve(data as any []))
}