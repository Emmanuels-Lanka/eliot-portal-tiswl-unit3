"use server";
import { neon } from "@neondatabase/serverless";


export async function getData(obbsheetid:string,date:string)  : Promise<any[]>{
    const sql = neon(process.env.DATABASE_URL || "");
 
    const data = await sql`SELECT pd."productionCount" as count, substring(concat(oo."seqNo",'-',o.name ) from 0 for 20) as name  , pd.timestamp as timestamp, oo."seqNo"
    FROM "ProductionData" pd
    right JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    inner JOIN "Operation" o ON o.id= oo."operationId"
    WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
     order by  pd.timestamp ;`;

    console.log("data fetched",data.length,)


 
    return new Promise((resolve) => resolve(data ))
}

export async function geOperationList(obbsheetid:string ) : Promise<any[]>  {
    const sql = neon(process.env.DATABASE_URL || "");
 
    // const data = await sql`SELECT   concat(oo."seqNo",'-',o.name ) as name
    const data = await sql`SELECT substring(concat(oo."seqNo",'-',o.name ) from 0 for 20)  as name
    FROM "ObbOperation" oo  
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    inner JOIN "Operation" o ON o.id= oo."operationId"
    WHERE os.id = ${obbsheetid}  
     order by  oo."seqNo" ;`;

    console.log("geOperationList",data,)


 
    return new Promise((resolve) => resolve(data ))
}