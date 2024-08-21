"use server";
import { neon } from "@neondatabase/serverless";


export async function getData(obbsheetid:string,date:string)  : Promise<any[]>{
    const sql = neon(process.env.DATABASE_URL || "");
 
    const data = await sql`SELECT pd."productionCount" as count,concat(oo."seqNo",'-',o.name ) as name  , pd.timestamp as timestamp, oo."seqNo"
    FROM "ProductionData" pd
    right JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    right JOIN "Operation" o ON o.id= oo."operationId"
    WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
     order by  pd.timestamp ;`;

    console.log("data fetched",data,)


 
    return new Promise((resolve) => resolve(data ))
}