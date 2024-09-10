"use server";
import { neon } from "@neondatabase/serverless";


export async function getData(obbsheetid:string,date:string)  : Promise<any[]>{
    const sql = neon(process.env.DATABASE_URL || "");
    //,pd."eliotSerialNumber" as eliotid
    const data = await sql`SELECT pd."productionCount" as count, concat(substring(concat(o.name ) from 0 for 20),' ','(',sm."machineId",') - ',oo."seqNo") as name  ,
     pd.timestamp as timestamp, oo."seqNo",oo.target
    FROM "ProductionData" pd
    right JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    inner JOIN "Operation" o ON o.id= oo."operationId"
     inner join "SewingMachine" sm on sm.id=oo."sewingMachineId"
    WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
     order by  pd.timestamp ;`;
 
 
    return new Promise((resolve) => resolve(data ))
}

export async function geOperationList(obbsheetid:string , date:string) : Promise<any[]>  {
    const sql = neon(process.env.DATABASE_URL || "");
 
    // const data = await sql`SELECT   concat(oo."seqNo",'-',o.name ) as name
    const data = await sql`SELECT concat (substring(concat(o.name ) from 0 for 20),' ','(',sm."machineId",') - ',oo."seqNo")  as name
    FROM "ObbOperation" oo  
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    inner JOIN "Operation" o ON o.id= oo."operationId"
    inner join "SewingMachine" sm on sm.id=oo."sewingMachineId"
    INNER JOIN 
      "ProductionData" pd ON oo."id" = pd."obbOperationId"
    WHERE os.id =${obbsheetid} AND pd.timestamp LIKE ${date}
    GROUP BY  concat (substring(concat(o.name ) from 0 for 20),' ','(',sm."machineId",') - ',oo."seqNo"),oo."seqNo"

     order by  oo."seqNo" ;

`;
 
    //  console.log(obbsheetid,date)
 
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
    WHERE os.id = ${obbsheetid}  
     order by  oo."seqNo" ;`;

  
 
    return new Promise((resolve) => resolve(data ))
}