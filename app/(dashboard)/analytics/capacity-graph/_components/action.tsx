"use server";
import { neon } from "@neondatabase/serverless";




export async function getObb(unit:any) : Promise<{ id: string; name: string }[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql`
    select os.name as name ,os.id as id from "ObbSheet" os 

inner join "Unit" u on u.id= os."unitId"

where os."unitId"=${unit}
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
SELECT *, (SELECT COUNT(*) FROM OperationData) AS operations
FROM OperationData
ORDER BY "seqNo";

`
// console.log(obbSheetId)
    return new Promise((resolve) => resolve(data as any []))
}


export async function getTargetValues(obbSheetId:string) : Promise<any[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql`
      select "totalSMV" as tsmv,"obbOperationsNo" as operations from "ObbSheet" 
where id=${obbSheetId}

`
    
//      const data = await sql`
//       select l."totalSMV" as tsmv,l."obbManPowers" from "LineEfficiencyResources" l
// where l."obbSheetId" = ${obbSheetId}

// `
// console.log(obbSheetId)
    return new Promise((resolve) => resolve(data as any []))
}

export async function getCapacity(obbSheetId:string,date:string) : Promise<any[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql`
   select  AVG(CAST(ps.smv AS NUMERIC)) AS avg,ps."operatorRfid"
,os."bundleTime",os."personalAllowance",o.name,oo."seqNo",oo.target,sm."machineId" from "ProductionSMV" ps 
inner join "ObbOperation" oo on oo.id = ps."obbOperationId"
inner join "ObbSheet" os on os.id = oo."obbSheetId"
inner join "Operation" o on o.id = oo."operationId"
inner join "SewingMachine" sm on sm.id = oo."sewingMachineId"
where timestamp like ${date} and os.id =${obbSheetId}  and (CAST(ps.smv AS NUMERIC)) > 0
group by ps."operatorRfid",os."bundleTime",os."personalAllowance",o.name,oo."seqNo",oo.target,sm."machineId"

order by oo."seqNo"
`
// console.log(data)



///old one
// select  AVG(CAST(ps.smv AS NUMERIC)) AS avg,ps."operatorRfid"
// ,os."bundleTime",os."personalAllowance",o.name,oo."seqNo",oo.target,sm."machineId" from "ProductionSMV" ps 
// inner join "ObbOperation" oo on oo.id = ps."obbOperationId"
// inner join "ObbSheet" os on os.id = oo."obbSheetId"
// inner join "Operation" o on o.id = oo."operationId"
// inner join "SewingMachine" sm on sm.id = oo."sewingMachineId"
// where timestamp like ${date} and os.id = ${obbSheetId}
// group by ps."operatorRfid",o.name,oo."seqNo",sm."machineId",os."bundleTime",os."personalAllowance",oo.target
// HAVING AVG(CAST(ps.smv AS NUMERIC)) > 0
// order by oo."seqNo"
    
//      const data = await sql`
//       select l."totalSMV" as tsmv,l."obbManPowers" from "LineEfficiencyResources" l
// where l."obbSheetId" = ${obbSheetId}

// `
// console.log(obbSheetId)
    return new Promise((resolve) => resolve(data as any []))
}