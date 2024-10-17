"use server";
import { neon } from "@neondatabase/serverless";


export async function getData(obbsheetid:string,date:string)  : Promise<any[]>{
    const sql = neon(process.env.DATABASE_URL || "");
    //,pd."eliotSerialNumber" as eliotid
    const data = await sql`SELECT pd."productionCount" as count, concat(substring(concat(oo."seqNo",'-',o.name ) from 0 for 30),' ','(',sm."machineId",')') as name  ,
     pd.timestamp as timestamp, oo."seqNo",oo.target,oo.smv as smv
    FROM "ProductionData" pd
    right JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    inner JOIN "Operation" o ON o.id= oo."operationId"
     inner join "SewingMachine" sm on sm.id=oo."sewingMachineId"
    WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
     order by  pd.timestamp ;`;
 
 
    return new Promise((resolve) => resolve(data ))
}

export async function geOperationList(obbsheetid:string ,date:string) : Promise<any[]>  {
    const sql = neon(process.env.DATABASE_URL || "");
 
    // const data = await sql`SELECT   concat(oo."seqNo",'-',o.name ) as name
    const data = await sql`SELECT concat (substring(concat(oo."seqNo",'-',o.name ) from 0 for 30),' ','(',sm."machineId",')')  as name
    FROM "ObbOperation" oo  
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    inner JOIN "Operation" o ON o.id= oo."operationId"
    inner join "SewingMachine" sm on sm.id=oo."sewingMachineId"
    inner Join "ProductionData" pd ON pd."obbOperationId" = oo.id
    WHERE os.id = ${obbsheetid}  and pd.timestamp like ${date}
    GROUP BY  concat (substring(concat(oo."seqNo",'-',o.name ) from 0 for 30),' ','(',sm."machineId",')'),oo."seqNo"
    order by  oo."seqNo" ;`;
 
 
    return new Promise((resolve) => resolve(data ))
}

export async function getEliotMachineList(obbsheetid:string ) : Promise<any[]>  {
    const sql = neon(process.env.DATABASE_URL || "");
 
    // const data = await sql`SELECT   concat(oo."seqNo",'-',o.name ) as name
    const data = await sql`SELECT sm."machineId",ed."serialNumber"
    FROM "ObbOperation" oo  
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    inner JOIN "SewingMachine" sm ON sm."id"= oo."sewingMachineId"
    inner JOIN "EliotDevice" ed ON ed.id = sm."eliotDeviceId"
    inner Join "ProductionData" pd ON pd."obbOperationId" = oo.id
    WHERE os.id = ${obbsheetid}  
     order by  oo."seqNo" ;`;

  
 
    return new Promise((resolve) => resolve(data ))
}