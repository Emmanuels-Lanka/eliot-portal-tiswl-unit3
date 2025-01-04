"use server";
import { createPostgresClient } from "@/lib/postgres";
import { neon } from "@neondatabase/serverless";




export async function getObb(unit:any) : Promise<{ id: string; name: string }[]>  {
  

    const client = createPostgresClient();
    try {
  
      await client.connect();
      const query = `
        SELECT os.name AS name, os.id AS id 
        FROM "ObbSheet" os
        INNER JOIN "Unit" u ON u.id = os."unitId"
        WHERE os."unitId" = $1 AND os."isActive"
        ORDER BY os."createdAt" DESC
      `;
      const values = [unit];
  
      const result = await client.query(query, values);
  
      console.log("DATAaa: ", result.rows);
      return new Promise((resolve) => resolve(result.rows as { id: string; name: string }[]));
      
      
    } catch (error) {
      console.error("[TEST_ERROR]", error);
      throw error;
    }
    finally{
      await client.end()
    }
  
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
 SELECT 
    AVG(CAST(ps.smv AS NUMERIC)) AS avg,
    ps."operatorRfid",
    os."bundleTime",
    os."personalAllowance",
    o.name,
    oo."seqNo",
    oo.target,
    sm."machineId" ,
    os.name as obb
FROM 
    "ProductionSMV" ps 
INNER JOIN 
    "ObbOperation" oo ON oo.id = ps."obbOperationId"
INNER JOIN 
    "ObbSheet" os ON os.id = oo."obbSheetId"
INNER JOIN 
    "Operation" o ON o.id = oo."operationId"
INNER JOIN 
    "SewingMachine" sm ON sm.id = oo."sewingMachineId"
WHERE 
    timestamp like ${date+"%"}
    AND os.id = ${obbSheetId}
    and ps.smv <> '0.00'
   
GROUP BY 
    ps."operatorRfid",
    os."bundleTime",
    os."personalAllowance",
    o.name,
    oo."seqNo",
    oo.target,
    sm."machineId",
    os.name
ORDER BY 
    oo."seqNo";
`
console.log(date,obbSheetId)


//  recent one
// const data = await sql`
//    select  AVG(CAST(ps.smv AS NUMERIC)) AS avg,ps."operatorRfid"
// ,os."bundleTime",os."personalAllowance",o.name,oo."seqNo",oo.target,sm."machineId" from "ProductionSMV" ps 
// inner join "ObbOperation" oo on oo.id = ps."obbOperationId"
// inner join "ObbSheet" os on os.id = oo."obbSheetId"
// inner join "Operation" o on o.id = oo."operationId"
// inner join "SewingMachine" sm on sm.id = oo."sewingMachineId"
// where timestamp like ${date} and os.id =${obbSheetId}  and (CAST(ps.smv AS NUMERIC)) > 0
// group by ps."operatorRfid",os."bundleTime",os."personalAllowance",o.name,oo."seqNo",oo.target   ,sm."machineId"

// order by oo."seqNo"
// `




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